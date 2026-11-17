# natochi.cv: observed behaviour (17 Nov 2026)

Studied in the built-in browser at 1440x900 (mouse) and 375x812 (touch emulation), by clicking, hovering,
wheel-scrolling, pressing Esc, and reading the page's own state object (`window.__tree`) and script.

The whole site is one `<canvas>`. There are no DOM buttons, no links, no page scroll (document height = window
height), no URL change and no history entries at any point. Everything below is drawn and hit-tested by script.

The music player (bottom right) is ignored here on purpose: we have no such material.

## PC (1440x900)

| # | I did | It did |
|---|-------|--------|
| 1 | Loaded the page | Empty night sky with grass along the bottom. Without any scrolling, the tree grows by itself: trunk first, then the crown, done in about 3 to 4 s. The trunk stands at 40% of the width, not the centre. |
| 2 | Waited | Four labels appear at the ends of short thorny twigs sticking out of the crown: `work with me` and `writing` on the left, `updates` and `me` on the right. The label text is typed in letter by letter. |
| 3 | Scrolled the wheel on the first screen | Nothing. Nothing is pinned or faded by scroll; the wheel is only used later, to read long text. |
| 4 | (read from the script, not performed) Mouse movement | The scene drifts a few pixels with the pointer (parallax). |
| 5 | Hovered `updates` | A hand-drawn underline appears under the word; pointer cursor. |
| 6 | Clicked `updates` | The label turns bold, gains a full stop (`updates.`) and keeps its underline. A new leafy branch grows out of that label's twig, diagonally up and away from the tree (up-right, about 30 degrees), over about 1.5 s. The tree is NOT shrunk: the "camera" slides instead, so the tree ends up cropped in the bottom-left corner and the ground leaves the screen. A back arrow in a pill appears bottom-left. The other three labels stay on the tree. |
| 7 | Looked at the branch | Seven dated twigs (`jun 13` nearest the tree ... `apr 20` at the tip) sit along it on short stalks, alternating sides: one to the lower-right of the branch, the next to the upper-left. Leaf clumps sit between them and get smaller toward the tip. |
| 8 | Hovered `jun 13` | Underline under it, as with the section labels. |
| 9 | Clicked `jun 13` | It becomes `jun 13.` (bold, underlined). A sub-branch with leaves sprouts from that twig, heading away and down (down-right), about 0.8 s. The camera slides again (about 1 s) so the sub-branch tip lands near the top, with the tree back on screen at the far left, full size, ground and roots showing under it. |
| 10 | Waited | The post is typed out at the tip of the sub-branch, letter by letter (screenshots caught it mid-word), flowing downward in a column about a quarter of the screen wide, to the right of the tree. No box or card around it: plain text on the sky. Images in the post appear as it reaches them. |
| 11 | Wheel-scrolled | The camera moves straight down along the text (the tree, ground, roots and soil scroll away upward). Scrolling up returns. |
| 12 | Opened a second twig (`apr 28`) while `jun 13` was open (through the page's own `open()`; my mouse click missed the word) | `jun 13` closed (its sub-branch and text went away) and `apr 28` opened the same way. Only one twig is open at a time. |
| 13 | Pressed Esc with a post open | One step back: text and sub-branch go, camera returns to the list view of step 6. Backspace is wired to the same step in the script (not pressed). |
| 14 | Clicked empty sky in the list view | One step back: the branch retracts and the camera returns to the first screen. |
| 15 | Clicked the back pill | Same one step back as Esc. From a post it goes to the list; from the list it goes to the tree. |
| 16 | (read from the click handler, not performed) Clicking the open section label again | It closes that section. |
| 17 | Clicked `me` | `me.` bold. This section has no twigs: one leafy branch grows up-right from the label's twig and the text is typed straight at its tip, right of the tree (tree slides to the far left, ground and roots visible). Some words carry a marker underline; photos are taped to the right of the text. |
| 18 | Clicked `work with me` (a left-hand label) | Mirror image: the branch grows up-LEFT and the camera slides the other way, tree cropped at the bottom-right. Its two twigs (`book a call`, `work@natochi.cv`) are plain links that fire at once instead of opening text. |
| 19 | Opened `writing` while `updates` was open (via the page's own `open()`) | `updates` and its open post closed; `writing` opened. One section at a time. |
| 20 | Checked the address bar and Back | URL never changes, nothing is pushed to history, so browser Back leaves the site. |

## Phone (375x812, touch)

| # | I did | It did |
|---|-------|--------|
| 1 | Loaded the page | Same self-growing tree, but centred (trunk at 50%) and drawn tall and narrow. Labels left and right of the crown as on PC. |
| 2 | Tapped `updates` | Same model as PC, no separate phone layout: the camera slides until the tree is almost entirely off the left edge (a sliver of crown remains), and the branch climbs diagonally across the whole screen, steeper than on PC (about 55 degrees). The seven dated twigs alternate sides along it. The section's own label is off-screen. Back pill bottom-left. |
| 3 | Tapped `jun 13` | Sub-branch sprouts, then the camera sweeps quickly so only a stub of the sub-branch tip is left in the top-left corner. The tree and the list are off-screen. |
| 4 | Waited | The post is typed in under that stub using the full width of the screen (about 20 px margins), flowing down past the ground line. |
| 5 | Dragged / scrolled | The camera moves down through the text. |
| 6 | Tapped the back pill | One step back to the diagonal list. |
| 7 | Tapped the back pill again | One more step back to the whole tree. |
| 8 | Tapped `me` | Tree slides off to the left; text typed full-width from a small stub at the top-left; photos follow below the text. |

## Summary of the model

1. One world, one camera. The tree never changes size; sections and items are reached by sliding the camera.
2. Three levels: tree -> section branch (list of twigs) -> one twig's text. A section without twigs goes straight to text.
3. A branch always grows from the label that was tapped, upward and away from the trunk, on the label's own side.
4. Twigs alternate sides along the branch. One twig open at a time; one section open at a time.
5. Text is typed at the end of a sub-branch, on bare sky, beside the tree on PC and full-width on phones.
6. Every way back (Esc, Backspace, back pill, empty click) goes back exactly one level.
7. Phone = the same thing through a narrower window.

## Gaps vs ours (before this change)

1. Growth: natochi's tree grows by itself on load; ours grows as you scroll a 170vh runway. (Left as is: see "Not matched".)
2. Opening a section: ours shrank the tree to 72% and stepped it aside; natochi keeps the size and slides the camera, ground included.
3. Branch direction: ours ran level across the top of the screen; natochi's climbs diagonally from the tapped label.
4. Twig text: ours opened a bordered card under the branch; natochi grows a sub-branch and types the text at its tip, no card.
5. `me`: ours was a list of five twigs; natochi's `me` is a single text.
6. Stepping back: ours had Esc and a "back to the tree" text button that closed everything; natochi goes one level at a time and has a back pill, Backspace and empty-click.
7. Tapping an open label or an open twig again: ours did nothing; natochi closes it.
8. Other labels while a section is open: ours hid them; natochi leaves them on the tree so you can jump straight to another section.
9. Open state: natochi marks the open label/twig with bold + full stop + underline; ours only underlined twigs.
10. Phone: ours covered the tree with a dark panel holding a vertical dotted list; natochi uses the same camera-and-branch model as PC.

## Not matched, on purpose

- Self-growing tree: our scroll-to-grow runway is part of the existing brief, so it stays. Flagged for a decision.
- Letter-by-letter typing: ours writes the text out word by word, with all of it already in the page for screen readers.
- Bare text on the sky: ours has a soft dark shade behind the text so it stays readable over the bright dune.
- Canvas-only text: ours stays real HTML (buttons, selectable text, links) for keyboard and screen-reader use.
- No URL: ours keeps `/#work` deep links and browser Back, extended to items (`/#work/duqm-study`).
- "Say hi" twigs open a short text with the link, not fire the link directly (taps on links are swallowed by some embedded phone viewers).
- Wheel-pans-the-camera for long text: ours scrolls the text block itself when it is taller than the screen.
- Pointer parallax, music player, photos: none.

## What was changed in `index.html` to match

- The corner links (CV as PDF, Websites, Full portfolio) and the intro hide while a branch is open, so nothing floats over the twigs.
- Coming back to the tree always returns to the fully grown tree.
- One camera (`.cam`, `--cx/--cy`): tree, dunes, labels, twigs and text slide together; the tree is no longer shrunk. Stars and moon stay still.
- Dunes moved to their own wide canvas (`#dunes`, `drawDunes()`) so the ground travels with the tree.
- `growSection()`: a leafy branch grows from the tapped label, up and away from the trunk, twigs alternating sides. Same code on phones (steeper), replacing the dark panel and the dotted vertical list.
- `showLeaf()`: a sub-branch grows from the tapped twig and the text is written out word by word at its tip, no card; beside the whole tree when it fits, full-width on phones.
- `me` is a single text at the end of its own branch.
- `go()` / `back()`: one open section, one open twig; Esc, Backspace, the back pill, an empty tap and browser Back each go back one level; tapping an open label or twig closes it.
- Open label / twig: bold, underlined, with a full stop. Other labels stay on the tree, dimmed, and can be tapped directly.
- Deep links now also reach a twig: `/#work/duqm-study`.
