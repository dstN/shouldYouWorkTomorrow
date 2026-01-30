# Should You Work Tomorrow? 🤔

> Spoiler alert: The answer is always **no**.

A completely unnecessary website that tells you what you already know — you shouldn't work tomorrow. Powered by the [No-as-a-Service API](https://github.com/hotheadhacker/no-as-a-service), because apparently that's a thing.

## What is this?

You ask if you should work tomorrow. The universe (a.k.a. a NaaS API) gives you a creative excuse why the answer is no. You send it to your employer. Profit.

## Features

- 🚫 **Always says no** — Finally, an honest service
- 🎰 **Random excuses** — Different creative reason every time
- 🔄 **Get another** — Not happy with your excuse? Refresh for a new one
- 📋 **Copy to clipboard** — Send it to your boss with one click
- 🌙 **Dark mode** — For when you're avoiding work at night
- ✨ **Fancy glass effect** — Because if you're procrastinating, do it in style
- 🫧 **Lava lamp vibes** — Floating shapes to hypnotize you further from productivity
- ⚡ **Zero layout shift** — Preloaded fonts and fixed dimensions
- 🚀 **Single file deploy** — Build script inlines CSS/JS for maximum performance

## Tech Stack

HTML, CSS, JavaScript. No frameworks. Uses `html-minifier` for production builds to squash everything into a single HTML file because Lighthouse told us to.

## Run Locally

```bash
# Development (with separate files)
npx serve .

# Production Build (minified single file)
node build.js
npx serve dist
```

Or just open `index.html` in your browser like it's 2005.

## Deploy

Push to GitHub, import in [Vercel](https://vercel.com/new), done.

The project is configured to automatically run `node build.js` and serve the optimized `dist/` folder.

## Why does this exist?

Because someone made a No-as-a-Service API and I needed an excuse to procrastinate.

## Credits

- API: [No-as-a-Service](https://github.com/hotheadhacker/no-as-a-service) — doing the lord's work
- Fonts: [Silkscreen](https://fonts.google.com/specimen/Silkscreen) + [Inter](https://fonts.google.com/specimen/Inter) (self-hosted for GDPR reasons, we're professionals here)

---

Made with ❤️ by [dstN](https://github.com/dstN) — while definitely not working
