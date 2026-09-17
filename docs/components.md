# Foundation components (full catalog)

**Audience:** pack authors with only this SDK repo.

This is the **entire** Forja design-system surface under `forja_foundation` — not only what the host mounts today.

| Status | Meaning |
|--------|---------|
| **mounted** | Pack JSON `{ "type": "…" }` works in host `PackPaintTree` (`paintFoundationType` for atoms/widgets) |
| **shell_forbidden** | Host chassis — never pack-styled (nav/brand/Toast/TV focus/settings player/empty shell) |
| **not_mounted** | Transitional only — inventory should not leave rows here |

Contract for every mounted node:

```
{ "type": "<id>", "id"?: "…", "props"?: { … }, "children"?: [ … ], "load"?: { "action", "params" } }
```

Helpers: [`catalog-kit.js`](../catalog-kit.js).  
Machine index: [`schema/layout-components.schema.json`](../schema/layout-components.schema.json) (`status` per entry).  
Guide: [`DEVELOPING.md`](../DEVELOPING.md).

Source tree (host): `packages/forja_foundation/lib/{components,widgets,blocks,brand,tokens}`.

---

## Motion presets (RFC-115)

Closed interaction intents. **Numbers live in host `ForjaMotionTheme`** — packs override; widgets never hardcode scales.

| Preset | Meaning |
|--------|---------|
| `cardLift` | posters, continue, episode, cast/trailer thumbs |
| `chipLift` | mood, season, scroller arrows, small controls |
| `fillOnly` | chips / rails / list rows (tint only, scale 1) |
| `railIcon` | nav rail (host chassis; rarely pack-styled) |
| `none` | static / Material-owned |

**Pack-wide** (layout root / `kit.stack`):

```js
{
  type: 'kit.stack',
  motion: {
    cardLift: { hoverScale: 1.08, focusScale: 1.08, durationMs: 200 },
    chipLift: { hoverScale: 1.06, durationMs: 140 },
  },
  children: [ /* … */ ],
}
```

**Per-node** (optional; wins over pack map for that node):

```js
{ type: 'shellChip', props: { motion: 'fillOnly' } }
{ type: 'posterCard', props: { motion: 'cardLift', hoverScale: 1.1 } }
```

Also overridable specialized entries: `playPulse`, `playButtonLift`, `favoriteHeartbeat`, `kenBurns` (`minScale` / `maxScale` / `cycleSeconds`), `shelfExpand`, `shelfRevealDelayMs`, `heroPillHover` / `heroPillExpand` / `heroPillLabel`, `filterChrome` / `filterPanel`, `scrollSnap`, `pageFade`. Unknown keys ignored. Leanback TV still disables hover lift via host `scaleOnHover` policy — packs do not own that gate.

---

## Mounted layout types (pack JSON today)

### Composer

| type | Foundation | Notes |
|------|------------|--------|
| `kit.stack` | `LayoutStack` | Vertical/horizontal children; `expand`, `axis` |

### Chrome

| type | Foundation | Notes |
|------|------------|--------|
| `kit.topBar` | `CatalogTopChrome` | `actions[]`; visual: `height`, `gap`, `pad`/`padding`; portals action may set `width` / size props for `PortalsChip`; chrome widgets accept optional visual props (`height`, `width`, `radius`, `pad`, `fontSize`, `iconSize`, `gap`, `rowHeight`, …) |
| `kit.categoryBar` | `CatalogChipBar` / `CatalogSideRail` / `CatalogCategoryRail` | `orientation: 'vertical'` → side rail; `features` → pin / reorder / Favorites; `pad`; rail visual: `rowHeight`, `fontSize`, `iconSize`, `rowPadH`, `listPadV`, `pinSlotWidth` |
| `kit.menu` | chips / `ForjaShellChip` | selectable wrap, `toggle`; visual: `pad`, `gap` |
| `kit.tabs` | `CatalogChipBar` | status/segment strip; visual: `pad` |
| `vertical_filters` | shell rail registry | body paints empty; options for provider rail |

### Lists & rails

| type | Foundation | Notes |
|------|------------|--------|
| `kit.list` | `CatalogCardsGrid` | grid/list/timeline; `kindMenu`, `hubWithLoad`; visual: `gap`, `pad`, `cardWidth`, `cardKind` |
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
| `hero` | `CinematicHero` | spotlight; usually `hubWithLoad`; `heightFraction`, `bleedDownOffset`, `actions` |
| `mood` | `MoodSection` | mood circles + results; `rowHeight`, `pad`, `titlePad`, `gap` |
| `continue` | `ContinueSection` | host watch history; `cardWidth`/`cardHeight`, `gap`, `pad`, `titlePad` |
| `because` | `BecauseSection` | because-you-watched; `pad`, `titlePad`, `gap`, `cardWidth`/`cardHeight` |

**Hero visual props** (omit → Forja defaults):

