# Foundation components (full catalog)

**Audience:** pack authors with only this SDK repo.

This is the **entire** Forja design-system surface under `forja_foundation` — not only what the host mounts today.

| Status | Meaning |
|--------|---------|
| **mounted** | Pack JSON `{ "type": "…" }` works in host `PackPaintTree` now |
| **not mounted** | Widget exists in foundation; host does **not** paint it from pack JSON yet. Do not emit that `type` expecting UI. Request host wiring or compose from mounted types. |

Contract for every mounted node:

```
{ "type": "<id>", "id"?: "…", "props"?: { … }, "children"?: [ … ], "load"?: { "action", "params" } }
```

Helpers: [`catalog-kit.js`](../catalog-kit.js).  
Machine index: [`schema/layout-components.schema.json`](../schema/layout-components.schema.json) (`status` per entry).  
Guide: [`DEVELOPING.md`](../DEVELOPING.md).

Source tree (host): `packages/forja_foundation/lib/{components,widgets,blocks,brand,tokens}`.

---

## Mounted layout types (pack JSON today)

### Composer

| type | Foundation | Notes |
|------|------------|--------|
| `kit.stack` | `LayoutStack` | Vertical/horizontal children; `expand`, `axis` |

### Chrome

| type | Foundation | Notes |
|------|------------|--------|
| `kit.topBar` | `CatalogTopChrome` | `actions[]` |
| `kit.categoryBar` | `CatalogChipBar` / `CatalogSideRail` / `CatalogCategoryRail` | `orientation: 'vertical'` → side rail; `features` → pin / reorder / Favorites widgets |
| `kit.menu` | chips / `ForjaShellChip` | selectable wrap, `toggle` |
| `kit.tabs` | `CatalogChipBar` | status/segment strip |
| `vertical_filters` | shell rail registry | body paints empty; options for provider rail |

### Lists & rails

| type | Foundation | Notes |
|------|------------|--------|
| `kit.list` | `CatalogCardsGrid` | grid/list/timeline; `kindMenu`, `hubWithLoad`; visual: `gap`, `pad`, `cardKind` |
| `kit.row` (`rail` / `ranked`) | `PosterRail` via paint | horizontal posters |

**Rail visual props** (omit → Forja ShellTokens / catalog density):

| Prop | Meaning | Default |
|------|---------|---------|
| `gap` | Space between cards | `posterCardRowGap` / TV gap |
| `rankedGap` | Gap when `ranked` / `style: numbered` | clamp of `gap` (3–6) |
| `pad` | Horizontal section inset | catalog section pad |
| `titlePad` | `{ top, bottom }` or number | title top / bottom gap tokens |
| `aspect` | `portrait` \| `landscape` | portrait |

### Home sections

| type | Foundation | Notes |
|------|------------|--------|
| `hero` | `CinematicHero` | spotlight; usually `hubWithLoad` |
| `mood` | `MoodSection` | mood circles + results; `rowHeight`, `pad`, `titlePad` |
| `continue` | `ContinueSection` | host watch history; `cardWidth`/`cardHeight`, `gap`, `pad`, `titlePad` |
| `because` | `BecauseSection` | because-you-watched; `pad`, `titlePad` |

**Hero visual props** (omit → Forja defaults):

| Prop | Meaning | Default |
|------|---------|---------|
| `actions[]` | Ordered CTAs | `[{ id: details, tone: primary }, { id: follow }]` |
| `actions[].id` | `details` (open) \| `follow` (list pin) | — |
| `actions[].tone` | `primary` \| `secondary` \| `streaming` | `primary` for details |
| `actions[].label` / `icon` | Pill copy / icon key (`info`, `play`) | View details / info |
| `slideCap` | Max carousel slides | `5` |
| `bleedDownOffset` | Extra backdrop under bleed rail | `homePageBottomSectionDownOffset` |

ShellTokens = Forja look when a key is absent. Another pack may set `tone: secondary` or a different `gap` without host changes.

**`kit.categoryBar` features** (vertical Live IPTV rail):

| Prop | Meaning |
|------|---------|
| `features.pin` | Show pin control; host persists order via store engine |
| `features.reorder` | Delayed drag (desktop) / hold-OK float (TV) when sort is playlist |
| `features.widgets` | `['favorites','watched']` → synthetic Favorites / Already watched rows (`__favorites__` / `__watched__`) |

Host injects `favorites`, `watched`, `pinnedCats`, `categoryOrder` into feed params. Pack filters on `categoryId`.

**Not pack-styled:** nav rail, empty-shell frame, toasts, TV focus policy, playback engines.

