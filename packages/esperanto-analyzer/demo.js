#!/usr/bin/env node

/**
 * Example usage of the @esperanto/analyzer package
 * This demonstrates all the key features of the modernized TypeScript analyzer
 */

// Import from CommonJS build
const {
  analyzeWord,
  analyzeSentence,
  isEsperantoSentence,
  analyzeWordAll,
  getPartOfSpeechSummary,
} = require('./dist/cjs/index.js');

console.log('🌍 Esperanto Analyzer Demo\n');

// Test 1: Word Analysis
console.log('📝 Word Analysis Examples:');
const words = ['libro', 'librojn', 'legas', 'bela', 'rapide', 'kaj'];

words.forEach((word) => {
  const result = analyzeWord(word);
  console.log(
    `  ${word}: ${result.partOfSpeech} (confidence: ${result.confidence.toFixed(2)})`
  );
  if (result.morphology && Object.keys(result.morphology).length > 0) {
    console.log(`    Features: ${JSON.stringify(result.morphology)}`);
  }
});

// Test 2: Sentence Analysis
console.log('\n📊 Sentence Analysis:');
const sentence = 'Mi legas la belan libron rapide';
const sentenceResult = analyzeSentence(sentence);

console.log(`  Sentence: "${sentence}"`);
console.log(`  Total words: ${sentenceResult.statistics.totalWords}`);
console.log(`  Analyzed words: ${sentenceResult.statistics.analyzedWords}`);
console.log(`  Unknown words: ${sentenceResult.statistics.unknownWords}`);
console.log('  Part of speech counts:');
Object.entries(sentenceResult.statistics.partOfSpeechCounts).forEach(
  ([pos, count]) => {
    console.log(`    ${pos}: ${count}`);
  }
);

// Test 3: Validation
console.log('\n✅ Validation Examples:');
const testSentences = [
  'Saluton mondo',
  'Hello world',
  'La suno brilas',
  'This is not Esperanto',
];

testSentences.forEach((text) => {
  const isValid = isEsperantoSentence(text);
  console.log(`  "${text}": ${isValid ? '✓ Valid' : '✗ Invalid'} Esperanto`);
});

// Test 4: Multiple Analyses
console.log('\n🔍 Multiple Analysis for Ambiguous Words:');
const ambiguousWords = ['bona', 'alta'];

ambiguousWords.forEach((word) => {
  const analyses = analyzeWordAll(word);
  console.log(`  ${word}: ${analyses.length} possible analyses`);
  analyses.forEach((analysis, index) => {
    console.log(
      `    ${index + 1}. ${analysis.partOfSpeech} (${analysis.confidence.toFixed(2)})`
    );
  });
});

// Test 5: Part of Speech Summary
console.log('\n📈 Part of Speech Summary:');
const longText =
  'La rapida bruna vulpo saltas super la malrapida hundo kaj kuras tra la verda kampo';
const summary = getPartOfSpeechSummary(longText);

console.log(`  Text: "${longText}"`);
console.log('  Summary:');
Object.entries(summary).forEach(([pos, count]) => {
  console.log(`    ${pos}: ${count}`);
});

console.log('\n🎉 Demo completed successfully!');
console.log('\nThe @esperanto/analyzer package is ready for npm publishing!');
