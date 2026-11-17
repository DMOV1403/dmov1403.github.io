# CV ghaf scene + natochi-style opening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the ghaf/desert `/cv/` page and make sections open like natochi.cv (tree steps left with roots, text in the middle).

**Architecture:** One self-contained static file, `cv/index.html` (inline CSS + JS, canvas drawing, real HTML content). Rewrite it from the ghaf version, then add a `.treebox` wrapper (roots/tree/leaders canvases) that scales and translates on `html.panel-open`.

**Tech Stack:** HTML, CSS, vanilla JS, 2D canvas. Served locally with `python -m http.server 5173`.

**Spec:** `docs/superpowers/specs/2026-11-17-cv-ghaf-natochi-open-design.md`

## Global Constraints
- No video material: no collage, no player, no link to `../video/`.
- No dark frame, no grass.
- Branch labels and "back to the tree" are `<button>`s handled by a document click listener on `[data-open]` / `[data-close]`.
- Plain readable CV when `html.tree` is absent; reduced motion shows the grown tree with no runway.
- Body text ≥ 1rem, secondary text ≥ 4.5:1 on `#1F1C25`.

## Review Focus
- Tapping a label inside a sandboxed iframe with a foreign `<base href>` opens the section (phone viewer case).
- After the intro fades, taps on upper labels reach the labels, not the hidden intro.
- Shrunk crown stays fully on screen at 1024x768 and 1440x900; text starts right of it.
- Direct link `/cv/#work` shows the section without the slide; Back returns to the tree.
- Phone (430x932): section text readable over the dimmed tree, no horizontal scroll.

---

### Task 1: Restore ghaf scene with natochi-style opening

**Files:**
- Modify: `cv/index.html` (full rewrite)

**Interfaces:**
- Produces: CSS vars on `<html>` set by `build()`: `--bx`, `--by` (tree base px), `--tx`, `--ty` (translate px), `--ts` (scale, 0.72), `--pl` (panel left px). Functions `build()`, `drawSky()`, `drawRoots()`, `placeLabels()`, `drawLeaders()`, `drawTree(p)`, `openPanel(id, from)`.

- [ ] **Step 1: Write the new file** from the ghaf version (Spectral + Caveat, dunes, moon, ghaf tree, handwritten labels, taped notes, plain-CV fallback), with: button labels/back; intro visibility hidden when faded; `.treebox` holding `#roots`, `#tree`, `#leaders`; `html.panel-open .treebox{translate:var(--tx) var(--ty);scale:var(--ts)}` with `transform-origin:var(--bx) var(--by)`; `.panel.open` fixed from `left:var(--pl)`, single text column max 34rem, transparent background; phones (≤760px): panel full width on `rgba(31,28,37,.93)`, stage opacity .3, no tree transform; `html.instant` disables transitions for direct links.
- [ ] **Step 2: Verify in browser** at 1440x900, 1024x768, 430x932: zero console errors; `document.documentElement.className` reaches `tree grown` after scrolling to the bottom; clicking `[data-open="me"]` gives `panel-open` and the crown's left edge ≥ 0 px; `[data-close]` removes it.
- [ ] **Step 3: Verify Review Focus cases** (sandboxed iframe with `<base href="https://example.invalid/x/">`, deep link `#work`, keyboard Tab → label → Enter → Esc).
