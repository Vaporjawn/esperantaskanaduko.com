export class PageTranslator {
  private textNodes: Text[] = [];
  private originalContent = new Map<Text, string>();
  private translatedContent = new Map<Text, string>();
  private isTranslated = false;
  private observer: MutationObserver | null = null;
  private detectedLanguage: string | null = null;
  private isTranslating = false;
  private readonly MAX_BATCH_SIZE = 100; // Maximum texts per API call
  private readonly MIN_TEXT_LENGTH = 2; // Minimum text length to translate

  /**
   * Check if an element is visible on the page
   */
  private isElementVisible(element: HTMLElement): boolean {
    if (!element) return false;

    // Check if element is in the viewport or has dimensions
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    // Element must be visible (not display:none or visibility:hidden)
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }

    // Element must have dimensions (not just a zero-height element)
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }

    // Element must have opacity > 0
    if (parseFloat(style.opacity) === 0) {
      return false;
    }

    return true;
  }

  /**
   * Check if an element should be excluded from translation
   */
  private shouldExcludeElement(element: HTMLElement | null): boolean {
    if (!element) return true;

    // Check for translate="no" attribute on element or ancestors
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      if (current.getAttribute('translate') === 'no') {
        return true;
      }
      current = current.parentElement;
    }

    // Exclude specific element types
    const excludedTags = [
      'SCRIPT',
      'STYLE',
      'CODE',
      'PRE',
      'NOSCRIPT',
      'IFRAME',
      'OBJECT',
      'EMBED',
      'SVG',
      'MATH',
    ];

    if (excludedTags.includes(element.tagName)) {
      return true;
    }

    // Exclude form inputs (for now)
    if (element.matches('input, textarea, select, option')) {
      return true;
    }

    // Exclude elements with specific classes (common for code blocks)
    const excludedClasses = ['hljs', 'highlight', 'code-block', 'syntax'];
    for (const className of excludedClasses) {
      if (element.classList.contains(className)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Extract all translatable text nodes from the page
   */
  extractTextNodes(root: Node = document.body): Text[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node: Node) => {
        const text = node.textContent?.trim();

        // Skip empty or very short text nodes
        if (!text || text.length < this.MIN_TEXT_LENGTH) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip text that's only punctuation or special characters
        if (/^[\s\p{P}\p{S}]+$/u.test(text)) {
          return NodeFilter.FILTER_REJECT;
        }

        const parent = node.parentElement;
        if (!parent) {
          return NodeFilter.FILTER_REJECT;
        }

        // Check if parent element should be excluded
        if (this.shouldExcludeElement(parent)) {
          return NodeFilter.FILTER_REJECT;
        }

        // Check if parent element is visible
        if (!this.isElementVisible(parent)) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes: Text[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      nodes.push(node as Text);
    }

    return nodes;
  }

  /**
   * Send progress update to popup
   */
  private sendProgressUpdate(current: number, total: number, status: string): void {
    const percentage = Math.round((current / total) * 100);
    chrome.runtime.sendMessage({
      type: 'TRANSLATION_PROGRESS',
      payload: {
        current,
        total,
        percentage,
        status,
      },
    }).catch(() => {
      // Popup might be closed, ignore errors
    });
  }

  /**
   * Translate all text on the page
   */
  async translatePage(): Promise<void> {
    if (this.isTranslated || this.isTranslating) {
      return;
    }

    this.isTranslating = true;

    try {
      // Extract text nodes
      this.sendProgressUpdate(0, 100, 'Extracting text...');
      this.textNodes = this.extractTextNodes();

      if (this.textNodes.length === 0) {
        console.log('No translatable text found on page');
        this.isTranslating = false;
        return;
      }

      console.log(`Found ${this.textNodes.length} text nodes to translate`);
      this.sendProgressUpdate(10, 100, `Found ${this.textNodes.length} text elements`);

      // Store original content
      this.textNodes.forEach(node => {
        this.originalContent.set(node, node.textContent || '');
      });

      // Prepare texts for batch translation
      const texts = this.textNodes.map(node => node.textContent || '');

      // Split into chunks to avoid overwhelming the API
      const chunks: string[][] = [];
      for (let i = 0; i < texts.length; i += this.MAX_BATCH_SIZE) {
        chunks.push(texts.slice(i, i + this.MAX_BATCH_SIZE));
      }

      console.log(`Split into ${chunks.length} chunks for translation`);
      this.sendProgressUpdate(20, 100, 'Sending to translation service...');

      // Translate each chunk
      const allTranslations: string[] = [];

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const chunk = chunks[chunkIndex];

        // Report progress
        const chunkProgress = 20 + Math.round(((chunkIndex + 1) / chunks.length) * 40);
        this.sendProgressUpdate(
          chunkProgress,
          100,
          `Translating chunk ${chunkIndex + 1}/${chunks.length}...`
        );

        try {
          // Send to background script for translation
          const response = await chrome.runtime.sendMessage({
            type: 'BATCH_TRANSLATE',
            payload: { texts: chunk },
          });

          if (response.success) {
            // Store detected language from first chunk
            if (chunkIndex === 0 && response.detectedLanguage) {
              this.detectedLanguage = response.detectedLanguage;
            }

            // Collect translations
            allTranslations.push(...response.data.translations);
          } else {
            console.error('Translation chunk failed:', response.error);
            // Use original text as fallback
            allTranslations.push(...chunk);
          }
        } catch (error) {
          console.error('Translation chunk error:', error);
          // Use original text as fallback
          allTranslations.push(...chunk);
        }

        // Small delay between chunks to avoid rate limiting
        if (chunkIndex < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      this.sendProgressUpdate(60, 100, 'Translation received, applying...');

      // Apply all translations with progress updates
      const batchSize = Math.ceil(this.textNodes.length / 10);
      this.textNodes.forEach((node, index) => {
        if (index < allTranslations.length) {
          const translated = allTranslations[index];
          this.translatedContent.set(node, translated);

          // Only replace if translation is different from original
          if (translated !== node.textContent) {
            node.textContent = translated;
          }

          // Send progress update every batch
          if (index % batchSize === 0) {
            const progress = 60 + Math.round((index / this.textNodes.length) * 35);
            this.sendProgressUpdate(
              progress,
              100,
              `Applying translations (${index + 1}/${this.textNodes.length})...`
            );
          }
        }
      });

      this.sendProgressUpdate(95, 100, 'Finalizing...');
      this.isTranslated = true;

      // Start observing for dynamic content
      this.observeMutations();

      this.sendProgressUpdate(100, 100, 'Translation complete!');
      console.log('Page translation complete');
    } catch (error) {
      console.error('Translation error:', error);
      this.sendProgressUpdate(0, 0, 'Translation failed');
      throw error;
    } finally {
      this.isTranslating = false;
    }
  }

  /**
   * Restore original content
   */
  restoreOriginal(): void {
    if (!this.isTranslated) {
      return;
    }

    this.textNodes.forEach(node => {
      const original = this.originalContent.get(node);
      if (original !== undefined) {
        node.textContent = original;
      }
    });

    this.isTranslated = false;

    // Stop observing
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Toggle between original and translated
   */
  async toggleTranslation(): Promise<void> {
    if (this.isTranslated) {
      // Currently translated, restore original
      this.restoreOriginal();
    } else if (this.translatedContent.size > 0) {
      // Have translations cached, apply them
      this.textNodes.forEach(node => {
        const translated = this.translatedContent.get(node);
        if (translated !== undefined) {
          node.textContent = translated;
        }
      });
      this.isTranslated = true;
      this.observeMutations();
    } else {
      // No translations yet, perform initial translation
      await this.translatePage();
    }
  }

  /**
   * Get current translation state
   */
  getTranslationState(): boolean {
    return this.isTranslated;
  }

  /**
   * Get detected language code
   */
  getDetectedLanguage(): string | null {
    return this.detectedLanguage;
  }

  /**
   * Check if currently translating
   */
  isTranslationInProgress(): boolean {
    return this.isTranslating;
  }

  /**
   * Get translation statistics
   */
  getStats(): {
    totalNodes: number;
    translatedNodes: number;
    detectedLanguage: string | null;
    isTranslated: boolean;
  } {
    return {
      totalNodes: this.textNodes.length,
      translatedNodes: this.translatedContent.size,
      detectedLanguage: this.detectedLanguage,
      isTranslated: this.isTranslated,
    };
  }

  /**
   * Get the current page HTML (translated or original)
   */
  getPageHTML(): { html: string; isTranslated: boolean } {
    return {
      html: document.body.innerHTML,
      isTranslated: this.isTranslated,
    };
  }

  /**
   * Watch for dynamic content changes and translate new content
   */
  observeMutations(): void {
    if (this.observer) {
      return; // Already observing
    }

    this.observer = new MutationObserver(mutations => {
      if (!this.isTranslated || this.isTranslating) {
        return;
      }

      // Collect all added text nodes
      const newTextNodes: Text[] = [];

      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Extract text nodes from added element
            const textsInNode = this.extractTextNodes(node);
            newTextNodes.push(...textsInNode);
          } else if (node.nodeType === Node.TEXT_NODE) {
            // Check if text node itself is translatable
            const parent = node.parentElement;
            const text = node.textContent?.trim();

            if (
              text &&
              text.length >= this.MIN_TEXT_LENGTH &&
              parent &&
              !this.shouldExcludeElement(parent) &&
              this.isElementVisible(parent)
            ) {
              newTextNodes.push(node as Text);
            }
          }
        });
      });

      // Translate new nodes if any
      if (newTextNodes.length > 0) {
        console.log(`Translating ${newTextNodes.length} new text nodes`);
        this.translateNewNodes(newTextNodes);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Translate newly added nodes
   */
  private async translateNewNodes(nodes: Text[]): Promise<void> {
    // Store original content
    nodes.forEach(node => {
      if (!this.originalContent.has(node)) {
        this.originalContent.set(node, node.textContent || '');
      }
    });

    // Prepare texts for translation
    const texts = nodes.map(node => node.textContent || '');

    try {
      // Send to background script for translation
      const response = await chrome.runtime.sendMessage({
        type: 'BATCH_TRANSLATE',
        payload: { texts },
      });

      if (response.success) {
        // Apply translations
        nodes.forEach((node, index) => {
          const translated = response.data.translations[index];
          this.translatedContent.set(node, translated);

          // Only replace if translation is different
          if (translated !== node.textContent) {
            node.textContent = translated;
          }
        });

        // Add to tracked nodes
        this.textNodes.push(...nodes);
      }
    } catch (error) {
      console.error('Dynamic content translation error:', error);
    }
  }
}
