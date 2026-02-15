# crosswrd.site

A personalized crossword puzzle you make for someone you love.

Write clues only they would know. We turn them into a crossword. Send the link. Watch them solve it.

**[crosswrd.site](https://crosswrd.site)**

## How it works

1. **Write clues** — Write clues and answers about your friendship, relationship, or memories together
2. **We build it** — We auto-generate a crossword puzzle from your answers
3. **Send the link** — Share the link. They solve it on their phone or computer

No accounts. No sign-ups. Just a crossword and a link.

## Features

- Multi-step create flow — name, clues, personal message, preview, share
- Crossword auto-generation from your answers (client-side, deterministic)
- Interactive solve page with keyboard navigation
- Mobile-friendly — grid works great on phones
- Completion screen with solve time, stats, and personal message reveal
- Shareable links (e.g. `crosswrd.site/p/akdjs`)

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres)
- [Vercel](https://vercel.com) (Hosting)

## Running locally

```bash
git clone https://github.com/vivekmalapaka-devops/crosswrd.git
cd crosswrd
npm install
cp .env.example .env.local  # fill in your Supabase credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Acknowledgements

- [Excalidraw](https://excalidraw.com) — The hand-drawn [Virgil](https://virgil.excalidraw.com/) font used throughout the app is from Excalidraw. It gives crosswrd its distinctive, personal feel.
- [Wordamour](https://github.com/anandbaburajan/wordamour) — The original inspiration. Same spirit (personal, shareable, gift-like) but crosswrd is a crossword instead of a word search.

## Contributing

Found a bug or have an idea? [Open an issue](https://github.com/vivekmalapaka-devops/crosswrd/issues) or [request a feature](https://github.com/vivekmalapaka-devops/crosswrd/issues/new?labels=feature).

## License

MIT
