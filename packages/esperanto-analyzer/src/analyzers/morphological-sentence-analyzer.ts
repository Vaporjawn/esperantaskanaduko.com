import type { AnalysisResult, PartOfSpeech } from '../types';
import { MorphologicalAnalyzer } from './morphological-analyzer';

/**
 * Options for sentence analysis
 */
export interface SentenceAnalysisOptions {
  /** Whether to include confidence scores in the output */
  includeConfidence?: boolean;
  /** Whether to include alternative analyses for ambiguous words */
  includeAlternatives?: boolean;
  /** Whether to include morphological details */
  includeMorphology?: boolean;
  /** Maximum number of alternatives to include per word */
  maxAlternatives?: number;
  /** Whether to preserve original word casing */
  preserveCase?: boolean;
}

/**
 * Result of sentence analysis
 */
export interface SentenceAnalysisResult {
  /** Original sentence */
  originalSentence: string;
  /** Array of word analysis results */
  words: AnalysisResult[];
  /** Overall analysis statistics */
  statistics: {
    totalWords: number;
    analyzedWords: number;
    unknownWords: number;
    averageConfidence: number;
    partOfSpeechCounts: Record<string, number>;
  };
}

/**
 * Morphological sentence analyzer for Esperanto
 *
 * This class processes entire sentences by breaking them into words
 * and analyzing each word using the MorphologicalAnalyzer.
 */
export class MorphologicalSentenceAnalyzer {
  private wordAnalyzer: MorphologicalAnalyzer;

  constructor() {
    this.wordAnalyzer = new MorphologicalAnalyzer();
  }

  /**
   * Analyze a complete sentence
   *
   * @param sentence - The sentence to analyze
   * @param options - Analysis options
   * @returns Complete sentence analysis result
   */
  public analyzeSentence(
    sentence: string,
    options: SentenceAnalysisOptions = {}
  ): SentenceAnalysisResult {
    if (!sentence || typeof sentence !== 'string') {
      throw new Error('Sentence must be a non-empty string');
    }

    const cleanSentence = sentence.trim();
    if (!cleanSentence) {
      throw new Error('Sentence cannot be empty or only whitespace');
    }

    // Set default options
    const analysisOptions = {
      includeConfidence: true,
      includeAlternatives: false,
      includeMorphology: true,
      maxAlternatives: 2,
      preserveCase: false,
      ...options,
    };

    // Tokenize the sentence into words
    const words = this.tokenize(cleanSentence);

    // Analyze each word
    const wordAnalyses: AnalysisResult[] = [];

    for (const word of words) {
      try {
        let analysisResult: AnalysisResult;

        if (analysisOptions.includeAlternatives) {
          // Get all possible analyses and use the best one as primary
          const allAnalyses = this.wordAnalyzer.analyzeAll(word);
          if (allAnalyses.length > 0) {
            const fullResult = allAnalyses[0];
            if (fullResult) {
              analysisResult = {
                word: fullResult.word,
                partOfSpeech: fullResult.partOfSpeech,
                morphology: fullResult.morphology,
                wordInstance: fullResult.wordInstance,
                confidence: fullResult.confidence,
                analyzer: fullResult.analyzer,
                alternatives: allAnalyses.slice(
                  1,
                  analysisOptions.maxAlternatives + 1
                ),
              };
            } else {
              analysisResult = this.wordAnalyzer.analyze(word);
            }
          } else {
            analysisResult = this.wordAnalyzer.analyze(word);
          }
        } else {
          analysisResult = this.wordAnalyzer.analyze(word);
        }

        // Apply options to filter result
        if (!analysisOptions.includeConfidence) {
          delete (analysisResult as AnalysisResult).confidence;
        }

        if (!analysisOptions.includeMorphology) {
          delete (analysisResult as AnalysisResult).morphology;
        }

        if (!analysisOptions.includeAlternatives) {
          analysisResult = {
            ...analysisResult,
            alternatives: [],
          };
        }

        // Preserve original case if requested
        if (analysisOptions.preserveCase) {
          analysisResult = {
            ...analysisResult,
            word: word,
          };
        }

        wordAnalyses.push(analysisResult);
      } catch (error) {
        // Create unknown word result for failed analysis
        wordAnalyses.push({
          word: analysisOptions.preserveCase ? word : word.toLowerCase(),
          partOfSpeech: 'Unknown' as PartOfSpeech,
          morphology: {
            root: word.toLowerCase(),
            isPlural: false,
            isAccusative: false,
          },
          wordInstance: null,
          confidence: 0,
          alternatives: [],
          analyzer: 'Unknown',
        });
      }
    }

    // Calculate statistics
    const statistics = this.calculateStatistics(wordAnalyses);

    return {
      originalSentence: cleanSentence,
      words: wordAnalyses,
      statistics,
    };
  }

