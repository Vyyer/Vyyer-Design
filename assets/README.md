# Flag assets

## Why these exist

The country screens render flags as emoji (`🇺🇸` = the regional-indicator pair `U+1F1FA U+1F1F8`).
That works on macOS and iOS, which ship colour flag glyphs — and **fails on Windows**, which
does not. Chrome and Edge on Windows fall back to drawing the two letters in a box, or
nothing at all. Android coverage varies by OEM.

So flags should be **images**, not text, anywhere they have to render reliably.
This folder is that image set.

## What's here

```
assets/
  flags/
    AD.svg … ZW.svg      247 files, one per ISO 3166-1 alpha-2 country code
    countries.json       code → name, emoji and file path, sorted by name
  README.md
  flags.html             browsable contact sheet (open it in a browser)
```

`countries.json` entries look like:

```json
{ "code": "US", "name": "United States", "emoji": "🇺🇸", "file": "flags/US.svg" }
```

The list matches the countries the Workflow page offers, so the two stay in step.

## Using them

```html
<img src="assets/flags/US.svg" alt="" width="30" height="30">
```

Every file is a 36×36 viewBox with the flag drawn as a rounded rectangle about
36×26, centred — the same shape the emoji drew. So **contain them, don't crop them**:

```css
.flag { width: 30px; height: 30px; object-fit: contain; }
```

`object-fit: cover` (or a `border-radius: 50%` circular mask) cuts the left and
right off the flag, which is wrong for most of them and unreadable for a few —
Andorra and Algeria lose their emblems entirely. The transparent band above and
below the flag inside the square is intentional: it keeps every flag on the same
baseline whatever its aspect ratio. Set `alt=""` — the country name is already in the row
next to it, so the flag is decorative and shouldn't be announced twice.

For a long list, let the browser lazy-load them: `loading="lazy"` on each `<img>`.
At ~5 KB each the whole set is 1.3 MB, but a screen only ever shows a dozen.

## Source and licence

[Twemoji](https://github.com/twitter/twemoji) v14.0.2, by Twitter.
Graphics licensed **CC-BY 4.0** — https://creativecommons.org/licenses/by/4.0/

Attribution is required wherever these ship. The usual line is:

> Flag graphics from Twemoji, © Twitter, Inc and other contributors, CC-BY 4.0

Files are unmodified, renamed from Twemoji's codepoint names (`1f1fa-1f1f8.svg`) to
their country code (`US.svg`) so they're findable. Each is a plain `<path>` SVG —
no scripts, no external references.

## Re-generating

`countries.json` is built from the code list in `workflow.html`, with names from
`Intl.DisplayNames`. If that list changes, the matching SVG is
`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/<codepoints>.svg`,
where the codepoints are the flag emoji's, lowercase hex, joined with `-`.
