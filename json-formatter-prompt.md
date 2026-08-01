Build a production-ready JSON Formatter & Validator web application using:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Modern responsive UI
- Client-side JSON processing for all public-facing tools (JSON never touches the server)
- A backend + database ONLY for the admin panel (content, ad config, contact messages, analytics) — see "Admin Panel & Backend" section below
- No external API for the tools themselves

## Main Goal

Create a fast, clean, professional JSON utility website that can eventually be monetized with Google AdSense.

Optimize for:
- SEO
- Core Web Vitals
- Mobile responsiveness
- Accessibility
- Fast loading
- Clean UX
- Future expansion into multiple developer tools

## Main Tool: JSON Formatter / Validator

### Layout

Desktop: Header → Main content → Two-panel editor layout
- Left panel: JSON input editor
- Right panel: Formatted output, with a toggle between:
  - "Text view" (formatted/beautified raw text)
  - "Tree view" (collapsible/expandable nodes)

Mobile: Stack panels vertically, with the view toggle accessible at the top.

### Features

1. JSON Formatter / Beautifier
2. JSON Validator
3. JSON Minifier
4. Copy formatted JSON
5. Download JSON as ".json"
6. Clear input
7. Upload ".json" file
8. Drag & drop ".json" file
9. Indentation selector: 2 spaces / 4 spaces / Tab
10. Error message when JSON is invalid, with useful info (unexpected token, approx. line number, position)
11. Clicking the error message jumps the editor cursor to that line and highlights it
12. Character count
13. Line count
14. Dark mode / Light mode (persist choice in localStorage)
15. Expand all / Collapse all (tree view)
16. Search within JSON (highlight matching keys/values, jump between matches)
17. Auto-format option (debounced ~400ms while typing, so it doesn't lag on large input)
18. Preserve valid JSON data without modification to values
19. Auto-save last input to localStorage (restore on page reload) — mention clearly this is local only, not uploaded

### JSON Editor

- Use CodeMirror 6 (lightweight, actively maintained) — avoid Monaco, it's too heavy for this use case
- Monospace font, syntax highlighting, line numbers
- Proper scrolling, large editing area
- Parse large JSON (1MB+) inside a Web Worker so the UI thread never freezes
- If tree view renders very large arrays/objects, virtualize rendering (e.g. react-window) instead of rendering every node at once
- Responsive on mobile
- Keyboard shortcuts: Ctrl+Enter = Format, Ctrl+K = Clear

### JSON Processing

All processing happens in the browser only. Use native `JSON.parse()` / `JSON.stringify()`. Never send user JSON to a server or external API.

Show this privacy message near the tool:
"Your JSON is processed locally in your browser and is never uploaded to our server."

## UI/UX

Header:
- Logo/name: "JSON Formatter"
- Nav: JSON Formatter | JSON Validator | JSON Minifier | JSON Viewer (some can point to placeholder pages for now)

Main heading: "JSON Formatter & Validator"
Subtitle: "Format, validate, minify and beautify JSON instantly in your browser."

Buttons (with clear icons): Format, Minify, Validate, Copy, Download, Clear

Keep the interface usable, not over-designed.

### Example JSON

Show a small example on first load:
```json
{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "skills": ["JavaScript", "React", "Next.js"]
}
```
User can clear it easily.

### Error Handling

Show a clear error panel for invalid JSON — message, unexpected token, approx line/position when possible. Never expose raw stack traces to the user.

## SEO

Page title: "JSON Formatter & Validator - Free Online JSON Tool"
Meta description: "Free online JSON Formatter and Validator. Beautify, format, validate and minify JSON instantly. Fast, secure and processed locally in your browser."

Implement:
- Proper H1/H2 structure, semantic HTML
- Open Graph + Twitter metadata, canonical URL, robots metadata
- **JSON-LD structured data**: SoftwareApplication schema for the tool + FAQPage schema for the FAQ section (important for AdSense/Google visibility)
- sitemap.xml and robots.txt via Next.js conventions

### SEO Content (below the tool)

- What is a JSON Formatter?
- How to Format JSON? (3-5 simple steps)
- JSON Formatter Features (formatting, validation, minification, viewer, copy/download, browser-based processing)
- Is this JSON Formatter free?
- Is my JSON data safe?
- FAQ: What is JSON? / What is a JSON formatter? / How do I validate JSON? / How do I beautify JSON? / How do I minify JSON? / Is this free? / Is my data uploaded? / Can I format large JSON files?

Keep content genuinely useful, not keyword-stuffed.

## AdSense Preparation

Do NOT place real ads yet. Create a reusable `<AdPlaceholder />` component for:
1. Below header
2. Between tool and SEO content
3. Sidebar on desktop (if it fits)
4. Before FAQ

Also add a **cookie consent banner placeholder** component (`<ConsentBanner />`) — required for AdSense approval in most regions (GDPR/India). Keep it simple (accept/reject), no actual ad SDK wired in yet.

Keep ad placeholder count minimal — the tool stays the main focus.

## Internal Linking

"Related Developer Tools" section linking to (use "#" for tools not yet built):
JSON Formatter, JSON Validator, JSON Minifier, JSON Viewer, XML Formatter, CSV to JSON, Base64 Encoder, URL Encoder, JWT Decoder, Timestamp Converter

Use reusable components so these can become real pages later.

## Accessibility

- Proper labels, keyboard navigation, visible focus states, ARIA labels where needed
- Good color contrast
- Meaningful button labels
- Don't rely only on color for error states

## Performance

- Avoid unnecessary JS, lazy-load non-critical components
- Avoid large dependencies, keep initial bundle small
- Use server components wherever possible; only the interactive JSON tool is client-side
- Don't load analytics until necessary
- Parsing/formatting of large JSON must not block the main thread (Web Worker)

## Responsive Design

Test at: 320px, 375px, 768px, 1024px, 1440px

## Components

Header, Footer, JsonEditor, JsonOutput (with text/tree toggle), ToolBar, ErrorMessage, AdPlaceholder, ConsentBanner, FAQ, RelatedTools, SEOContent, ThemeToggle

Don't put the whole app in one giant component.

## Future Architecture

Structure for easy addition of:
/json-formatter /json-validator /json-minifier /json-viewer /xml-formatter /csv-to-json /base64-encoder /url-encoder /jwt-decoder /timestamp-converter

Use reusable components and utilities.

## Pages

Privacy Policy, Terms & Conditions, Contact, About — clean placeholder content, customizable later.

## Footer

"JSON Formatter — Free online developer tools."
Links: JSON Formatter, JSON Validator, JSON Minifier, JSON Viewer, Privacy Policy, Terms, Contact, About
Copyright with current year.

## Code Quality

- TypeScript strict mode, clean component architecture, meaningful names
- No unnecessary comments, no duplicated logic, reusable utilities
- Proper error handling (including an ErrorBoundary around the JSON tool)
- No console errors, no TypeScript errors
- Avoid `any` unless absolutely necessary

## Design System (UI/UX)

Use a clean, timeless SaaS/developer-tool aesthetic — not flashy or trend-chasing. Trust and clarity matter more than decoration for a dev tool.

### Colors

Use Tailwind's zinc scale as the neutral base (cool neutrals — the current standard for technology products) with a single indigo/violet accent (premium, trustworthy tech feel, works well in both light and dark mode):

| Token | Light Mode | Dark Mode |
|---|---|---|
| Background | `#FAFAF8` (warm off-white, not pure white) | `#18181B` (zinc-900) |
| Surface / Card | `#FFFFFF` | `#27272A` (zinc-800) |
| Text primary | `#18181B` (zinc-900) | `#F4F4F5` (zinc-100) |
| Text muted | `#71717A` (zinc-500) | `#A1A1AA` (zinc-400) |
| Border | `#E4E4E7` (zinc-200) | `#3F3F46` (zinc-700) |
| Accent (brand/CTA/focus) | `#6366F1` (indigo-500) | `#818CF8` (indigo-400) |
| Success / Valid JSON | `#22C55E` (green-500) | `#4ADE80` (green-400) |
| Error / Invalid JSON | `#EF4444` (red-500) | `#F87171` (red-400) |

Define these as Tailwind theme tokens / CSS variables, not hardcoded hex values scattered in components, so the palette is easy to adjust later.

Every text/background color pair must pass WCAG AA contrast. Never use color alone to indicate error/success state — always pair with an icon and text label too.

### Typography

- UI font: Inter or Geist (clean, modern sans-serif)
- Editor/code font: JetBrains Mono or Fira Code (monospace, good number/bracket distinction)

### Layout & Feel

- Generous white space, minimal visual clutter
- Soft, subtle shadows and thin borders — avoid heavy skeuomorphic or 3D effects
- Rounded corners (moderate, e.g. 8-12px) for a modern but not overly playful feel
- Subtle micro-interactions: hover states, focus rings in the accent color, smooth transitions (150-200ms)
- Optional: one subtle mesh/ambient gradient only in the hero section background (not inside the tool UI itself, to avoid hurting contrast/readability)
- Dark mode is a fully designed second theme (token-based), not just an inverted filter

## Required Dependencies

Install and use these (don't add extra unrelated packages):
```bash
# Public tool UI
npm install @codemirror/lang-json @uiw/react-codemirror
npm install react-window          # for virtualizing large tree views

# Admin panel / backend
npm install prisma @prisma/client
npm install next-auth
npm install bcryptjs
```
Everything else (JSON parsing, state, etc.) should use native browser/React APIs — no extra utility libraries unless truly necessary.

## Security

The public JSON tools remain static/client-side, but the admin panel introduces a real backend — apply extra care there:

1. **Security headers** — set in `next.config.js`:
   - `Content-Security-Policy`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` (disable unused features like camera/mic)
2. **File upload safety** — restrict uploads to `.json`/`.txt`, enforce a reasonable max file size (e.g. 10MB) client-side, and never send uploaded content anywhere — parse in-browser only.
3. **Dependency hygiene** — use exact/locked versions in `package.json` (commit the lockfile), no unmaintained/unnecessary packages.
4. **No secrets in code** — don't hardcode any keys; if any env vars are ever needed, use `.env.local` and add it to `.gitignore`.
5. **HTTPS only** — assume deployment on a platform that provides HTTPS by default (e.g. Vercel).
6. **Admin routes** — protect every `/admin/*` route and `/api/admin/*` route with server-side session checks (not just hiding the link). Hash passwords properly (bcrypt/argon2, never plaintext). Rate-limit the login route and the public `/api/contact` route.
7. **Database credentials** — store `DATABASE_URL` and auth secrets in `.env.local`, never commit them, never expose them to client-side code.

## Favicon, Manifest & Assets

- Add a favicon set (favicon.ico + apple-touch-icon + a simple manifest.json) so the site looks complete in browser tabs/bookmarks
- Add a default Open Graph image (og-image.png) for link previews on social/WhatsApp shares

## Deployment Notes

- Target deployment platform: Vercel (zero-config for Next.js, free SSL, automatic HTTPS)
- Confirm `npm run build` completes with zero TypeScript/ESLint errors before considering the task done
- Add a `.gitignore` that excludes `node_modules`, `.next`, `.env*`

## Admin Panel & Backend

Everything below is the ONLY part of the site that touches a server/database. The JSON tools themselves stay 100% client-side (unaffected by this section).

### Tech Stack (admin/backend only)

- Database: PostgreSQL (via a hosted provider like Supabase or Neon — both have free tiers, work well with Next.js)
- ORM: Prisma
- Auth: NextAuth.js (Credentials provider) or Clerk — single admin role is enough for now, design the schema so more roles can be added later
- API: Next.js Route Handlers (`/app/api/admin/...`), protected by auth middleware
- Admin UI: separate route group `/app/admin/*`, not linked from public nav, protected by login

### Database Schema (high level)

- `AdminUser` — id, email, password hash (or external auth id), role
- `ContactMessage` — id, name, email, message, createdAt, status (new/read/replied)
- `AdSlot` — id, placement key (e.g. "below-header", "before-faq"), enabled (boolean), ad unit code, updatedAt
- `ToolConfig` — id, tool key (e.g. "xml-formatter"), status (live/coming-soon/hidden), display order
- `SeoContent` — id, page key, meta title, meta description, FAQ items (JSON field), updatedAt
- `PageView` (optional, simple analytics) — id, path, timestamp, referrer — or skip this and use a proper analytics tool (Plausible/Umami) instead of building analytics from scratch

### Admin Panel Features

1. **Login** — simple email/password (or magic link) admin login at `/admin/login`, session-protected routes
2. **Dashboard** — quick overview: new contact messages count, tool usage summary (if using Plausible/Umami, embed or link their dashboard instead of rebuilding analytics)
3. **Ad Management**
   - List of ad slots (Below Header, Between Tool & SEO Content, Sidebar, Before FAQ)
   - Toggle each ON/OFF
   - Edit the ad unit/script code per slot
   - **Important**: this only controls *whether/where* an ad container renders and *which ad unit code* it holds — actual ad selection and serving is entirely Google AdSense's job, not something this backend does
4. **Contact Messages**
   - Table of submissions from the Contact Us page (name, email, message, date)
   - Mark as read/replied
   - The Contact Us form's "Send Message" button posts to `/api/contact`, which saves to `ContactMessage` (add basic rate-limiting and a honeypot field to reduce spam)
5. **Tool Management**
   - Toggle each tool's status: Live / Coming Soon / Hidden
   - Reorder tools as they appear in nav/footer
6. **SEO Content Editor**
   - Edit meta title/description and FAQ text per page without a code deploy
7. **Admin-only, not indexed** — add `noindex` to all `/admin/*` routes and exclude from sitemap.xml

### What NOT to build custom

- Don't build a custom analytics engine — use Plausible or Umami (privacy-friendly, GDPR-safe, quick to embed) instead of storing raw pageviews yourself
- Don't try to replicate AdSense's ad-selection logic — the backend only stores which slots are active and their unit codes

## Important — Before Coding

1. Inspect the existing project structure
2. Don't unnecessarily replace working config files
3. Use the existing Next.js/Tailwind setup
4. Install dependencies only when necessary
5. After implementation, check for TypeScript, ESLint and build errors
6. Fix all errors you introduce

Finally, provide a short summary of:
- Files created/modified
- Dependencies added
- Features implemented
- Commands needed to run the project
- Any remaining TODOs
