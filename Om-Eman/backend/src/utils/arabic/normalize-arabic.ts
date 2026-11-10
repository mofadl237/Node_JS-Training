export interface IArabicNormalizationCase {
  readonly input: string;
  readonly expected: string;
  readonly note: string;
}

export interface IArabicTokenizationCase {
  readonly input: string;
  readonly expected: readonly string[];
  readonly note: string;
}

const ARABIC_LETTERS = "أإآٱىةؤئپچژگکیۀە";
const NORMALIZED_LETTERS = "اااايهويبجزككيهه";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹";
const LATIN_DIGITS = "01234567890123456789";

function translateCharacters(
  input: string,
  from: string,
  to: string,
): string {
  const replacements = new Map<string, string>();

  for (let index = 0; index < from.length; index += 1) {
    const character = from[index];
    const replacement = to[index];

    if (character !== undefined && replacement !== undefined) {
      replacements.set(character, replacement);
    }
  }

  return Array.from(input, (character) => {
    return replacements.get(character) ?? character;
  }).join("");
}

export function normalizeArabic(input: string): string {
  const lowerCased = input.toLowerCase();
  const withoutCombiningMarks = lowerCased
    .normalize("NFD")
    .replace(/[\p{M}\u0640]+/gu, "");
  const withNormalizedLetters = translateCharacters(
    withoutCombiningMarks,
    ARABIC_LETTERS,
    NORMALIZED_LETTERS,
  );
  const withNormalizedDigits = translateCharacters(
    withNormalizedLetters,
    ARABIC_DIGITS,
    LATIN_DIGITS,
  );

  return withNormalizedDigits
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const normalized = normalizeArabic(input);
  return normalized.length === 0 ? [] : normalized.split(" ");
}

export const ARABIC_NORMALIZATION_CASES: readonly IArabicNormalizationCase[] = [
  {
    input: "أحمد",
    expected: "احمد",
    note: "Alef with hamza above becomes bare alef",
  },
  {
    input: "إبراهيم",
    expected: "ابراهيم",
    note: "Alef with hamza below becomes bare alef",
  },
  {
    input: "آمنة",
    expected: "امنه",
    note: "Alef with maddah and ta marbuta are normalized",
  },
  {
    input: "مُحَمَّد",
    expected: "محمد",
    note: "Arabic diacritics are removed",
  },
  {
    input: "زَيْتُون",
    expected: "زيتون",
    note: "Search words ignore tashkeel",
  },
  {
    input: "فاطمة",
    expected: "فاطمه",
    note: "Ta marbuta becomes ha",
  },
  {
    input: "مصطفى",
    expected: "مصطفي",
    note: "Alef maqsura becomes ya",
  },
  {
    input: "مؤمن",
    expected: "مومن",
    note: "Waw with hamza becomes waw",
  },
  {
    input: "سُئِل",
    expected: "سيل",
    note: "Ya with hamza and diacritics are normalized",
  },
  {
    input: "١٢٣٤٥",
    expected: "12345",
    note: "Arabic-Indic digits become ASCII digits",
  },
  {
    input: "۱۲۳",
    expected: "123",
    note: "Extended Arabic-Indic digits become ASCII digits",
  },
  {
    input: "زيتـــون",
    expected: "زيتون",
    note: "Tatweel is removed",
  },
  {
    input: "  أعشاب   طبيعية  ",
    expected: "اعشاب طبيعيه",
    note: "Whitespace and punctuation are collapsed",
  },
  {
    input: "Café",
    expected: "cafe",
    note: "Latin accents are removed",
  },
  {
    input: "O'Reilly",
    expected: "o reilly",
    note: "Apostrophes become spaces",
  },
  {
    input: "الزعتر",
    expected: "الزعتر",
    note: "The definite article is not stripped",
  },
  {
    input: "الزعتر البلدي",
    expected: "الزعتر البلدي",
    note: "Articles are preserved in multi-word queries",
  },
  {
    input: "پسته",
    expected: "بسته",
    note: "Persian peh is folded to Arabic beh",
  },
  {
    input: "کتاب",
    expected: "كتاب",
    note: "Persian keheh is folded to Arabic kaf",
  },
  {
    input: "مرحبًا",
    expected: "مرحبا",
    note: "Tanween is removed",
  },
  {
    input: "١٠٫٥",
    expected: "10 5",
    note: "Arabic decimal punctuation becomes a separator",
  },
  {
    input: "الْعَرَبِيَّة",
    expected: "العربيه",
    note: "Diacritics and ta marbuta are normalized together",
  },
];

export const ARABIC_TOKENIZATION_CASES: readonly IArabicTokenizationCase[] = [
  {
    input: "  أعشاب   طبيعية  ",
    expected: ["اعشاب", "طبيعيه"],
    note: "Tokenization uses the normalized search form",
  },
  {
    input: "زيت زيتون",
    expected: ["زيت", "زيتون"],
    note: "Words are split on normalized whitespace",
  },
  {
    input: "   ",
    expected: [],
    note: "Blank input produces no tokens",
  },
];