| type | Foundation | Notes |
|------|------------|--------|
| `columnsHeader` | `ColumnsHeaderBlock` | top + side + body |
| `topBody` | `TopBodyBlock` | top + kinds + grid |
| `tabsCards` | `TabsCardsBlock` | menu + tabs + cards |
| `catalogBody` | `CatalogBody` | scroll of sections |
| `search` | `CatalogSearchPage` | `hintText`, `backdropUrl`, `backgroundColor` |
| `details` | `DetailsBlock` | media details; visual: `enableKenBurns`, `contentScrim`, `height`, `tvDensity`, … |
| `matchDetails` | `MatchDetailsPage` | match details; same + `factsValueMaxLines`, below-action-row layout |
| `entryDetails` | `EntryDetails` | simple entry chrome |
| `shell` | `ShellBlock` | page shell |
| `empty` | `EmptyBlock` | empty state |

### Paint cards (inside `items[]`)

| paint.type | Foundation |
|------------|------------|
| `posterCard` / `poster` | `InteractivePosterCard` / `PosterCard` |
| `eventCard` / `event` | `EventCard` |

**Compose with `kit.stack`** — put any **mounted** type in `children[]`. Prepared pages are optional shortcuts.

```javascript
kitStack('page', { expand: true }, [
  kitTopBar('chrome', { actions: […] }),
  kitCategoryBar('cats', { items: […], default: 'all' }),
  hubWithLoad(kitList('grid', { style: 'grid', kindMenu: 'cats' }), 'feed', {}),
]);
```

Unknown / not-mounted `type` → host paints nothing (or falls through to nested `paint` / `items`). Prefer **mounted** types until host wires more.

---

## Not mounted — atoms (`components/`)

Shadcn-style primitives. Used by host Dart and inside widgets above. **No pack `type` yet** — possible params when mounted later:

| Component | Possible params |
|-----------|-----------------|
| `Button` | label, icon, variant (primary/secondary/ghost/outline/destructive/link), size, loading, expand, color |
| `ButtonGroup` | orientation, spacing |
| `Badge` | label, variant, size |
| `Alert` / `InlineAlert` | title, description, variant |
| `Avatar` | imageUrl, initials, size |
| `Input` / `SearchField` / `Textarea` | hintText, variant, size, enabled |
| `Checkbox` / `Radio` / `Switch` / `Toggle` | value, label, size/variant |
| `Progress` / `Spinner` / `Skeleton*` | value/size/color; skeleton w/h/lines |
| `PageDots` | count, index, size, spacing |
| `PosterFrame` | aspectRatio, width, borderRadius |
| `MoodCircle` | label, imageUrl, selected, size, accent |
| `Heading` / `Body` | text, level/tone, size, color |
| `Separator` | orientation, thickness, color |
| `Empty` | title, description, icon, size |
| `Select` / `SegmentedControl` / `Slider` | options/value/min/max |
| `VerticalMenu` | width, padding, backgroundColor |
| `Tooltip` / `Kbd` / `Label` / `Field` / `Item` / `ListTile` / `Breadcrumb` / `Accordion` / `InputGroup` | as Dart constructors |
| `ForjaDialog` / `Sheet` / `Toast` | title/description/variant/duration |

---

## Not mounted — widgets (composers)

Exported from `widgets/widgets.dart` (and siblings). Host uses these; packs only reach them when wrapped by a **mounted** type above.

### Catalog

| Widget | Possible params |
|--------|-----------------|
| `PosterRail` | itemWidth/Height, height, padding (gap via host separator) |
| `PosterCard` / `InteractivePosterCard` | title, imageUrl, rating, rank, badge, aspect, width/height, fonts |
| `EventCard` / `EventDenseTile` | match fields, selected, live, width/height |
| `CinematicHero` | slides, height, kenBurns, heightFraction, paddings, bleedDownOffset, pageBottomChild |
| `ContinueSection` / `ContinueWatchingCard` | title, cardWidth/Height, progress, paddings |
| `BecauseSection` | title, becauseTitle, seedPosterUrl |
| `MoodSection` | title, rowHeight, paddings |
| `KenBurnsBackdrop` / `RotatingHeroBackdrop` | durations, scales, tint, fit |
| `CatalogSearch*` / `FilterLens` | hint, filters, compact |
| `HomeLoadingSkeleton` / `ServerGrid` / `CategoryCircleMeta` | loading / grid / category helpers |

### Details

