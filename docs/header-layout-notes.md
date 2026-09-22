# Header implementation notes — PR #49

Updated 2026-09-19. Implemented locally on `uklid-codebase`, based on PR head `6b22837`. No commit or push was made.

## Agreed layout

There is no desktop/mobile breakpoint. The menu is 70 × 70 CSS pixels at every width, with at least 12px clearance from the text.

```css
grid-template-columns:
  minmax(0, 1fr)
  minmax(0, max-content)
  minmax(calc(70px + 12px), 1fr);
```

The title and subtitle occupy column two. The menu aligns to the far right of column three. The first column is empty; it needs no placeholder element.

When space permits, the outside columns have equal widths and the text is exactly centered in the header. As space decreases, the right column stops at 82px while the left column continues shrinking. Once the left column reaches zero, the text wraps within the remaining width. The wider of the title and subtitle determines the natural text width.

This supersedes the earlier recommendation of a fixed 48rem breakpoint and different desktop/mobile menu sizes.

## Responsibilities

- `components/site-header.js` creates one stable header and drawer container. Attribute changes update only the relevant title, subtitle, or image, preserving menu state and listeners. Subtitles intentionally support page-authored HTML links. An empty subtitle is hidden.
- `css/sdilene/menu/menu.css` owns the responsive grid. `min-width: 0` and `overflow-wrap: anywhere` keep long text within its track. The fixed header has `max-width: 100vw` so unrelated page overflow cannot stretch it beyond the phone screen.
- The component's `ResizeObserver` writes the actual header height to `--site-header-height` on the body. `css/sdilene/obecne-sdilene.css` uses it for top padding. This handles initial load, wrapping, changed text, and font changes without measuring horizontal text/menu overlap.
- `scripts/generace-menu.js` runs its existing `runArrowCode()` once after inserting the drawer content. It no longer depends on an event from the removed header script.

## Removed or repaired

- Removed `scripts/responsivni-nav.js` and its imports, including production-hosted imports. It measured overlap and replaced the header/drawer DOM.
- Removed the old `.pravo`, `.divny-flex-menu-*`, and legacy header layout rules. Removed the obsolete theme-image fallback for that header markup.
- Removed header resize/padding logic from `obecny.js`; the component now owns that responsibility.
- Removed the missing `menu2.css` import and the remaining import of the already-deleted `responzivni-pro-pocitacV2.js`.
- Corrected the header component path on `Odehrane LARPy/Odehrane LARPy.html`.
- Updated production-hosted header-related script imports to relative paths so local previews and the PR use their own code.
- Updated the README's header/menu initialization description.

## Side menu scope

The drawer CSS in both menu stylesheets is unchanged from `.side-menu` onwards. Existing toggle/outside-click functions and hover/click arrow handlers are unchanged. Only arrow initialization was decoupled from the old header event. `menu-mobil.css` remains because it contains drawer styling; do not remove it as dead header code.

Existing drawer accessibility and positioning issues remain separate work: the trigger is still a clickable image, and outside-click closing still does not restore `inert`. The calendar's existing horizontal content overflow can also put the fixed drawer beyond the phone screen; the new header itself is width-constrained, but no calendar or drawer layout fix was included.

## Verification

- Chromium/Chrome: all 12 pages containing `site-header`, checked through a local server under the `/Chynicky_LARP/` URL prefix.
- Widths: 320, 375, 390, 480, 600, 768, 1024, 1440, then back to 390px.
- Verified menu dimensions, minimum clearance, title containment, grid overflow, desktop centering, height/body-offset agreement, and drawer DOM identity across resizing.
- Verified open/close, outside click, desktop submenu hover, light theme switching, and preservation of an open drawer across resizing.
- Verified short versus long titles at the same 600px width; the short title remained centered and the longer one moved left. At 320px the long title reclaimed the entire empty left track.
- Verified dynamic title/subtitle updates, linked subtitles, missing subtitles, increased title font size, and preservation of the theme button node.
- Phone emulation: verified the homepage header stays within the viewport despite calendar overflow, and tested touch submenu open/close after repeated resizing on the O nás page.
- No page JavaScript errors or missing local JS/CSS requests during the final run. External fonts/services were blocked; same-site remote images were served from local files and theme storage used an inert fixture. This was not a live external-service or Safari/Firefox test.
- Visually inspected desktop and narrow header screenshots. Syntax checks passed for the edited JavaScript. Git whitespace checks passed with CRLF endings recognized.

Source references: [PR #49](https://github.com/Burthgulash/Chynicky_LARP/pull/49), [CSS grid track sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns).
