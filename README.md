# Pius Shedrach Portfolio

A business-focused web design and development portfolio built with Vite, React Router,
React, and styled-components.

## Requirements

- Node.js `22.22.0` or newer
- Corepack-enabled Yarn Classic

```sh
corepack enable
yarn install
```

## Local Development

```sh
yarn start
```

The local site runs at `http://localhost:5173`.

## Production Build

Production builds require the canonical site URL:

```sh
SITE_URL=https://your-domain.example yarn build
```

The static deployment output is written to `build/client`. Set `SITE_URL` in Vercel before
deploying.

## Content

- Homepage marketing sections live in `src/components/sections`.
- Project case studies live in `content/projects`.
- Insights posts live in `content/posts`.
- Relative project cover paths resolve from the Markdown file and are emitted under `/content`.

Post frontmatter supports `title`, `description`, `date`, `slug`, `tags`, and `draft`. Project
frontmatter supports `title`, `date`, `featured`, `featuredOrder`, `category`, `services`,
`external`, `github`, and `cover`.

## Attribution

This portfolio is adapted from Brittany Chiang's open-source v4 portfolio and retains attribution
in the site footer in accordance with the spirit of the original project.