  /**
   * Analyze multiple sentences
   *
   * @param sentences - Array of sentences to analyze
   * @param options - Analysis options
   * @returns Array of sentence analysis results
   */
  public analyzeSentences(
    sentences: string[],
    options: SentenceAnalysisOptions = {}
  ): SentenceAnalysisResult[] {
    return sentences.map((sentence) => this.analyzeSentence(sentence, options));
  }

  /**
   * Analyze a paragraph (multiple sentences)
   *
   * @param paragraph - The paragraph to analyze
   * @param options - Analysis options
   * @returns Array of sentence analysis results
   */
  public analyzeParagraph(
    paragraph: string,
    options: SentenceAnalysisOptions = {}
  ): SentenceAnalysisResult[] {
    if (!paragraph || typeof paragraph !== 'string') {
      throw new Error('Paragraph must be a non-empty string');
    }

    // Split paragraph into sentences
    const sentences = this.splitIntoSentences(paragraph);

    return this.analyzeSentences(sentences, options);
  }

  /**
   * Get analysis summary for a sentence
   *
   * @param sentence - The sentence to analyze
   * @returns Summary of parts of speech found
   */
  public getSummary(sentence: string): Record<string, number> {
    const result = this.analyzeSentence(sentence, {
      includeConfidence: false,
      includeAlternatives: false,
      includeMorphology: false,
    });

    return result.statistics.partOfSpeechCounts;
  }

  /**
   * Check if a sentence is valid Esperanto
   *
   * @param sentence - The sentence to validate
   * @param threshold - Minimum percentage of words that must be analyzable (0-1)
   * @returns true if the sentence meets the threshold
   */
  public isValidEsperanto(sentence: string, threshold: number = 0.8): boolean {
    try {
      const result = this.analyzeSentence(sentence, {
        includeConfidence: true,
        includeAlternatives: false,
        includeMorphology: false,
      });

      const analysisRate =
        result.statistics.analyzedWords / result.statistics.totalWords;
      return analysisRate >= threshold;
    } catch {
      return false;
    }
  }

  /**
   * Tokenize a sentence into words
   * Handles Esperanto-specific punctuation and word boundaries
   */
  private tokenize(sentence: string): string[] {
    // Remove punctuation but preserve apostrophes within words
    // Split on whitespace and common punctuation
    const tokens = sentence
      .replace(/([.!?;:,])/g, ' $1 ') // Add spaces around punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0)
      .filter((token) => !/^[.!?;:,]+$/.test(token)); // Remove pure punctuation tokens

    return tokens;
  }

  /**
   * Split paragraph into sentences
   */
  private splitIntoSentences(paragraph: string): string[] {
    // Split on sentence-ending punctuation
    const sentences = paragraph
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return sentences;
  }

  /**
   * Calculate analysis statistics
   */
  private calculateStatistics(
    wordAnalyses: AnalysisResult[]
  ): SentenceAnalysisResult['statistics'] {
    const totalWords = wordAnalyses.length;
    const analyzedWords = wordAnalyses.filter(
      (w) => w.partOfSpeech !== 'Unknown'
    ).length;
    const unknownWords = totalWords - analyzedWords;

    // Calculate average confidence (excluding unknown words)
    const confidenceSum = wordAnalyses
      .filter(
        (w) => w.partOfSpeech !== 'Unknown' && typeof w.confidence === 'number'
      )
      .reduce((sum, w) => sum + (w.confidence || 0), 0);
    const wordsWithConfidence = wordAnalyses.filter(
      (w) => typeof w.confidence === 'number'
    ).length;
    const averageConfidence =
      wordsWithConfidence > 0 ? confidenceSum / wordsWithConfidence : 0;

    // Count parts of speech
    const partOfSpeechCounts: Record<string, number> = {};
    wordAnalyses.forEach((word) => {
      const pos = word.partOfSpeech;
      partOfSpeechCounts[pos] = (partOfSpeechCounts[pos] || 0) + 1;
    });

    return {
      totalWords,
      analyzedWords,
      unknownWords,
      averageConfidence,
      partOfSpeechCounts,
    };
  }
}