| Prop | Meaning | Default |
|------|---------|---------|
| `actions[]` | Ordered CTAs | `[{ id: details, tone: secondary }, { id: follow }]` |
| `actions[].id` | `details` (open) \| `follow` (list pin) | — |
| `actions[].tone` | `primary` \| `secondary` \| `streaming` | `secondary` (glass) for details; packs may set `primary` |
| `actions[].label` / `icon` | Pill copy / icon key (`info`, `play`) | View details / info |
| `slideCap` | Max carousel slides | `5` |
| `bleedDownOffset` | Extra backdrop under bleed rail | `homePageBottomSectionDownOffset` |
| `heightFraction` | Hero height as fraction of screen | ShellTokens compact/desktop |

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
| `posterCard` / `poster` | `InteractivePosterCard` / `PosterCard` | + `width`, `height`, `aspect` |
| `eventCard` / `event` | `EventCard` | + `width`, `height`, `tvDensity` |

**Compose with `kit.stack`** — put any **mounted** type in `children[]`. Prepared pages are optional shortcuts.

```javascript
kitStack('page', { expand: true }, [
  kitTopBar('chrome', { actions: […] }),
  kitCategoryBar('cats', { items: […], default: 'all' }),
  hubWithLoad(kitList('grid', { style: 'grid', kindMenu: 'cats' }), 'feed', {}),
]);
```

Unknown / `shell_forbidden` `type` → host paints nothing (or falls through to nested `paint` / `items`).

---

## Also mounted — atoms & widgets

Full slug + props inventory: [`schema/layout-components.schema.json`](../schema/layout-components.schema.json) (`status: mounted`). Host mounts via `paintFoundationType` in PackPaintTree.

Examples: `button`, `badge`, `posterRail`, `detailsHero`, `shellChip`, `sourcesPanel`, `frostedPanel`, `continueCard`, `eventDenseTile`, `searchBlock`, `catalogFilterSheet`, `guideFloatingEpg`, `liveTvScrollbar`, `sourcesExpandingSearch`, …

Callbacks stay host-injected (null/no-op when packs only paint look).

---

## Shell-forbidden

| Foundation | Why |
|------------|-----|
| `Toast` | stacking + presentation host-owned |
| `FocusableTap` / `TvSearchBrowseOverlay` / `ListLetterJumpScope` | TV focus policy |
| `LogoMenuRail` / `HubTopBar` / `EmptyShellFrame` | nav / app chassis |
| `ForjaLogo` / `AnimatedLogo` / `ForjaProfileAvatar` | brand / account |
| `SettingsPlayerChrome` / `LayoutScope` / `ShellPaintScope` | settings / host inject |
| `TmdbPaintGate` | host gate N/A |

Also never pack-styled: OTA banner, playback engine choice, unlock internals.

### Blocks (mounted when typed)

| Block | Mounted type | Key props |
|-------|--------------|-----------|
| `ColumnsHeaderBlock` | `columnsHeader` | title, sideWidth, sideOnLeading, sideGap, backgroundColor, emptys |
| `TopBodyBlock` | `topBody` | title, cardKind, backgroundColor, kind ids, emptys |
| `TabsCardsBlock` | `tabsCards` | backgroundColor, selected menu/tab, emptys |
| `CatalogBody` | `catalogBody` | bottomGap |
| `CatalogTopChrome` / `CatalogChipBar` / `CatalogCardsGrid` / `CatalogSideRail` | via chrome / list | actions, items, style, width, height, pad |
| `CatalogSearchPage` | `search` | hintText, backdropUrl, backgroundColor |
| `SearchBlock` | `searchBlock` | hintText |
| `DetailsBlock` / `DetailsScreen` / `DetailsPageBlock` | `details` | title, subtitle, backdrops, logoUrl, overview, genres, metaParts, rating, enableKenBurns, contentScrim, height, tvDensity, plainTitle, selectableTitle, chromeOnly, backgroundColor, loading, errorMessage |
| `MatchDetailsPage` | `matchDetails` | same core + factsValueMaxLines, belowActionRowFullWidth/Gap, scaleActionRow |
| `EntryDetails` / `EntryDetailsChrome` | `entryDetails` | title, emptyMessage |
| `ShellBlock` | `shell` | sideRailWidth, railOnLeading |
| `EmptyBlock` | `empty` | title, description, size |
| `EmptyShellFrame` | **shell_forbidden** | — |

### Brand

| Widget | Notes |
|--------|--------|
| `ForjaLogo` / `AnimatedLogo` / splash idle+halo+dots | **shell_forbidden** |
| `ForjaProfileAvatar` | **shell_forbidden** |

Schema inventory: **163** mounted · **35** shell_forbidden · **0** not_mounted.

---

## Keeping this in sync

1. New foundation widget → add row in `schema/layout-components.schema.json` (`mounted` + `type`/`props`, or `shell_forbidden`).
2. Host wires via `paintFoundationType` / PackPaintTree in the same change.
3. **Do not** shrink this file to layout types only — keep atom/widget inventory discoverable via schema.

Host implementation: Forja `PackPaintTree` + `paint_foundation_mount.dart` + `forja_foundation`.
