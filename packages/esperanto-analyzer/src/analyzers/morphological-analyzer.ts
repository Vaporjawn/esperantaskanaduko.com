import type { AnalysisResult, PartOfSpeech, AnalysisOptions } from '../types';
import { createWord } from '../speech';
import {
  ALL_MORPHOLOGICAL_ANALYZERS,
  type MorphologicalAnalyzerInstance,
} from './morphological';

/**
 * Main morphological analyzer that coordinates all part-of-speech specific analyzers
 *
 * This class attempts to analyze a word using all available morphological analyzers
 * and returns the most appropriate analysis result.
 */
export class MorphologicalAnalyzer {
  private analyzers: MorphologicalAnalyzerInstance[];

  constructor() {
    // Initialize all morphological analyzers
    this.analyzers = ALL_MORPHOLOGICAL_ANALYZERS.map(
      (AnalyzerClass) => new AnalyzerClass()
    );
  }

  /**
   * Analyze a single word and return the most likely morphological analysis
   *
   * @param word - The word to analyze
   * @param options - Optional analysis parameters
   * @returns AnalysisResult with the best matching analysis
   */
  public analyze(
    word: string,
    options: AnalysisOptions = this.getDefaultOptions()
  ): AnalysisResult {
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    const cleanWord = word.trim();
    if (!cleanWord) {
      throw new Error('Word cannot be empty or only whitespace');
    }

    // Try each analyzer to find matches
    const matches: Array<{
      analyzer: MorphologicalAnalyzerInstance;
      confidence: number;
    }> = [];

    for (const analyzer of this.analyzers) {
      try {
        if (analyzer.match(cleanWord)) {
          const confidence = this.calculateConfidence(analyzer, cleanWord);
          matches.push({ analyzer, confidence });
        }
      } catch (error) {
        // Skip analyzers that throw errors (word doesn't match their pattern)
        continue;
      }
    }

    if (matches.length === 0) {
      // No analyzer matched - create unknown word result
      return this.createUnknownWordResult(cleanWord);
    }

    // Sort by confidence (highest first)
    matches.sort((a, b) => b.confidence - a.confidence);

    // Use the highest confidence analyzer
    const bestMatch = matches[0];

    if (!bestMatch) {
      return this.createUnknownWordResult(cleanWord);
    }

    try {
      const morphology = bestMatch.analyzer.extractMorphology(
        cleanWord,
        options
      );
      const speechPart = bestMatch.analyzer.partOfSpeech;
      const wordInstance = createWord(speechPart, cleanWord);

      return {
        word: cleanWord,
        partOfSpeech: speechPart,
        morphology,
        wordInstance,
        confidence: bestMatch.confidence,
        alternatives: this.getAlternatives(
          matches.slice(1),
          cleanWord,
          options
        ),
        analyzer: bestMatch.analyzer.name,
      };
    } catch (error) {
      // If analysis fails, create unknown word result
      return this.createUnknownWordResult(cleanWord);
    }
  }

