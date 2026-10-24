/**
 * Language code to human-readable name mapping
 * Following ISO 639-1 language codes used by Google Translate API
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  // Major languages
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  sv: 'Swedish',
  pl: 'Polish',
  tr: 'Turkish',
  da: 'Danish',
  fi: 'Finnish',
  no: 'Norwegian',
  cs: 'Czech',
  el: 'Greek',
  he: 'Hebrew',
  th: 'Thai',
  vi: 'Vietnamese',
  id: 'Indonesian',
  ms: 'Malay',
  uk: 'Ukrainian',
  ro: 'Romanian',
  hu: 'Hungarian',
  bg: 'Bulgarian',
  sk: 'Slovak',
  hr: 'Croatian',
  sr: 'Serbian',
  sl: 'Slovenian',
  lt: 'Lithuanian',
  lv: 'Latvian',
  et: 'Estonian',

  // Esperanto (our target language)
  eo: 'Esperanto',

  // Additional languages
  af: 'Afrikaans',
  sq: 'Albanian',
  am: 'Amharic',
  hy: 'Armenian',
  az: 'Azerbaijani',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  bs: 'Bosnian',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ny: 'Chichewa',
  co: 'Corsican',
  cy: 'Welsh',
  fa: 'Persian',
  fy: 'Frisian',
  gd: 'Scots Gaelic',
  gl: 'Galician',
  ka: 'Georgian',
  gu: 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  hmn: 'Hmong',
  is: 'Icelandic',
  ig: 'Igbo',
  ga: 'Irish',
  jw: 'Javanese',
  kn: 'Kannada',
  kk: 'Kazakh',
  km: 'Khmer',
  ku: 'Kurdish',
  ky: 'Kyrgyz',
  lo: 'Lao',
  la: 'Latin',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mg: 'Malagasy',
  ml: 'Malayalam',
  mt: 'Maltese',
  mi: 'Maori',
  mr: 'Marathi',
  mn: 'Mongolian',
  my: 'Myanmar (Burmese)',
  ne: 'Nepali',
  ps: 'Pashto',
  pa: 'Punjabi',
  sm: 'Samoan',
  sn: 'Shona',
  sd: 'Sindhi',
  si: 'Sinhala',
  so: 'Somali',
  st: 'Sesotho',
  su: 'Sundanese',
  sw: 'Swahili',
  tg: 'Tajik',
  ta: 'Tamil',
  te: 'Telugu',
  tt: 'Tatar',
  tk: 'Turkmen',
  ur: 'Urdu',
  ug: 'Uyghur',
  uz: 'Uzbek',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zu: 'Zulu',
};

/**
 * Get human-readable language name from language code
 */
export function getLanguageName(code: string | null | undefined): string {
  if (!code) {
    return 'Unknown';
  }

  const normalizedCode = code.toLowerCase();
  return LANGUAGE_NAMES[normalizedCode] || code.toUpperCase();
}

/**
 * Check if a language code is valid/supported
 */
export function isValidLanguageCode(code: string): boolean {
  return code.toLowerCase() in LANGUAGE_NAMES;
}
