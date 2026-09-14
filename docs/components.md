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
| `kit.categoryBar` | `CatalogChipBar` / `CatalogSideRail` | `orientation: 'vertical'` → side rail |
| `kit.menu` | chips / `ForjaShellChip` | selectable wrap, `toggle` |
| `kit.tabs` | `CatalogChipBar` | status/segment strip |
| `vertical_filters` | shell rail registry | body paints empty; options for provider rail |

### Lists & rails

| type | Foundation | Notes |
|------|------------|--------|
| `kit.list` | `CatalogCardsGrid` | grid/list/timeline; `kindMenu`, `hubWithLoad` |
| `kit.row` (`rail` / `ranked`) | `PosterRail` via paint | horizontal posters |

### Home sections

| type | Foundation | Notes |
|------|------------|--------|
| `hero` | `CinematicHero` | spotlight; usually `hubWithLoad` |
| `mood` | `MoodSection` | mood circles + results |
| `continue` | `ContinueSection` | host watch history |
| `because` | `BecauseSection` | because-you-watched |

### Prepared pages / surfaces

| type | Foundation | Notes |
|------|------------|--------|
| `columnsHeader` | `ColumnsHeaderBlock` | top + side + body |
| `topBody` | `TopBodyBlock` | top + kinds + grid |
| `tabsCards` | `TabsCardsBlock` | menu + tabs + cards |
| `catalogBody` | `CatalogBody` | scroll of sections |
| `search` | `CatalogSearchPage` | search page chrome |
| `details` | `DetailsBlock` | media details |
| `matchDetails` | `MatchDetailsPage` | match details |
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

Shadcn-style primitives. Used by host Dart and inside widgets above. **No pack `type` yet.**

| Component | Path |
|-----------|------|
| `Button` | `components/button.dart` |
| `ButtonGroup` | `components/button_group.dart` |
| `VerticalMenu` | `components/vertical_menu.dart` |
| `Switch` | `components/switch.dart` |
| `Slider` | `components/slider.dart` |
| `Input` | `components/input.dart` |
| `Field` | `components/field.dart` |
| `Textarea` | `components/textarea.dart` |
| `InputGroup` | `components/input_group.dart` |
| `SearchField` | `components/search_field.dart` |
| `Select` | `components/select.dart` |
| `Checkbox` / `CheckboxGroup` | `components/checkbox.dart` |
| `Radio` / `RadioGroup` | `components/radio.dart` |
| `Toggle` / `ToggleGroup` | `components/toggle.dart` |
| `SegmentedControl` | `components/segmented.dart` |
| `Badge` | `components/badge.dart` |
| `Label` | `components/label.dart` |
| `Alert` / `InlineAlert` | `components/alert.dart` |
| `ForjaDialog` | `components/dialog.dart` |
| `Sheet` | `components/sheet.dart` |
| `Toast` | `components/toast.dart` |
| `Empty` | `components/empty.dart` |
| `Separator` | `components/separator.dart` |
| `Avatar` | `components/avatar.dart` |
| `Skeleton` / `SkeletonText` / `SkeletonPoster` | `components/skeleton.dart` |
| `Progress` | `components/progress.dart` |
| `Spinner` | `components/spinner.dart` |
| `Tooltip` | `components/tooltip.dart` |
| `Accordion` | `components/accordion.dart` |
| `Breadcrumb` | `components/breadcrumb.dart` |
| `PageDots` | `components/pagination.dart` |
| `ListTile` | `components/list_tile.dart` |
| `Item` | `components/item.dart` |
| `Kbd` | `components/kbd.dart` |
| `Heading` / `Body` | `components/typography.dart` |
| `FocusableTap` | `components/focusable_tap.dart` |
| `PosterFrame` | `components/poster_frame.dart` |
| `ForjaNetworkImage` | `components/network_image.dart` |
| `SettledNetworkImage` | `components/settled_network_image.dart` |
| `MoodCircle` | `components/mood_circle.dart` |

---

## Not mounted — widgets (composers)

Exported from `widgets/widgets.dart` (and siblings). Host uses these; packs only reach them when wrapped by a **mounted** type above.

### Catalog

| Widget | Notes |
|--------|--------|
| `PosterRail` | horizontal posters (also via `kit.row`) |
| `PosterCard` / `InteractivePosterCard` | card paint |
| `EventCard` | sports/event card |
| `CinematicHero` | hero (`hero` type) |
| `ContinueSection` / `ContinueWatchingCard` | continue |
| `BecauseSection` | because |
| `MoodSection` | mood |
| `HomeLoadingSkeleton` | loading |
| `KenBurnsBackdrop` / `RotatingHeroBackdrop` | hero backdrops |
| `CategoryCircleMeta` | category circles |
| `ServerGrid` | server picker grid |
| `CatalogSearchScreen` / `CatalogSearchResultCard` | search UI pieces |
| `CatalogSearchFilters` / `CatalogSearchFilterLens` | search filters |
| `RecentSearchHelperTile` | recent search |