  /**
   * Get all possible analyses for a word
   *
   * @param word - The word to analyze
   * @param options - Optional analysis parameters
   * @returns Array of all possible AnalysisResults
   */
  public analyzeAll(
    word: string,
    options: AnalysisOptions = {}
  ): AnalysisResult[] {
    if (!word || typeof word !== 'string') {
      throw new Error('Word must be a non-empty string');
    }

    const cleanWord = word.trim();
    if (!cleanWord) {
      throw new Error('Word cannot be empty or only whitespace');
    }

    const results: AnalysisResult[] = [];

    for (const analyzer of this.analyzers) {
      try {
        if (analyzer.match(cleanWord)) {
          const morphology = analyzer.extractMorphology(cleanWord, options);
          const speechPart = analyzer.partOfSpeech;
          const wordInstance = createWord(speechPart, cleanWord);
          const confidence = this.calculateConfidence(analyzer, cleanWord);

          results.push({
            word: cleanWord,
            partOfSpeech: speechPart,
            morphology,
            wordInstance,
            confidence,
            alternatives: [],
            analyzer: analyzer.name,
          });
        }
      } catch (error) {
        // Skip analyzers that can't process this word
        continue;
      }
    }

    // Sort by confidence (highest first)
    results.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));

    return results;
  }

  /**
   * Check if a word can be analyzed by any analyzer
   *
   * @param word - The word to check
   * @returns true if the word can be analyzed
   */
  public canAnalyze(word: string): boolean {
    if (!word || typeof word !== 'string') {
      return false;
    }

    const cleanWord = word.trim();
    if (!cleanWord) {
      return false;
    }

    return this.analyzers.some((analyzer) => {
      try {
        return analyzer.match(cleanWord);
      } catch {
        return false;
      }
    });
  }

  /**
   * Get a specific analyzer by part of speech
   *
   * @param partOfSpeech - The part of speech to get analyzer for
   * @returns The analyzer instance or undefined if not found
   */
  public getAnalyzer(
    partOfSpeech: PartOfSpeech
  ): MorphologicalAnalyzerInstance | undefined {
    return this.analyzers.find(
      (analyzer) => analyzer.partOfSpeech === partOfSpeech
    );
  }

  /**
   * Calculate confidence score for an analyzer match
   * Higher scores indicate better matches
   */
  private calculateConfidence(
    analyzer: MorphologicalAnalyzerInstance,
    word: string
  ): number {
    let confidence = 0.5; // Base confidence

    // Exact matches get higher confidence
    if (analyzer.partOfSpeech === 'Article' && word.toLowerCase() === 'la') {
      confidence = 1.0;
    }

    // Special high-confidence matches for specific word types
    if (analyzer.partOfSpeech === 'Numeral') {
      // Check if it's a basic number - these should have highest priority
      const basicNumbers = [
        'nul',
        'unu',
        'du',
        'tri',
        'kvar',
        'kvin',
        'ses',
        'sep',
        'ok',
        'naŭ',
        'dek',
        'cent',
        'mil',
        'milion',
        'miliard',
      ];
      if (basicNumbers.includes(word.toLowerCase())) {
        confidence = 0.95; // Very high confidence for basic numbers
      }
    }

    if (analyzer.partOfSpeech === 'Pronoun') {
      // Check if it's a correlative pronoun - these should have high priority
      const correlativePronouns = [
        // Interrogative/relative
        'kiu',
        'kio',
        'kia',
        'kie',
        'kial',
        'kiam',
        'kiom',
        'kiel',
        // Demonstrative
        'tiu',
        'tio',
        'tia',
        'tie',
        'tial',
        'tiam',
        'tiom',
        'tiel',
        // Indefinite
        'iu',
        'io',
        'ia',
        'ie',
        'ial',
        'iam',
        'iom',
        'iel',
        // Universal
        'ĉiu',
        'ĉio',
        'ĉia',
        'ĉie',
        'ĉial',
        'ĉiam',
        'ĉiom',
        'ĉiel',
        // Negative
        'neniu',
        'nenio',
        'nenia',
        'nenie',
        'nenial',
        'neniam',
        'neniom',
        'neniel',
      ];
      if (correlativePronouns.includes(word.toLowerCase())) {
        confidence = 0.9; // High confidence for correlative pronouns
      }
    }

    // Longer words that match get higher confidence for complex analyzers
    if (
      word.length > 5 &&
      ['Verb', 'Noun', 'Adjective'].includes(analyzer.partOfSpeech)
    ) {
      confidence += 0.2;
    }

    // Special cases for specific patterns
    switch (analyzer.partOfSpeech) {
      case 'Noun':
        if (/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]+o(j?n?)$/.test(word)) {
          confidence += 0.3;
        }
        break;

      case 'Verb':
        if (/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]+(as|is|os|us|u|i)$/.test(word)) {
          confidence += 0.3;
        }
        break;

      case 'Adjective':
        if (/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]+a(j?n?)$/.test(word)) {
          confidence += 0.3;
        }
        break;

      case 'Adverb':
        if (/^[a-zA-ZĉĝĵĥŝŭĈĜĴĤŜŬ]+e$/.test(word)) {
          confidence += 0.3;
        }
        break;
    }

    return Math.min(confidence, 1.0); // Cap at 1.0
  }

  /**
   * Get alternative analyses with lower confidence
   */
  private getAlternatives(
    matches: Array<{
      analyzer: MorphologicalAnalyzerInstance;
      confidence: number;
    }>,
    word: string,
    options: AnalysisOptions
  ): AnalysisResult[] {
    return matches.slice(0, 3).map((match) => {
      // Limit to top 3 alternatives
      try {
        const morphology = match.analyzer.extractMorphology(word, options);
        const speechPart = match.analyzer.partOfSpeech;
        const wordInstance = createWord(speechPart, word);

        return {
          word,
          partOfSpeech: speechPart,
          morphology,
          wordInstance,
          confidence: match.confidence,
          alternatives: [],
          analyzer: match.analyzer.name,
        };
      } catch {
        // Return minimal result if analysis fails
        return {
          word,
          partOfSpeech: 'Unknown' as PartOfSpeech,
          morphology: { root: word, isPlural: false, isAccusative: false },
          wordInstance: null,
          confidence: 0,
          alternatives: [],
          analyzer: match.analyzer.name,
        };
      }
    });
  }

  /**
   * Create result for unknown words
   */
  private createUnknownWordResult(word: string): AnalysisResult {
    return {
      word,
      partOfSpeech: 'Unknown' as PartOfSpeech,
      morphology: {
        root: word,
        isPlural: false,
        isAccusative: false,
      },
      wordInstance: null,
      confidence: 0,
      alternatives: [],
      analyzer: 'Unknown',
    };
  }

  /**
   * Get default analysis options
   */
  private getDefaultOptions(): AnalysisOptions {
    return {
      includeFeatures: true,
      strictMode: false,
      optimized: true,
    };
  }
}