| Widget | Possible params |
|--------|-----------------|
| `DetailsHero*` / `DetailsBody` / `DetailsScrollPage` | height, kenBurns, contentScrim, bodyOverlap, backgroundColor |
| `PlayRow` / `HeroPill*` | spacing; tone via `HeroPillPlayTone` |
| `ListStatusPin` / `ListStatusHero` | status, iconSize, iconColor |
| `Cast` / `Trailers` / `Recommendations` | title, rowHeight, gap, outdent |
| `FactsPanel` / `MetaLine` | rows, rating, singleLine |
| `TvSeasonEpisodePicker` / `EpisodeRangeSelector` | seasons/episodes/ranges |
| `WatchProgressBar` / `WatchSeriesProgress` | progress, accent, compact |

### Chrome / shell

| Widget | Possible params |
|--------|-----------------|
| `LayoutStack` | children, expand, axis (`kit.stack`) |
| `ForjaShellChip` / `ForjaActionChip` | label, selected, icon, padding, fontSize |
| `ShellSectionTitle` | title, subtitle, padding, trailing |
| `HorizontalScroller` | height, padding, arrowOffset |
| `LogoMenuRail` / `HubTopBar` | items, selectedId, width, opacity |
| `SidePanelOverlay` / `CatalogList` | panelWidth, open, scrim |
| `CatalogPosterGrid` / `CatalogDenseList` | layout, paddings, gaps |
| `PortalListPanel` / `PortalListRow` / `PortalsChip` | panel shell + 98px portal card (expiry/badge/seats/rail); chip props |

### Sources / Live TV / guide

| Widget | Possible params |
|--------|-----------------|
| `SourcesPanelChrome` | title, tabs, embedded, TV density |
| `ChannelGuidePanel` / EPG / search | guide data, compact/floating, isTv |
| `GuideBrowseTextField` / `PlayerStatsList` | decoration/style; rows |

### Feedback / TV / focus

| Widget | Possible params |
|--------|-----------------|
| `ForjaFrostedPanel` | border, blurSigma, frozenFrame |
| `ForjaLoadingDots` / `ShellErrorRetryPanel` | color; message |
| `ShellCardPlayOverlay` | active, visible, diameter |
| TV browse caret / typewriter | size, color, text |

**Shell-forbidden (never pack-styled):** nav rail width/brand, account chrome, OTA banner, toast stacking, TV focus graph policy, playback engine choice, unlock internals.

### Blocks (also used as mounted when typed)

| Block | Mounted type | Key props |
|-------|--------------|-----------|
| `ColumnsHeaderBlock` | `columnsHeader` | title, sideWidth, sideOnLeading, sideGap, backgroundColor |
| `TopBodyBlock` | `topBody` | title, cardKind, backgroundColor, kind ids |
| `TabsCardsBlock` | `tabsCards` | backgroundColor, selected menu/tab |
| `CatalogBody` | `catalogBody` | bottomGap |
| `CatalogTopChrome` / `CatalogChipBar` / `CatalogCardsGrid` / `CatalogSideRail` | via chrome / list | actions, items, style, width |
| `CatalogSearchPage` | `search` | hintText, backdropUrl, backgroundColor |
| `SearchBlock` | **not mounted** | hintText |
| `DetailsBlock` / `DetailsScreen` / `DetailsPageBlock` | `details` | title, subtitle, backdrops, logoUrl, overview, genres, metaParts, rating, enableKenBurns, contentScrim, height, tvDensity, plainTitle, selectableTitle, chromeOnly, backgroundColor, loading, errorMessage |
| `MatchDetailsPage` | `matchDetails` | same core + factsValueMaxLines, belowActionRowFullWidth/Gap, scaleActionRow |
| `EntryDetails` / `EntryDetailsChrome` | `entryDetails` | title, emptyMessage |
| `ShellBlock` | `shell` | sideRailWidth, railOnLeading |
| `EmptyBlock` | `empty` | title, description, size |
| `EmptyShellFrame` | **not mounted** (host shell frame) | sideRailWidth |

### Brand

| Widget | Notes |
|--------|--------|
| `ForjaLogo` / `AnimatedLogo` | brand — shell-owned |
| `ForjaProfileAvatar` | profile — shell-owned |

---

## Keeping this in sync

1. New foundation widget → add a row here + `schema/layout-components.schema.json` with `status: "not_mounted"` (or `mounted` if host ships wiring in the same change).
2. Host wires a new pack `type` → flip to `mounted`, document props, add `catalog-kit.js` helper if useful.
3. **Do not** shrink this file to “mounted only.” Pack authors need the full DS inventory to know what exists and what’s missing from the host.

Host implementation: Forja `PackPaintTree` + `forja_foundation`.
