# Esperanto Analyzer

[![npm version](https://badge.fury.io/js/@vaporjawn%2Fesperanto-analyzer.svg)](https://badge.fury.io/js/@vaporjawn%2Fesperanto-analyzer)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-29%20passing-brightgreen.svg)](https://github.com/victorwilliams/esperanto-analyzer)

Modern TypeScript morphological analyzer for Esperanto text with comprehensive part-of-speech identification and linguistic analysis capabilities.

## Features

- 🔍 **Complete Morphological Analysis**: Identifies all major Esperanto parts of speech
- 📝 **Rich Linguistic Information**: Extracts tense, mood, case, number, and other morphological features
- 🎯 **High Accuracy**: Confidence-based analysis with intelligent precedence rules
- 📊 **Sentence-Level Analysis**: Analyzes complete sentences with statistical summaries
- 🔧 **TypeScript Native**: Full type safety with comprehensive type definitions
- 🚀 **Modern Package**: Dual ESM/CJS support with tree-shaking capabilities
- ✅ **Thoroughly Tested**: 29 comprehensive tests covering all functionality

## Parts of Speech Supported

- **Nouns** (substantivoj) - with case and number detection
- **Verbs** (verboj) - with tense, mood, and voice analysis
- **Adjectives** (adjektivoj) - with case and number agreement
- **Adverbs** (adverboj) - including derived and correlative forms
- **Prepositions** (prepozicioj) - complete set recognition
- **Conjunctions** (konjunkcioj) - coordinating and subordinating
- **Pronouns** (pronomoj) - personal, correlative, and demonstrative
- **Numerals** (numeraloj) - cardinal, ordinal, and fractional
- **Articles** (artikoloj) - definite article recognition
- **Interjections** (interjekcio) - emotional expressions

## Quick Start

### Installation

```bash
npm install esperanto-analyzer
```

### Basic Usage

```javascript
// CommonJS
const { analyzeWord, analyzeSentence } = require('@vaporjawn/esperanto-analyzer');

// ESM
import { analyzeWord, analyzeSentence } from '@vaporjawn/esperanto-analyzer';

// Analyze a single word
const result = analyzeWord('librojn');
console.log(result.partOfSpeech); // 'Noun'
console.log(result.morphology.isPlural); // true
console.log(result.morphology.isAccusative); // true

// Analyze a sentence
const sentence = analyzeSentence('Mi legas la belan libron');
console.log(sentence.statistics.totalWords); // 5
console.log(sentence.words[0].partOfSpeech); // 'Pronoun'
```

### Individual Component Usage

```typescript
import {
  MorphologicalAnalyzer,
  MorphologicalSentenceAnalyzer,
  VerbMorphologicalAnalyzer
} from '@vaporjawn/esperanto-analyzer';

// Use specific analyzers directly
const verbAnalyzer = new VerbMorphologicalAnalyzer();
const result = verbAnalyzer.analyze('kuranta');
console.log(result.morphologicalFeatures);
// Output: { tense: 'present', voice: 'active', mood: 'participle' }
```

## Demo

See the complete working example in `demo.js`:

```bash
node demo.js
```

This demonstrates all major features:
- Word analysis with morphological features
- Sentence analysis with statistics
- Esperanto text validation
- Multiple analysis for ambiguous words
- Part of speech summaries

## API Reference

### EsperantoAnalyzer

Main analyzer class providing high-level interface.

#### Methods

- `analyzeWord(word: string): AnalysisResult` - Analyze single word
- `analyzeSentence(sentence: string): SentenceAnalysisResult` - Analyze complete sentence
- `getMultipleAnalyses(word: string): AnalysisResult[]` - Get all possible analyses
- `isValidEsperanto(text: string): boolean` - Validate Esperanto text
- `getPartOfSpeechSummary(text: string): Record<string, number>` - Get POS statistics

### AnalysisResult

```typescript
interface AnalysisResult {
  word: string;
  partOfSpeech: PartOfSpeech;
  morphology: MorphologicalFeatures;
  confidence: number;
  alternatives: AnalysisResult[];
}
```

### MorphologicalFeatures

```typescript
interface MorphologicalFeatures {
  readonly case?: 'nominative' | 'accusative';
  readonly number?: 'singular' | 'plural';
  readonly tense?: 'past' | 'present' | 'future';
  readonly mood?: 'indicative' | 'conditional' | 'imperative' | 'infinitive' | 'participle';
  readonly voice?: 'active' | 'passive';
  readonly degree?: 'positive' | 'comparative' | 'superlative';
  readonly type?: string;
}
```

## Morphological Analysis Details

### Confidence System

The analyzer uses a sophisticated confidence calculation system:

- **Base confidence**: Calculated from morphological feature matches
- **High-confidence rules**: Special cases for unambiguous forms
- **Precedence system**: Resolves conflicts between multiple possible analyses

### Feature Detection

Each analyzer specializes in detecting specific morphological features:

- **Case marking**: Automatic detection of accusative (-n) and nominative forms
- **Number marking**: Plural detection with confidence adjustment
- **Verbal features**: Comprehensive tense, mood, and voice analysis
- **Adjectival agreement**: Case and number agreement with nouns

## Development

### Building

```bash
npm run build
```

This creates three output formats:
- `dist/types/` - TypeScript type definitions
- `dist/esm/` - ES modules for modern bundlers
- `dist/cjs/` - CommonJS for Node.js compatibility

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Code Quality

```bash
npm run lint          # Check code style
npm run lint:fix      # Fix auto-fixable issues
npm run format        # Format code with Prettier
npm run typecheck     # Verify TypeScript types
```

## Migration from Python Version

This TypeScript version maintains API compatibility with enhanced features:

### Key Improvements

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modern Package**: Dual ESM/CJS support with proper tree-shaking
- **Enhanced Testing**: 29 comprehensive tests with edge case coverage
- **Better Performance**: Optimized algorithms with confidence-based selection
- **Rich Morphology**: Expanded morphological feature detection

### Breaking Changes

- Package name changed to `@vaporjawn/esperanto-analyzer`
- Constructor patterns updated for TypeScript classes
- Return types now include comprehensive type information

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with tests
4. Run the test suite: `npm test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

Based on the original Python Esperanto analyzer with significant enhancements for modern TypeScript development. Special thanks to the Esperanto community for linguistic guidance and validation.

---

**Saluton al ĉiuj Esperantistoj!** 🌍✨
