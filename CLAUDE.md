# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for the RAVEN (Real-time Adaptive Virtual-Twin Environment for Next-Generation Robotics in Virtual Production) research project. Hosted on GitHub Pages at `RAVEN-VP.github.io`.

## Tech Stack

Vanilla HTML5, CSS3, and JavaScript (ES6+). No frameworks, no npm, no build tools. Google Fonts (Syne for headlines, Plus Jakarta Sans for body) loaded via CDN.

## Deployment

- GitHub Pages with Jekyll, triggered on push to `main` via `.github/workflows/jekyll-gh-pages.yml`
- No `_config.yml` — uses Jekyll defaults
- No local build step required; open `index.html` directly in a browser to preview

## Architecture

Single-page site (`index.html`) with three supporting files:

- **`style.css`** — All styling. Apple-style cinematic dark theme with CSS custom properties (`--bg-dark`, `--accent`, etc.). Full-viewport hero, scroll-reveal animations, sticky blur navbar, responsive via CSS Grid and `clamp()`.
- **`script.js`** — Fetches `team.json` on DOMContentLoaded and dynamically renders team member cards into `#team-members`. Also handles: Intersection Observer for scroll-reveal animations, navbar scroll behavior, mobile nav toggle, animated metric counters.
- **`team.json`** — Array of `{ name, role, bio }` objects. This is the only data file; edit it to add/remove team members.

## Key Patterns

- CSS custom properties on `:root` for theming (colors, fonts, spacing)
- Container pattern: `.container` constrains content to `max-width: 1100px`
- Gradient text effect on brand accent: `background-clip: text` with `color: transparent`
- Scroll-reveal: `.reveal` class with Intersection Observer adding `.visible`
- Partner logos displayed in a flex row in the Partners section
- Image assets (logos, diagrams) stored at repository root as PNG/SVG files
- Sections alternate between `--bg-dark` and `--bg-section` backgrounds