### Details

| Widget | Notes |
|--------|--------|
| `DetailsHero` / `DetailsHeroSurface` | details hero chrome |
| `DetailsBody` / `DetailsScrollPage` | body scroll |
| `DetailsRails` / `DetailsRailSection` | rails under hero |
| `PlayRow` / `DetailsHeroActionRowFit` / `DetailsUpcomingNotice` | play actions |
| `FactsPanel` | facts |
| `MetaLine` / `CertBadge` | metadata line |
| `HeroTitle` / `ChromaticHeroTitleText` | titles |
| `HeroOverviewText` | overview |
| `KitHeroContentScrim` | scrim |
| `HeroWatchProvidersRow` | watch providers |
| `HeroPillPlaySurface` / `HeroPillGroupedSlotSurface` / … | pill CTAs |
| `ListStatusPin` / `ListStatusHero` | list status |
| `DetailsCastSection` | cast |
| `DetailsTrailersSection` | trailers |
| `DetailsRecommendationsSection` | recommendations |
| `TvSeasonEpisodePicker` | seasons/episodes |
| `EpisodeRangeSelector` | episode ranges |
| `WatchProgressBar` / `WatchSeriesProgress` | progress |
| `TmdbPaintGate` | TMDB paint gate |

### Chrome / shell

| Widget | Notes |
|--------|--------|
| `LayoutStack` | stack (`kit.stack`) |
| `LayoutScope` | selection scope (host) |
| `ForjaShellChip` | chip |
| `ShellSectionTitle` / `ShellTabHeader` | section headers |
| `HorizontalScroller` | scroller |
| `LogoMenuRail` | logo + menu rail |
| `SidePanelOverlay` | side panel |
| `PortalListPanel` / `PortalsChip` | portals chrome |
| `SettingsPlayerChrome` | settings player chrome |
| `ShellPaintScope` | paint scope |

### Sources / Live TV / guide

| Widget | Notes |
|--------|--------|
| `SourcesPanelChrome` / `PanelTabs` | sources panel |
| `LiveTvBrowse` | live TV browse |
| `ChannelGuide` / `ChannelGuidePanel` | EPG guide |
| `GuideEpgCard` / `GuideEpgProgramme` | EPG cells |
| `ChannelSearchOverlay` | channel search |
| `PlayerStatsPanel` | player stats |
| `GuideBrowseTextField` | guide text field |

### Feedback / TV / focus

| Widget | Notes |
|--------|--------|
| `LoadingDots` | loading |
| `FrostedPanel` / `FractalGlassGradient` | glass |
| `CardPlayOverlay` | play overlay |
| `ErrorRetryPanel` | error + retry |
| `TvSearchBrowseOverlay` | TV search browse |
| `ListLetterJumpScope` | letter jump |

### Blocks (also used as mounted when typed)

| Block | Mounted type (if any) |
|-------|------------------------|
| `ColumnsHeaderBlock` | `columnsHeader` |
| `TopBodyBlock` | `topBody` |
| `TabsCardsBlock` | `tabsCards` |
| `CatalogBody` | `catalogBody` |
| `CatalogTopChrome` / `CatalogChipBar` / `CatalogCardsGrid` / `CatalogSideRail` | via chrome / list types |
| `CatalogSearchPage` | `search` |
| `SearchBlock` | **not mounted** as its own type |
| `DetailsBlock` / `DetailsScreen` / `DetailsPageBlock` | `details` |
| `MatchDetailsPage` | `matchDetails` |
| `EntryDetails` / `EntryDetailsChrome` | `entryDetails` |
| `ShellBlock` | `shell` |
| `EmptyBlock` | `empty` |
| `EmptyShellFrame` | **not mounted** (host shell frame) |

### Brand

| Widget | Notes |
|--------|--------|
| `ForjaLogo` / `AnimatedLogo` | brand |
| `ForjaProfileAvatar` | profile |

---

## Keeping this in sync

1. New foundation widget → add a row here + `schema/layout-components.schema.json` with `status: "not_mounted"` (or `mounted` if host ships wiring in the same change).
2. Host wires a new pack `type` → flip to `mounted`, document props, add `catalog-kit.js` helper if useful.
3. **Do not** shrink this file to “mounted only.” Pack authors need the full DS inventory to know what exists and what’s missing from the host.

Host implementation: Forja `PackPaintTree` + `forja_foundation`.
