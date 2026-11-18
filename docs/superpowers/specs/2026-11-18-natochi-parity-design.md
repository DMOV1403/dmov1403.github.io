# Tree page: one behaviour on phone and PC, branches as in natochi's code

Design for Osama's approval. 18 November 2026.

## Intent
Osama's reference (natochi.cv) behaves and looks the same on phone and PC. Ours does not: on phones the four
labels were moved into a row above the crown, and sub-branches were built three different ways from video
guesses. He wants ours to match the reference's behaviour, on both, using how the reference really works.

Source of truth: natochi's client code (read 18 Nov 2026, `main.js`), not the screen recordings.

## Goals
1. One layout rule and one behaviour for every screen width. No label row on phones: labels sit beside the
   crown at the end of their own limbs, as on PC. Small screens are handled by the camera sliding, shorter
   branches and a narrower text column, not by a different layout.
2. One "open a word" routine used at both levels. In natochi a word that has content is opened exactly like a
   section: a branch grows from its twig. Sections and items stop being two code paths.
3. Opening a word, as in natochi:
   - the new branch starts 80% of the way along that word's twig (beside the word, on the word's side);
   - its direction starts from the twig's own angle and bends upward; several candidate curves are scored
     (off-screen below ground, hitting other branches or words) and the first clean one wins;
   - leaf clumps alternate along it, shrinking toward the tip, each on a tiny stalk; a small clump at the tip;
   - the text hangs from a short bare stalk at 90% of the branch, on the side the stalk points;
   - sibling words un-type from the end (0.4 s) and their twigs retract; they type back in on the way back
     (0.55 s); the open word gets a full stop and goes bold;
   - the camera pans (no zoom) to frame the new branch plus its text, easing continuously.
4. Twigs along a branch alternate sides, flipping only when a word would collide.

## Non-goals
- Not copying natochi's look: our ghaf tree, dunes, moon, shooting star, fonts and colours stay.
- No music player, photo piles or mouse parallax.

## Anti-goals (would make it a failure)
- Any difference in behaviour between phone and PC beyond sizes.
- A sub-branch that starts anywhere but beside the tapped word, or grows on the other side of it.
- Words blinking out instead of un-typing.
- Losing what already works: the tree growing on load, labels typing in, one step back per press, deep links,
  the laptop label fixes, reduced-motion handling, the plain-CV fallback.

## Constraints
- One static file (`index.html`), 2D canvas, Baseline Widely available.
- Text stays real HTML over the canvas (natochi draws text on canvas; ours must stay selectable, linkable and
  readable by screen readers), so "un-typing" is done on the HTML words.
- The existing verify probe must keep passing; new checks are added, none weakened.

## Approaches
1. **Port natochi's model (chosen).** Replace `growSection` and `showLeaf` with one routine that opens any
   word: curve candidates with scoring, alternating children, text as the single child of an item. Phone and
   PC share it; only sizes differ (branch length, text width, margins). Most work, but it removes the cause of
   the mismatches: two code paths and guessed geometry.
2. Patch the current code: move the shoot's start to the word, fix its side, add un-typing, and move the phone
   labels beside the crown. Quicker, but keeps separate section and item code and separate phone rules, which
   is what kept producing differences.
3. Draw everything on canvas like natochi. Rejected: loses real text, links and accessibility.

## Decided by Osama
- Phone must match PC in behaviour and look, as the reference does.
- Follow the reference's real code.

## My calls (say if you disagree)
- Keep browser Back and direct links (`/#work/duqm-study`). Natochi has neither; ours already work.
- "me" opens with twigs on PC too (today it is one long text on PC, twigs on phone), so both match.
- Sizes from natochi: branch length `200 + 56n` (PC) or `150 + 42n` (under 700px wide), capped to the screen;
  text width 440 (PC) or `min(width - 56, 360)`; growth 1.1 s, close 0.55 s.
- The shooting star and tree-growth timing stay as they are.

## Left to the builder
- Exact penalty weights for choosing a curve, tuned until no word or text lands on the crown, the labels, the
  name block or off-screen at 390, 768, 1280, 1440 and 1920 wide.
- How far the camera may slide on phones before the label that was tapped leaves the screen.

## How it will be checked
- Same script on phone (390) and PC (1440): open every section, then every word. For each: the branch starts
  within a few pixels of the word's twig and on the word's side; the text is fully on screen; nothing overlaps
  the labels or name; siblings are hidden only after un-typing and come back on Back.
- Phone and PC give the same answers to "which side does word N hang on" and "which side does its branch grow".
- Screenshots of each case, compared with frames of the reference recording.
