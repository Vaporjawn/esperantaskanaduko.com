
⸻

MVP Checklist — Esperanto Hangman (Vite/TS/React/MUI)

0) Project bootstrap
	•	npm create vite@latest esperanto-hangman -- --template react-ts
	•	cd esperanto-hangman && npm i @mui/material @mui/icons-material @emotion/react @emotion/styled
	•	npm i zustand (lightweight state), npm i zod (input guards), npm i clsx (class merging)
	•	Dev hygiene: npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-react-hooks
	•	Add .nvmrc, .editorconfig, .prettierrc, .eslintrc.cjs; enable strict TS in tsconfig.json ("strict": true)

1) Esperanto specifics (non-negotiable)
	•	Alphabet: a b c ĉ d e f g ĝ h ĥ i j ĵ k l m n o p r s ŝ t u ŭ v z
(Note: no q, w, x, y; includes ĉ ĝ ĥ ĵ ŝ ŭ)
	•	Normalize strings to NFC at load time to keep diacritics stable.
	•	Input must allow clicking on a virtual keyboard and typing using standard keyboard plus x-notation fallback: cx gx hx jx sx ux → ĉ ĝ ĥ ĵ ŝ ŭ
	•	Render font that supports diacritics (e.g., system default is fine; if not, add Noto Sans)

2) Minimal data
	•	Add src/data/words-eo.json with ~150–300 common words (no spaces/hyphens for MVP). Example categories: animals, colors, verbs, everyday nouns.
	•	Shape: string[] (all lowercase, NFC)
	•	Optional: src/data/hints-eo.json keyed by word for tooltip/help later (not required to win)

3) App structure

src/
  data/words-eo.json
  store/game.ts
  utils/eo.ts
  components/
    AppShell.tsx
    HangmanFigure.tsx
    WordSlots.tsx
    KeyboardEO.tsx
    StatusBar.tsx
    Controls.tsx
  pages/
    GamePage.tsx
  types.ts
  main.tsx
  App.tsx

4) Types (lock this first)
	•	type Letter = 'a'|'b'|...|'ŭ' (or just string but validate)
	•	type GamePhase = 'playing' | 'won' | 'lost'
	•	interface GameState { secret: string; guessed: Set<string>; wrong: Set<string>; maxMistakes: number; phase: GamePhase; }

5) State (Zustand)
	•	Store with actions:
	•	newGame(): void (random word, reset sets, phase)
	•	guess(letter: string): void (ignore if already guessed; update sets; advance phase when needed)
	•	reveal(): void (dev aid toggle; optional)
	•	Derived selectors:
	•	maskedWord: string[] (letters or _)
	•	mistakeCount: number
	•	isComplete: boolean (all letters guessed)

6) Core game rules
	•	Start: maxMistakes = 6 (MVP)
	•	On guess:
	•	If letter ∈ secret → add to guessed; check win
	•	Else → add to wrong; if wrong.size >= maxMistakes → phase='lost'
	•	Win: every unique letter in secret is in guessed
	•	Lock input when phase !== 'playing'

7) UI (Material UI)
	•	AppShell: MUI Container + responsive layout, theme with primary/secondary
	•	HangmanFigure: 7 SVG states (0..6). Keep it minimal lines.
	•	WordSlots: render underscores with revealed letters; aria-labels per slot
	•	KeyboardEO: MUI Buttons for each Esperanto letter, grouped in 3 rows; disabled when used; include ĉ ĝ ĥ ĵ ŝ ŭ
	•	Controls: New Game button; “Give me a hint” (optional later); Mistake counter (e.g., Chips)
	•	StatusBar: phase banner: “Vi venkis!” / “Vi malvenkis.” / “Divenado…”

8) Input & accessibility
	•	Global keydown handler:
	•	Map a..z to letters
	•	Map x-notation: c then x → ĉ (and same for g, h, j, s, u)
	•	Ignore invalid letters (q, w, x, y unless part of x-notation sequence)
	•	Buttons have aria-pressed for guessed; aria-label="litero ĉ" etc.
	•	High contrast focus rings; Tab order flows across keyboard; Escape to blur
	•	Screen reader win/lose announcements via aria-live="polite"

9) Utils (Esperanto helpers)
	•	toNFC(str: string): string
	•	isEoLetter(ch: string): boolean
	•	toDiacriticFromXNotation(bufferedKeys): string | null
	•	uniqueLetters(word): Set<string> (handle repeated diacritics)

10) Minimal theming
	•	Create MUI theme in App.tsx
	•	Use Button size=“small”, variant="contained" for unguessed, outlined for guessed, disabled for locked
	•	Palette example: primary = deep green, error = brick red (defaults okay for MVP)

11) Persistence (tiny, optional but nice)
	•	localStorage keys:
	•	ehm-stats: { games: number, wins: number, streak: number }
	•	ehm-settings: { maxMistakes, allowHints }
	•	Load on boot; update on win/lose

12) Testing (lean)
	•	Unit test utils/eo.ts (x-notation → diacritic; NFC normalization)
	•	Store tests: win on last correct guess; lose on last wrong guess; repeated guess is no-op
	•	Cypress (optional): start → make 6 wrong guesses → lose banner; new game resets

13) Empty states & errors
	•	If word list fails: fallback to embedded list of ~10 words
	•	If font missing diacritics: show toast + suggest switching font (only if you detect tofu)

