---
title: "How I built this blog with Hugo and Hextra"
date: 2025-01-20
draft: false
slug: "how-i-built-this-blog"
description: "Quick guide on how I set up Hugo with the Hextra theme and deployed to Cloudflare Pages."
summary: "Quick guide on how I set up Hugo with the Hextra theme and deployed to Cloudflare Pages."
category: carrera
tags: [tutorial, herramientas, rendimiento]
lang: "en"
---

## The stack

This blog is built with:

- **Hugo** as a static site generator
- **Hextra** as the theme
- **Cloudflare Pages** for deployment

### Why Hugo?

Speed. Hugo compiles hundreds of pages in milliseconds. It doesn't need Node.js, it has no heavy dependencies. It's a binary that just works.

### Why Hextra?

It's clean, modern and has native bilingual support. It also includes dark mode, Flexsearch integration, automatic table of contents, image zoom and a very organized configuration system. All out-of-the-box.

### Deployment

Cloudflare Pages detects Hugo automatically. You just need to:

1. Connect your GitHub repository
2. Set the build command: `hugo --minify`
3. Wait 30 seconds

That simple.