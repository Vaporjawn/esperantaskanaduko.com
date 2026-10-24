import { describe, it, expect } from 'vitest';
import {
  analyzeWord,
  analyzeSentence,
  isEsperantoWord,
  isEsperantoSentence,
  analyzeWordAll,
  getPartOfSpeechSummary,
  MorphologicalAnalyzer,
  MorphologicalSentenceAnalyzer,
} from '../src/index';

describe('Esperanto Analyzer', () => {
  describe('Word Analysis', () => {
    it('should analyze nouns correctly', () => {
      const result = analyzeWord('domo');
      expect(result.partOfSpeech).toBe('Noun');
      expect(result.morphology.root).toBe('dom');
      expect(result.morphology.isPlural).toBe(false);
      expect(result.morphology.isAccusative).toBe(false);
    });

    it('should analyze plural accusative nouns correctly', () => {
      const result = analyzeWord('domojn');
      expect(result.partOfSpeech).toBe('Noun');
      expect(result.morphology.root).toBe('dom');
      expect(result.morphology.isPlural).toBe(true);
      expect(result.morphology.isAccusative).toBe(true);
    });

    it('should analyze verbs correctly', () => {
      const result = analyzeWord('kuras');
      expect(result.partOfSpeech).toBe('Verb');
      expect(result.morphology.root).toBe('kur');
      expect(result.morphology.tense).toBe('present');
    });

    it('should analyze adjectives correctly', () => {
      const result = analyzeWord('bela');
      expect(result.partOfSpeech).toBe('Adjective');
      expect(result.morphology.root).toBe('bel');
      expect(result.morphology.isPlural).toBe(false);
      expect(result.morphology.isAccusative).toBe(false);
    });

    it('should analyze adverbs correctly', () => {
      const result = analyzeWord('rapide');
      expect(result.partOfSpeech).toBe('Adverb');
      expect(result.morphology.root).toBe('rapid');
    });

    it('should analyze the article correctly', () => {
      const result = analyzeWord('la');
      expect(result.partOfSpeech).toBe('Article');
      expect(result.morphology.root).toBe('la');
    });

    it('should analyze conjunctions correctly', () => {
      const result = analyzeWord('kaj');
      expect(result.partOfSpeech).toBe('Conjunction');
      expect(result.morphology.root).toBe('kaj');
    });

    it('should analyze interjections correctly', () => {
      const result = analyzeWord('ho!');
      expect(result.partOfSpeech).toBe('Interjection');
      expect(result.morphology.root).toBe('ho!');
    });

    it('should analyze numerals correctly', () => {
      const result = analyzeWord('tri');
      expect(result.partOfSpeech).toBe('Numeral');
      expect(result.morphology.root).toBe('tri');
    });

    it('should analyze prepositions correctly', () => {
      const result = analyzeWord('en');
      expect(result.partOfSpeech).toBe('Preposition');
      expect(result.morphology.root).toBe('en');
    });

    it('should analyze pronouns correctly', () => {
      const result = analyzeWord('mi');
      expect(result.partOfSpeech).toBe('Pronoun');
      expect(result.morphology.root).toBe('mi');
    });

    it('should handle unknown words', () => {
      const result = analyzeWord('notaword');
      expect(result.partOfSpeech).toBe('Unknown');
      expect(result.confidence).toBe(0);
    });
  });

  describe('Sentence Analysis', () => {
    it('should analyze simple sentences correctly', () => {
      const result = analyzeSentence('Mi amas vin.');
      expect(result.words).toHaveLength(3);
      expect(result.words[0].partOfSpeech).toBe('Pronoun'); // Mi
      expect(result.words[1].partOfSpeech).toBe('Verb'); // amas
      expect(result.words[2].partOfSpeech).toBe('Pronoun'); // vin
      expect(result.statistics.totalWords).toBe(3);
      expect(result.statistics.analyzedWords).toBe(3);
    });

    it('should analyze sentences with articles and adjectives', () => {
      const result = analyzeSentence('La bela knabino kantas.');
      expect(result.words).toHaveLength(4);
      expect(result.words[0].partOfSpeech).toBe('Article'); // La
      expect(result.words[1].partOfSpeech).toBe('Adjective'); // bela
      expect(result.words[2].partOfSpeech).toBe('Noun'); // knabino
      expect(result.words[3].partOfSpeech).toBe('Verb'); // kantas
    });

    it('should calculate statistics correctly', () => {
      const result = analyzeSentence('Mi amas la belan hundon.');
      expect(result.statistics.totalWords).toBe(5);
      expect(result.statistics.partOfSpeechCounts.Pronoun).toBe(1);
      expect(result.statistics.partOfSpeechCounts.Verb).toBe(1);
      expect(result.statistics.partOfSpeechCounts.Article).toBe(1);
      expect(result.statistics.partOfSpeechCounts.Adjective).toBe(1);
      expect(result.statistics.partOfSpeechCounts.Noun).toBe(1);
    });
  });

  describe('Validation Functions', () => {
    it('should correctly identify Esperanto words', () => {
      expect(isEsperantoWord('domo')).toBe(true);
      expect(isEsperantoWord('bela')).toBe(true);
      expect(isEsperantoWord('house')).toBe(false);
      expect(isEsperantoWord('beautiful')).toBe(false);
    });

    it('should correctly validate Esperanto sentences', () => {
      expect(isEsperantoSentence('Mi estas feliĉa.')).toBe(true);
      expect(isEsperantoSentence('La domo estas bela.')).toBe(true);
      expect(isEsperantoSentence('I am happy.')).toBe(false);
      expect(isEsperantoSentence('The house is beautiful.')).toBe(false);
    });
  });

  describe('Advanced Analysis', () => {
    it('should provide multiple analyses for ambiguous words', () => {
      // Some words might be analyzed differently by different analyzers
      const results = analyzeWordAll('bela');
      expect(results).toHaveLength(1); // In this case, 'bela' should only match adjective
      expect(results[0].partOfSpeech).toBe('Adjective');
    });

    it('should provide part of speech summaries', () => {
      const summary = getPartOfSpeechSummary('Mi amas la belan hundon.');
      expect(summary.Pronoun).toBe(1);
      expect(summary.Verb).toBe(1);
      expect(summary.Article).toBe(1);
      expect(summary.Adjective).toBe(1);
      expect(summary.Noun).toBe(1);
    });
  });

  describe('Class Instantiation', () => {
    it('should create MorphologicalAnalyzer instances', () => {
      const analyzer = new MorphologicalAnalyzer();
      expect(analyzer).toBeInstanceOf(MorphologicalAnalyzer);

      const result = analyzer.analyze('domo');
      expect(result.partOfSpeech).toBe('Noun');
    });

    it('should create MorphologicalSentenceAnalyzer instances', () => {
      const analyzer = new MorphologicalSentenceAnalyzer();
      expect(analyzer).toBeInstanceOf(MorphologicalSentenceAnalyzer);

      const result = analyzer.analyzeSentence('Mi amas vin.');
      expect(result.words).toHaveLength(3);
    });
  });

  describe('Complex Morphological Features', () => {
    it('should analyze verb tenses correctly', () => {
      const present = analyzeWord('kuras');
      const past = analyzeWord('kuris');
      const future = analyzeWord('kuros');

      expect(present.morphology.tense).toBe('present');
      expect(past.morphology.tense).toBe('past');
      expect(future.morphology.tense).toBe('future');
    });

    it('should analyze conditional and imperative moods', () => {
      const conditional = analyzeWord('kurus');
      const imperative = analyzeWord('kuru');

      expect(conditional.morphology.mood).toBe('conditional');
      expect(imperative.morphology.mood).toBe('imperative');
    });

    it('should analyze infinitive verbs', () => {
      const infinitive = analyzeWord('kuri');
      expect(infinitive.morphology.mood).toBe('infinitive');
    });

    it('should handle special adverbs', () => {
      const result = analyzeWord('nun');
      expect(result.partOfSpeech).toBe('Adverb');
      expect(result.morphology.root).toBe('nun');
    });

    it('should handle correlative pronouns', () => {
      const who = analyzeWord('kiu');
      const what = analyzeWord('kio');
      const where = analyzeWord('kie');

      expect(who.partOfSpeech).toBe('Pronoun');
      expect(what.partOfSpeech).toBe('Pronoun');
      expect(where.partOfSpeech).toBe('Pronoun');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty strings gracefully', () => {
      expect(() => analyzeWord('')).toThrow();
      expect(() => analyzeSentence('')).toThrow();
    });

    it('should handle null/undefined inputs gracefully', () => {
      expect(() => analyzeWord(null as unknown as string)).toThrow();
      expect(() => analyzeWord(undefined as unknown as string)).toThrow();
      expect(() => analyzeSentence(null as unknown as string)).toThrow();
      expect(() => analyzeSentence(undefined as unknown as string)).toThrow();
    });

    it('should handle whitespace-only inputs gracefully', () => {
      expect(() => analyzeWord('   ')).toThrow();
      expect(() => analyzeSentence('   ')).toThrow();
    });
  });
});