14) i18n labels (MVP level)
	•	Static strings in Esperanto:
	•	Title: “Pendumulo — Esperanto”
	•	New Game: “Nova ludo”
	•	Mistakes: “Eraroj: {n}/{max}”
	•	Win: “Vi venkis!”
	•	Lose: “Vi malvenkis. Vorto: {secret}”
	•	Keep English in comments only; UI fully in Esperanto for vibe

15) Performance & polish
	•	SVG figure memoized; only re-renders on mistakeCount
	•	Keyboard buttons memoized per letter key
	•	Avoid re-creating sets on every render (derive once)

16) Deploy
	•	npm run build → dist/
	•	Static deploy to Netlify/Vercel/GH Pages (no server needed)
	•	Set base in vite.config.ts if GH Pages

⸻

Acceptance Criteria (MVP = ship)
	•	App loads and shows masked word with underscores.
	•	Clicking or typing guesses letters; diacritics are guessable.
	•	X-notation works: typing s then x guesses ŝ; same for c,g,h,j,u.
	•	Mistake counter increments; hangman drawing advances.
	•	Win condition reveals full word + win banner; lose shows secret word.
	•	No crashes if word contains diacritics only.
	•	Keyboard disables used letters and shows correct/incorrect state.
	•	“Nova ludo” resets everything and picks a new random word.
	•	Basic stats persist across refresh (if enabled).

⸻

Nice-to-have (post-MVP, if you’ve got juice)
	•	Hints: one synonym or short definition (tooltips or dialog)
	•	Categories filter: animals, foods, verbs
	•	PWA: offline play, install banner
	•	Daily word mode: one shared word per day + shareable result row (Wordle-style)
	•	Dark mode toggle
	•	Accent input helper: mini bar showing ĉ ĝ ĥ ĵ ŝ ŭ above keyboard for quick tap

⸻

Code stubs you can paste in

src/utils/eo.ts

export const EO_LETTERS = [
  'a','b','c','ĉ','d','e','f','g','ĝ','h','ĥ','i','j','ĵ','k','l','m','n','o','p','r','s','ŝ','t','u','ŭ','v','z'
] as const;

export const toNFC = (s: string) => s.normalize('NFC');

export const isEoLetter = (ch: string) => EO_LETTERS.includes(toNFC(ch) as any);

// map base->diacritic when followed by x
const X_MAP: Record<string,string> = { c:'ĉ', g:'ĝ', h:'ĥ', j:'ĵ', s:'ŝ', u:'ŭ' };

export function fromXNotation(prev: string, next: string): string | null {
  // returns diacritic if prev+next equals x-notation, else null
  const p = prev.toLowerCase(); const n = next.toLowerCase();
  if (n !== 'x') return null;
  return X_MAP[p] ?? null;
}

export const uniqueLetters = (word: string) => new Set([...toNFC(word)]);

src/store/game.ts

import { create } from 'zustand';
import words from '../data/words-eo.json';
import { toNFC, uniqueLetters } from '../utils/eo';

type Phase = 'playing'|'won'|'lost';

interface GameState {
  secret: string;
  guessed: Set<string>;
  wrong: Set<string>;
  maxMistakes: number;
  phase: Phase;
  newGame: () => void;
  guess: (letter: string) => void;
}

const pick = () => toNFC(words[Math.floor(Math.random()*words.length)]);

export const useGame = create<GameState>((set, get) => ({
  secret: pick(),
  guessed: new Set(),
  wrong: new Set(),
  maxMistakes: 6,
  phase: 'playing',
  newGame: () => set({ secret: pick(), guessed: new Set(), wrong: new Set(), phase: 'playing' }),
  guess: (raw) => {
    const letter = toNFC(raw.toLowerCase());
    const { secret, guessed, wrong, maxMistakes, phase } = get();
    if (phase !== 'playing') return;
    if (guessed.has(letter) || wrong.has(letter)) return;

    const nextGuessed = new Set(guessed);
    const nextWrong = new Set(wrong);

    if (secret.includes(letter)) nextGuessed.add(letter);
    else nextWrong.add(letter);

    let nextPhase: Phase = 'playing';
    if ([...uniqueLetters(secret)].every(l => nextGuessed.has(l))) nextPhase = 'won';
    if (nextWrong.size >= maxMistakes) nextPhase = 'lost';

    set({ guessed: nextGuessed, wrong: nextWrong, phase: nextPhase });
  }
}));

src/components/KeyboardEO.tsx

import { Button, Stack } from '@mui/material';
import { EO_LETTERS } from '../utils/eo';
import { useGame } from '../store/game';

export default function KeyboardEO() {
  const { guess } = useGame();
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
        {EO_LETTERS.map(l => (
          <Button key={l} onClick={() => guess(l)} size="small" variant="contained" aria-label={`litero ${l}`}>
            {l}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}

Keydown handler (in App.tsx)

useEffect(() => {
  let prev: string | null = null;
  const onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k.length === 1 && /[a-zĉĝĥĵŝŭ]/i.test(k)) {
      // direct diacritic or base letter
      guess(k);
      prev = k;
      return;
    }
    // x-notation: previous base + 'x'
    if (prev && k === 'x') {
      const diac = fromXNotation(prev, 'x');
      if (diac) guess(diac);
      prev = null;
    } else {
      prev = k;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
}, []);


⸻