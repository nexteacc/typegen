# Text Style Filter Library

> Goal: Reorganize existing "writing style keywords" into a three-tier structure: **Style / Structure / Strategy & Controls**, and synchronize with `filters-data.ts`, `SUPPORTED_STYLES`, and icon resource naming.

---

## A. Style

| Display Name | API Parameter | Icon File |
| --- | --- | --- |
| **AP Style** | `ap-style` | `/icons/ap-style.png` |
| **APA Style** | `apa-style` | `/icons/APA-style.svg` |
| **IEEE Style** | `ieee-style` | `/icons/IEEE-style.png` |
| **Textbook Style** | `textbook-style` | `/icons/Textbook-style.svg` |
| **Investigative** | `investigative` | `/icons/Investigative.png` |
| **4chan Style** | `4chan-style` | `/icons/4chan-style.png` |
| **Reddit Style** | `reddit-style` | `/icons/Reddit-style.png` |
| **BuzzFeed** | `buzzfeed-style` | `/icons/Buzzfeed-style.png` |
| **Twitter Style** | `twitter-style` | `/icons/Twitter-style.png` |
| **Instagram Caption** | `instagram-caption` | `/icons/Instagram-caption.svg` |
| **Meme Style** | `meme-style` | `/icons/Meme-style.png` |
| **Hemingway Style** | `hemingway-style` | `/icons/Hemingway-style.svg` |

---

## B. Structure

| Display Name | API Parameter | Icon File |
| --- | --- | --- |
| **Inverted Pyramid** | `inverted-pyramid` | `/icons/inverted-pyramid.png` |
| **Headline Driven** | `headline-driven` | `/icons/Headline-driven.png` |
| **Listicle** | `listicle` | `/icons/Listicle.png` |
| **Threaded** | `threaded` | `/icons/Thread-based.png` |
| **How-to** | `how-to` | `/icons/How-to.svg` |
| **Bullet-pointed** | `bullet-pointed` | `/icons/Bullet-pointed.svg` |
| **IMRaD** | `imrd-style` | `/icons/IMRaD.png` |

---

## C. Strategy & Controls

| Display Name | API Parameter | Icon File |
| --- | --- | --- |
| **Clickbait** | `clickbait` | `/icons/Clickbait.png` |
| **Call to Action** | `call-to-action` | `/icons/Call-to-Action.png` |
| **SEO Optimized** | `seo-optimized` | `/icons/SEO-optimized.png` |
| **FOMO Driven** | `fomo-driven` | `/icons/FOMO-driven.png` |
| **Hashtag Heavy** | `hashtag-heavy` | `/icons/Hashtag-heavy.png` |
| **Emoji Laden** | `emoji-laden` | `/icons/Emoji-laden.png` |
| **Flesch-Kincaid** | `flesch-kincaid` | `/icons/Flesch-Kincaid.png` |
| **Citation Heavy** | `citation-heavy` | `/icons/Citation-heavy.png` |
| **Technical Jargon** | `technical-jargon` | `/icons/Technical-jargon.png` |

---

> Maintenance Notes:
> - When adding new styles, please update this table, `components/style-filter/filters-data.ts`, `lib/api-types.ts`, `lib/openai-service.ts`, and corresponding icon resources simultaneously.
> - "Display Name" in the documentation should match README and UI display; "API Parameter" corresponds to `apiParameter` / `SUPPORTED_STYLES` key values.
> - Icons are stored uniformly in `public/icons/`, following kebab-case or capitalized (SVG) naming conventions.