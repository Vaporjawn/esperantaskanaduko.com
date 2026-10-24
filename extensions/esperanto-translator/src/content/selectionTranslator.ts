export class SelectionTranslator {
  private tooltip: HTMLDivElement | null = null;

  /**
   * Shows a translation tooltip near the selected text
   */
  async showTranslation(selectedText: string): Promise<void> {
    // Get translation from background script
    const response = await chrome.runtime.sendMessage({
      type: 'TRANSLATE_SELECTION',
      payload: { text: selectedText },
    });

    if (!response.success) {
      console.error('Translation failed:', response.error);
      return;
    }

    const translatedText = response.data.translatedText;
    const detectedLanguage = response.detectedLanguage;

    // Show tooltip with translation
    this.displayTooltip(selectedText, translatedText, detectedLanguage);
  }

  /**
   * Creates and displays the translation tooltip
   */
  private displayTooltip(
    originalText: string,
    translatedText: string,
    detectedLanguage?: string
  ): void {
    // Remove existing tooltip if any
    this.removeTooltip();

    // Get selection position
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Create tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.id = 'esperanto-translator-tooltip';
    this.tooltip.innerHTML = this.getTooltipHTML(originalText, translatedText, detectedLanguage);

    // Apply styles
    this.applyTooltipStyles(this.tooltip, rect);

    // Add to page
    document.body.appendChild(this.tooltip);

    // Add event listeners
    this.addTooltipEventListeners();
  }

  /**
   * Generates the HTML content for the tooltip
   */
  private getTooltipHTML(
    originalText: string,
    translatedText: string,
    detectedLanguage?: string
  ): string {
    return `
      <div class="ett-header">
        <div class="ett-title">
          <svg class="ett-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 8l6 6"></path>
            <path d="m4 14 6-6 2-3"></path>
            <path d="M2 5h12"></path>
            <path d="M7 2h1"></path>
            <path d="m22 22-5-10-5 10"></path>
            <path d="M14 18h6"></path>
          </svg>
          <span>Esperanto Translation</span>
        </div>
        <button class="ett-close" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      ${detectedLanguage ? `
        <div class="ett-language">
          <svg class="ett-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Detected: ${detectedLanguage.toUpperCase()}
        </div>
      ` : ''}
      <div class="ett-content">
        <div class="ett-section">
          <div class="ett-label">Original</div>
          <div class="ett-text ett-original">${this.escapeHtml(originalText)}</div>
        </div>
        <div class="ett-divider"></div>
        <div class="ett-section">
          <div class="ett-label">Esperanto</div>
          <div class="ett-text ett-translation">${this.escapeHtml(translatedText)}</div>
        </div>
      </div>
      <div class="ett-actions">
        <button class="ett-button ett-copy" data-text="${this.escapeHtml(translatedText)}">
          <svg class="ett-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Translation
        </button>
      </div>
    `;
  }

  /**
   * Applies styles to the tooltip
   */
  private applyTooltipStyles(tooltip: HTMLDivElement, selectionRect: DOMRect): void {
    // Calculate position
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = selectionRect.bottom + scrollY + 10;
    let left = selectionRect.left + scrollX;

    // Adjust if tooltip would go off-screen
    const tooltipWidth = 350;
    const tooltipHeight = 250; // Approximate

    if (left + tooltipWidth > window.innerWidth + scrollX) {
      left = window.innerWidth + scrollX - tooltipWidth - 20;
    }

    if (top + tooltipHeight > window.innerHeight + scrollY) {
      // Show above selection if not enough space below
      top = selectionRect.top + scrollY - tooltipHeight - 10;
    }

    // Base styles
    Object.assign(tooltip.style, {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      width: '350px',
      maxWidth: '90vw',
      backgroundColor: '#ffffff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '2147483647',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#333',
      animation: 'ettFadeIn 0.2s ease-out',
    });

    // Inject styles if not already present
    if (!document.getElementById('esperanto-translator-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'esperanto-translator-styles';
      styleSheet.textContent = this.getTooltipCSS();
      document.head.appendChild(styleSheet);
    }
  }

  /**
   * Returns the CSS for the tooltip
   */
  private getTooltipCSS(): string {
    return `
      @keyframes ettFadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      #esperanto-translator-tooltip * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #esperanto-translator-tooltip .ett-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px 8px 0 0;
      }

      #esperanto-translator-tooltip .ett-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #ffffff;
        font-weight: 600;
        font-size: 14px;
      }

      #esperanto-translator-tooltip .ett-icon {
        flex-shrink: 0;
      }

      #esperanto-translator-tooltip .ett-close {
        background: none;
        border: none;
        color: #ffffff;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      #esperanto-translator-tooltip .ett-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      #esperanto-translator-tooltip .ett-language {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background-color: #f5f5f5;
        font-size: 12px;
        color: #666;
        border-bottom: 1px solid #e0e0e0;
      }

      #esperanto-translator-tooltip .ett-content {
        padding: 16px;
      }

      #esperanto-translator-tooltip .ett-section {
        margin-bottom: 12px;
      }

      #esperanto-translator-tooltip .ett-section:last-child {
        margin-bottom: 0;
      }

      #esperanto-translator-tooltip .ett-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: #999;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      #esperanto-translator-tooltip .ett-text {
        font-size: 14px;
        line-height: 1.6;
        color: #333;
      }

      #esperanto-translator-tooltip .ett-translation {
        font-weight: 500;
        color: #667eea;
      }

      #esperanto-translator-tooltip .ett-divider {
        height: 1px;
        background-color: #e0e0e0;
        margin: 12px 0;
      }

      #esperanto-translator-tooltip .ett-actions {
        padding: 12px 16px;
        border-top: 1px solid #e0e0e0;
        background-color: #fafafa;
        border-radius: 0 0 8px 8px;
      }

      #esperanto-translator-tooltip .ett-button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 8px 12px;
        background-color: #667eea;
        color: #ffffff;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        justify-content: center;
      }

      #esperanto-translator-tooltip .ett-button:hover {
        background-color: #5568d3;
      }

      #esperanto-translator-tooltip .ett-button:active {
        transform: scale(0.98);
      }
    `;
  }

  /**
   * Adds event listeners to tooltip buttons
   */
  private addTooltipEventListeners(): void {
    if (!this.tooltip) return;

    // Close button
    const closeBtn = this.tooltip.querySelector('.ett-close');
    closeBtn?.addEventListener('click', () => this.removeTooltip());

    // Copy button
    const copyBtn = this.tooltip.querySelector('.ett-copy');
    copyBtn?.addEventListener('click', async (e) => {
      const button = e.currentTarget as HTMLButtonElement;
      const textToCopy = button.getAttribute('data-text') || '';

      try {
        await navigator.clipboard.writeText(textToCopy);
        button.innerHTML = `
          <svg class="ett-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!
        `;
        button.style.backgroundColor = '#4caf50';

        setTimeout(() => {
          if (button.isConnected) {
            button.innerHTML = `
              <svg class="ett-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Translation
            `;
            button.style.backgroundColor = '#667eea';
          }
        }, 2000);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    });

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (this.tooltip && !this.tooltip.contains(e.target as Node)) {
        this.removeTooltip();
        document.removeEventListener('click', handleClickOutside);
      }
    };

    // Add listener after a short delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.removeTooltip();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Removes the tooltip from the page
   */
  removeTooltip(): void {
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  /**
   * Escapes HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
