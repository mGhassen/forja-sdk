# Developing Forja plugins

Community guide for building **EngineJS packs** — JavaScript plugins the Forja app installs, caches, and runs at runtime.

The Flutter app is a **host**. It does not ship your scripts. Users install packs by manifest URL (**Settings → Forja Packs**). This repo is the **SDK** (schemas + kits). Official ForjaHQ example packs live in [forja-packs](https://github.com/mGhassen/forja-packs) — optional reference only; you do not need that repo to ship.

**See also:** [README.md](README.md) · [contract.json](contract.json) · [docs/components.md](docs/components.md) · host RFCs in [Forja](https://github.com/mGhassen/Forja).

---

## SDK contracts

| File | Role |
|------|------|
| [contract.json](contract.json) | Index — schema paths, kit entry points, host parity |
| [docs/components.md](docs/components.md) | **Full** foundation catalog — mounted + not-yet-pack-wired |
| [schema/layout-components.schema.json](schema/layout-components.schema.json) | Machine index (`status`: `mounted` \| `not_mounted`) |
| [schema/manifest.schema.json](schema/manifest.schema.json) | Pack `manifest.json` |
| [schema/catalog-envelope.schema.json](schema/catalog-envelope.schema.json) | Catalog `extract(ctx)` response |
| [schema/vod-stream.schema.json](schema/vod-stream.schema.json) | VOD / hop `extract(ctx)` stream rows |
| [schema/torrent-search.schema.json](schema/torrent-search.schema.json) | Torrent `search(ctx)` result array |
| [catalog-kit.js](catalog-kit.js) | Canonical catalog prelude (`hubOk`, `kitStack`, layout helpers, …) |
| [torrent-kit.js](torrent-kit.js) | Canonical torrent prelude (`row`, `magnetFromHash`, …) |

Host validates manifests at install via `PluginContract.validateManifest` (mirrors `manifest.schema.json`).

Prelude in your pack:

- Prefer a local `_kit.js` that copies or wraps helpers from this repo (`catalog-kit.js` / `torrent-kit.js`).
- Do not depend on a sibling `forja-packs/sdk/` path — that tree no longer exists.

---

## Mental model

```
manifest.json  →  pack metadata + plugin entries
     ↓
entry.js       →  export function extract(ctx) { … }
     ↓
Forja host     →  loads script, calls extract, maps result to UI / player
```

| Pack tree | Plugin `kind` | Role |
|-----------|---------------|------|
| `providers/` | `http` (default) | VOD stream extract — movie / tv / anime / drama |
| `providers/hops/` | `hop` | Follow file-host redirects to a playable URL |
| `live/` | `http` + `live_sport` type | Live Sports schedule + stream resolve |
| `hubs/` | `catalog` | Shell catalog tabs (Home, Anime, …) |
| `iptv/` | `catalog` | Feature packs without shell tabs (IPTV VOD details) |

Hub plugins **browse** catalogs. Provider plugins **extract streams**. The host keeps those layers separate — hub packs never appear in the Sources chip list.

---

## Quick start

### 1. Copy a starter (pick the kind)

| Kind | Folder | What Forja shows |
|------|--------|------------------|
| **Provider** | [`starters/provider/`](starters/provider/) | Sources on movie/TV details |
| **Hub** | [`starters/hub/`](starters/hub/) | New shell tab (layout / rails / details) |

See [`starters/README.md`](starters/README.md).

Or hand-roll:

```
my-pack/
  manifest.json
  entry.js
```

**Provider `manifest.json`**

```json
{
  "schema": 1,
  "id": "my-community-pack",
  "name": "My Community Pack",
  "version": "1.0.0",
  "plugins": [
    {
      "id": "my-vod",
      "name": "My VOD",
      "entry": "extract.js",
      "types": ["movie", "tv"],
      "kind": "http"
    }
  ]
}
```

**Hub plugins** need `kind: "catalog"`, `protocol` / `kit`, `capabilities`, and usually `nav` — copy [`starters/hub/manifest.json`](starters/hub/manifest.json).

### 2. Install locally (desktop)

**Settings → Forja Packs** — paste an absolute path:

```
/absolute/path/to/forja-sdk/starters/hub/manifest.json
```

or

```
/absolute/path/to/forja-sdk/starters/provider/manifest.json
```

`file://` URLs work on desktop dev builds. On mobile, host the manifest over HTTPS (GitHub raw, your CDN, etc.).

### 3. Bump `version` to ship updates

When remote `version` is newer than the cached pack, Forja auto-refreshes on boot or when the user taps **Reload** on that pack.

---

## Pack manifest

Top-level fields:

| Field | Required | Description |
|-------|----------|-------------|
| `schema` | yes | Always `1` today |
| `id` | yes | Stable pack id (e.g. `forjahq-providers`). Used for prefs + collision checks |
| `name` | yes | Display name in Settings |
| `version` | yes | Semver string (`major.minor.patch`) |
| `plugins` | yes | Array of plugin objects |
| `tags` | no | Catalog topic tags for web Community Packs filters (`anime`, `arabic`, `kids`, …). When omitted, the catalog generator derives tags from `nav.tabId` and topic `types` |

Do **not** put `enabled` on the pack or a plugin. On/off is host Settings only (Forja Packs + Features). The host defaults new installs to on; the pack never decides.

Each **plugin** object:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | yes | Module id unique **inside this pack** (enrich / multi-plugin) |
| `name` | yes | Display name |
| `entry` | yes | JS filename relative to manifest directory |
| `kind` | no | `http` (default), `hop`, `catalog`, `host`, `torrent`, `debrid` |
| `types` | no | Domain tags — see [Plugin types](#plugin-types) |
| `config` | no | Opaque JSON merged into `ctx.config` at runtime |
| `prelude` | no | Shared JS file prepended before `entry` (e.g. `_kit.js`) |
| `capabilities` | no | Feature flags (`catalog`, `resolve`, `nav`, `search`, `search_helpers`, …) |
| `nav` | no | Shell tab contribution for `kind: catalog` |
| `enrich` | no | Companion plugin id for post-rail/details enrich |
| `hosts` | no | Hostname suffixes for `kind: hop` |
| `protocol` / `kit` | catalog | Must match host — currently **`1`** / **`1`** |
| `ctxConfigMap` | no | Maps extract ctx keys → config keys at VOD extract time |

Script paths resolve relative to the manifest URL. Install is **transactional**: if any `entry` or `prelude` file fails to fetch, nothing from that install attempt is written.

---

## Plugin types

`types[]` controls where the plugin appears in Settings and which extract context it receives.

| Type | Typical use |
|------|-------------|
| `movie`, `tv` | Movie & TV stream providers |
| `anime` | Anime providers |
| `drama` | Asian drama providers |
| `live_sport` | Live Sports schedule + resolve |
| `catalog` | Legacy live schedule (prefer `live_sport` + capabilities) |
| `iptv` | IPTV feature plugins (no shell tab) |

Use **your own** type tokens for niche packs — the host reads them generically. Do not assume official ids (`kisskh`, `anilist`, …) exist on every user's device.

---

## VOD extract plugins (`kind: http`)

The workhorse. Implement **`extract(ctx)`** returning a **Promise** (or sync array) of stream objects.

### Extract context

The host passes title/episode ids and merged config:

```javascript
// ctx fields (VOD)
ctx.tmdbId      // string
ctx.imdbId      // string
ctx.malId       // number | string (anime)
ctx.anilistId   // number | string (anime)
ctx.type        // 'movie' | 'tv'
ctx.season      // number (tv)
ctx.episode     // number (tv)
ctx.title       // string
ctx.year        // string
ctx.url         // string — direct URL when resolving a hop/link
ctx.config      // manifest config + optional cloud overlay
ctx.fetch(url, opts)  // HTTP — same-origin rules as browser fetch in engine
ctx.chromeFetch(url, opts)  // same shape as fetch, Chrome TLS/JA3 (Dailymotion CDN masters, …)
ctx.hop(url)    // delegate to matching hop plugin
ctx.log(msg) / ctx.error(msg)
ctx.crypto.*    // STREAMCRYPTO decrypt, encode/decode helpers — see official packs
```

Cloud **provider runtime config** can overlay `config` without reinstalling the pack (API hosts, mirror lists, keys).

### Stream objects

Return an array of maps. Empty array = no streams (not an error).

```javascript
{
  url: 'https://cdn.example/playlist.m3u8',  // required
  name: 'Mirror A',           // server label (optional)
  title: '1080p HLS',         // row subtitle (optional)
  quality: '1080p',           // 4K | 1080p | 720p | … (optional)
  language: 'English',        // optional
  audio: 'AAC',               // optional
  headers: {                  // optional — Referer, User-Agent, Origin
    'User-Agent': '…',
    Referer: 'https://embed.example/',
  },
  subtitles: [ … ],           // optional — same shape Stremio uses
}
```

The host HTTP-probes URLs before playback. Prefer stable CDN links and correct Referer/Origin headers.

### Minimal provider

Start from [`starters/provider/`](starters/provider/). Official ForjaHQ resolvers live in [forja-packs/providers](https://github.com/mGhassen/forja-packs/tree/main/providers) (reference only).

---

## Hop plugins (`kind: hop`)

File-host unwrap plugins. Registered by **`hosts`** (hostname suffix match).

```javascript
// manifest
{
  "id": "filemoon-hop",
  "kind": "hop",
  "entry": "hops/filemoon.js",
  "hosts": ["filemoon.sx", "filemoon.to"]
}
```

When a provider calls `ctx.hop(url)`, the host picks the hop plugin whose `hosts` suffix-matches the URL hostname.

Hop `extract(ctx)` receives **`ctx.url`** (the embed page) and returns the same stream array shape as VOD plugins.

---

## Debrid magnet resolve (`kind: debrid`)

Magnet → direct HTTP URL plugins for **Settings → Addons → Debrid**. Implement **`extract(ctx)`** with **`ctx.action === 'resolve'`**.

### Resolve context

```javascript
ctx.action    // 'resolve'
ctx.magnet    // string — magnet URI
ctx.season    // number — TV season when known
ctx.episode   // number — TV episode when known
ctx.config    // manifest config + pack Addon settings (apiKey password field)
ctx.fetch(url, opts)
ctx.host.http.request(opts)
ctx.log(msg) / ctx.error(msg)
```

### Return shape

Return an **array** of one map (host takes the first playable row):

```javascript
{ url: 'https://…/file.mkv', name: 'Title', headers?: { … } }
// or multi-file for host picker:
{ files: [{ name: '…', url: 'https://…', size?: 123 }] }
```

Miss / throw → host fails the magnet resolve (no silent local fallback when a plugin is selected).

Reference: `forja-packs/debrid/`. Schema: [`schema/debrid-resolve.schema.json`](schema/debrid-resolve.schema.json).

---

## Torrent indexers (`kind: torrent`)

Search plugins for **Settings → Torrent** / Sources **Torrents** tab. Implement **`search(ctx)`** (not `extract`).

### Search context

```javascript
ctx.query     // string — title search query
ctx.imdbId    // string — when TMDB/IMDb id known (Torrentio)
ctx.season    // number — TV season (0 when N/A)
ctx.episode   // number — TV episode (0 when N/A)
ctx.config    // manifest config + optional cloud overlay
ctx.fetch(url, opts)
ctx.log(msg) / ctx.error(msg)
```

Use prelude [`torrent-kit.js`](torrent-kit.js) for `row()`, `magnetFromHash`, `fetchJsonMaybeJina`, etc.

### Result rows

Return an array of maps. Schema: [`schema/torrent-row.schema.json`](schema/torrent-row.schema.json).

```javascript
{
  name: 'Title 1080p WEB-DL',
  magnet: 'magnet:?xt=urn:btih:…&dn=…',  // required
  seeders: '42',                            // string
  size: '1.2 GB',                           // string
  source: 'Knaben',                         // display label — from config.source
}
```

Empty array = no hits. Host dedupes by magnet and merges seeders across providers.

Reference: [`torrent/manifest.json`](torrent/manifest.json), [`torrent/knaben.js`](torrent/knaben.js).

---

## Live sport plugins

Live Sports plugins use **`types: ["live_sport"]`** and declare capabilities:

| Capability | Role |
|------------|------|
| `catalog` | Schedule feed for Live Sports grids |
| `resolve` | Turn a match source ref into playable streams |

The host calls the same **`extract(ctx)`** entry with **`ctx.action`**:

| `ctx.action` | Purpose |
|--------------|---------|
| `catalog` | Return schedule rows |
| `resolve` | Return streams for `ctx.source`, `ctx.matchId`, `ctx.stream`, `ctx.embedUrl`, … |

Optional manifest fields for unified live sport plugins:

| Field | Role |
|-------|------|
| `defaultCapabilities` | First-run Settings on/off per capability (`catalog`, `resolve`) — omit or `false` to opt in |
| `legacyIds` | Retired `catalog-*` / `live-*` ids for one-time host migration |

Use a shared **`prelude`** for embed unlock helpers (see [`live/embed-st.js`](live/embed-st.js)).

**Live-only ctx helpers:**

```javascript
ctx.live.goatUnlock(bodyHex, goat, slot)
ctx.live.gasmUnlock(bodyHex, island, slot)
ctx.live.sportsEmbedUnlock(embedUrl)
ctx.live.sniffEmbed(url, referer)   // desktop/mobile only — skipped on Android TV
```

The host runs these as a **WASM unlock runtime** (desktop Node + happy-dom, or mobile/ATV off-screen WebView). Crack scripts and `.wasm` files ship in the **live pack** under `goat/`, `gasm/`, and `sportsembed/` (listed in `bundle`) — update the pack to refresh unlock glue without an app rebuild. Flutter assets remain a fallback if the pack module is missing.

Reference: [`live/streamed.js`](live/streamed.js), [`live/manifest.json`](live/manifest.json), [`live/goat/`](live/goat/).

---

## Catalog hub plugins (`kind: catalog`)

Shell tabs (Home, Anime, custom hubs) and feature catalogs (IPTV VOD) speak the **catalog hub protocol v1**.

### Entry point

Same **`extract(ctx)`** function — the host sets **`ctx.action`**:

| Action | `ctx.params` | Response `data` |
|--------|--------------|-----------------|
| `layout` | `page` | `pages.{page}.widgets[]` |
| `rail` | `rail`, `filter`, `sort`, `page`, `limit`, `cursor` | `items[]`, optional paging |
| `feed` | paging + filter | infinite scroll items |
| `search` | `query`, `page`, `limit`, `filter` | `items[]` |
| `details` | `id` | `meta` (+ optional `rails`) |
| `filters` | — | `fields[]` filter schema |
| `enrich` | `items` or `meta` | enriched payload (companion plugin) |

Use [`catalog-kit.js`](catalog-kit.js) helpers (`hubOk`, `hubFail`, `hubItems`, `hubAction`, …) — the hub starter vendors it as [`starters/hub/_kit.js`](starters/hub/_kit.js).

### Response envelope

Both engine backends require a **one-element array**:

```json
[{
  "ok": true,
  "kit": 1,
  "protocol": 1,
  "action": "rail",
  "cache": { "etag": "my-rail-1", "maxAge": 600, "swr": 3600 },
  "data": { "items": [ … ] }
}]
```

Errors:

```json
[{
  "ok": false,
  "kit": 1,
  "protocol": 1,
  "action": "details",
  "error": { "code": "UPSTREAM", "message": "HTTP 503", "retryable": true }
}]
```

Error codes: `INVALID_ACTION`, `INVALID_PARAMS`, `NOT_FOUND`, `AUTH_REQUIRED`, `AUTH_EXPIRED`, `RATE_LIMIT`, `UPSTREAM`, `PARSE`, `UNSUPPORTED_KIT`, `CANCELLED`.

If `kit` > host kit version (`1` today), the shell shows **unsupported kit** — bump your plugin, not the host.

Fixtures: [`fixtures/anilist_rail.json`](fixtures/anilist_rail.json). Working hub: [`starters/hub/`](starters/hub/).

### Catalog meta items

Each browse card / details meta:

```javascript
{
  id: 'myhub:123',
  type: 'anime',              // opaque content type token
  name: 'Title',
  poster: 'https://…',
  background: 'https://…',
  description: '…',
  rating: 8.5,
  releaseInfo: '2024',
  premiereDate: '2026-06-14',   // ISO — upcoming / first-air (details hero)
  status: 'NOT_YET_RELEASED',   // optional — host shows Coming soon
  genres: ['Action'],
  ids: { tmdb: '123', anilist: '456' },  // opaque upstream ids
  open: {                     // required for openable items
    surface: 'anime',         // host route: anime | drama | tmdb | arabic | …
    id: '456',                // opaque id for that route
    extract: {                // optional — passed to provider extract
      resolveType: 'anime',
      panelCategory: 'anime',
      ctx: { anilistId: 456, malId: 123 }
    }
  },
  videos: [ … ]               // episodes on details — opaque ids for play
}
```

`videos[]` episode rows may include **`airDate`** (`YYYY-MM-DD`) and **`aired: false`** when the episode is scheduled but not playable. The host episode picker shows the date in orange and blocks Play until aired.

The host routes on **`open.surface`** only — not on your plugin id or scraper name.

### Shell navigation

Add a shell tab with **`nav`** on a catalog plugin:

```json
"nav": {
  "label": "My Hub",
  "icon": "icons/nav.png",
  "accent": "#FB7185"
}
```

Do **not** set `tabId` or Features/navbar order — the host owns chrome ids from the install URL and appends new hub tabs at the end. `nav.tabId` / `nav.order` are legacy optional only.

When a hub pack contributes nav, the host turns that Feature **on** automatically. Users can still hide it under Settings → Features.

Prefer a **pack-relative** icon (`icons/nav.png`). Omit `icon` for the Material default. Never Flutter `assets/` or `forja://asset` URIs.

### Capabilities

| Capability | Host behavior |
|------------|---------------|
| `nav` | Contributes shell tab (with `nav` block) |
| `layout`, `rail`, `feed` | Browse widgets |
| `search` | Top-bar Search → pack search action |
| `search_helpers` | Left-column idle/contextual title suggestions (`action: search_helpers`) |
| `host_search` | Opens shared Cmd+F search overlay |
| `filters` | Merges chrome filters into search/rail params |
| `structured_search` | Advanced filter lens (TMDB-style) |
| `details` | Title details page |
| `enrich` | Companion-only — piped after rail/details |

### Enrich companions

Keep source JS data-only; declare a second plugin for TMDB match, extra images, etc.:

```json
{ "id": "my-hub", "entry": "hub.js", "enrich": "my-hub-enrich-tmdb" },
{ "id": "my-hub-enrich-tmdb", "entry": "enrich_tmdb.js", "capabilities": ["enrich"] }
```

The host runs `action: enrich` after `rail` / `details` and caches the merged result.

### Layout (one foundation catalog)

**Full foundation catalog (mounted + not mounted):** [docs/components.md](docs/components.md) · [schema/layout-components.schema.json](schema/layout-components.schema.json).

Only **`status: mounted`** types work in pack JSON today. Everything else in that file is real DS surface the host has not wired yet — do not emit those as `type` expecting paint.

**Everything is a component.** The host has one mount table: pack JSON `{ type, props?, children?, load? }` → foundation widget. There is no “atoms vs blocks” API — prepared pages and small chrome pieces are the same catalog.

**Compose with `kit.stack`:** put any component in `children[]` — `kit.topBar`, `kit.list`, `hero`, `columnsHeader`, …

| Type | Role | Key fields |
|------|------|------------|
| `kit.stack` | Composer (usually vertical column) | `children[]`, `expand: true` (last child fills viewport), optional `axis: 'horizontal'` |
| `kit.menu` | Filter chips | `items[]` (`id`, `label`), `toggle`, focus edges |
| `kit.tabs` | Status / segment strip | `tabs[]`, `default`, focus edges |
| `kit.list` | Scroll grid/list of paint items | `style`, `kindMenu`, `statusTab`, optional opaque `source`; use `hubWithLoad` for feed |
| `kit.topBar` | Top action chrome | `actions[]` |
| `kit.categoryBar` | Kind / category strip or rail | `items[]`, `orientation: 'vertical'` for side rail |
| `kit.row` | Horizontal poster rail | same as legacy `rail` / `ranked` |
| `hero` / `mood` / `continue` / `because` | Home-style sections | pack `load` + paint props; host injects store callbacks only |
| `columnsHeader` | Optional prepared page (top + side + body) | `children` or props — shortcut, not required |
| `topBody` | Optional prepared page (top + kinds + grid) | same |
| `tabsCards` | Optional prepared page (menu + tabs + cards) | same |
| `catalogBody` / `search` / `details` / `shell` / `empty` | Other prepared surfaces | serializable `props` |

Legacy aliases still work: `stack` → `kit.stack`, `tabs` + `style: 'kind'` → `kit.menu`, `rail` / `ranked` → `kit.row`.

Helpers in [`catalog-kit.js`](catalog-kit.js) (copy into hub `_kit.js`):

```javascript
// Usual pattern — stack of components
kitStack('page', { expand: true }, [
  kitTopBar('chrome', { actions: […] }),
  kitCategoryBar('cats', { items: […], default: 'all' }),
  hubWithLoad(kitList('items', { style: 'grid', kindMenu: 'cats' }), 'feed', {}),
]);

// Or one prepared page as a single child / root
kitColumnsHeader('page', { expand: true }, [
  kitTopBar('chrome', { actions: […] }),
  kitCategoryBar('cats', { orientation: 'vertical', items: […] }),
  hubWithLoad(kitList('items', { style: 'grid', kindMenu: 'cats' }), 'feed', {}),
]);

// Any foundation type without a named helper
kitNode('details', 'title', { props: { title: '…', backdropUrl: '…' } });
```

Packs declare structure + serializable props only — **no Dart, no callbacks in JSON**. Host injects `onSelect` / open / resume. Cards use `hubPaintPoster` / `hubPaintEvent` on feed rows.

D-pad **←/→ inside a row** (chips, posters) is host-owned. **`focusLeft` / `focusRight`** fire only at the row edge (first / last item), or from a selected `kit.list` row when a side panel is open — same named-row jump as `focusUp` / `focusDown`. Intra-row arrows stay index ± 1. OK / Back stay host (`open` / overlay pop).

**Page focus map** (optional on `pages.<tabId>`): pack tells nav land / Back ladder; host executes named rows only.

```javascript
pages: {
  iptv: {
    focus: {
      enter: 'cats',              // OK from shell nav
      restore: 'cats',            // → from shell nav (preferCustom)
      restoreMode: 'remembered',  // or 'first'
      pageBack: ['items', 'cats'], // Back: leaf → outer → shell nav
    },
    widgets: [ /* … */ ],
  },
}
```

Widget-level `focusUp` / `focusDown` / `focusLeft` / `focusRight` still name edge jumps between registered row ids.

### Host helpers (catalog)

```javascript
ctx.host.tmdb.match({ title: 'One Piece', year: 1999, type: 'tv' })
// → { id, mediaType, poster, backdrop, overview, rating } | null
```

TMDB API key is injected by the host when the app is built with `TMDB_API_KEY` — do not hardcode keys in published packs.

Reference hubs: [`hubs/home/tmdb.js`](hubs/home/tmdb.js), [`hubs/anime/anilist.js`](hubs/anime/anilist.js), [`hubs/asian_drama/kisskh.js`](hubs/asian_drama/kisskh.js).

---

## Publishing

1. Host `manifest.json` + every `entry` / `prelude` file on HTTPS (same directory tree). GitHub raw works for public packs.
2. List those paths in manifest **`bundle`** (array of relative paths) so install knows what to download.
3. Give users the **manifest URL** to install.
4. Pack top-level `id` is **required** and stable across rehosts (e.g. `my-community-pack`). Host prefs key off it.
5. Plugin `id` must be unique **inside your pack** only. Semver `version` per release.

Signed manifests / sha256 verification are **not** implemented yet — distribute from sources you trust.

---

## Local development tips

| Task | How |
|------|-----|
| Edit official pack | Point Forja at local manifest path; **Reload** pack after JS changes |
| Test one provider | **Settings → Sources → Forja** — enable only your plugin; use **Sources → Forja** panel on a title |
| Test hub | Install hub manifest; open the tab; watch DevTools/logcat for `[catalog]` / plugin console lines |
| Engine smoke | `cd apps/forja && flutter test test/engine_test.dart` (uses `--assets=` pack path) |
| Catalog protocol | `flutter test test/catalog_protocol_test.dart` |

Run desktop with `--dart-define-from-file=../../.env` so hub TMDB match works.

---

## Platform notes

| Topic | Behavior |
|-------|----------|
| **Android TV** | WebView sniff paths are skipped (`ctx.live.sniffEmbed`, some legacy embed providers). Prefer pure HTTP/API extract in JS |
| **Parallel extract** | Sources **All** runs up to 10 plugins at once (5 on TV) |
| **Timeouts** | VOD ~30s, catalog/live ~45s per call |
| **Hop chain** | Avoid infinite `ctx.hop` loops — host has no cycle detection |

---

## Checklist before sharing a pack

- [ ] Pack top-level `id` set and stable; plugin `id`s unique **inside** this pack only
- [ ] Every `entry` / `prelude` path resolves from the manifest URL
- [ ] `version` bumped
- [ ] VOD plugins return `[]` on miss, not throw (throws become `[]` after log)
- [ ] Catalog plugins return `[envelope]` with matching `kit` / `protocol`
- [ ] Openable hub metas include valid `open.surface` + `open.id`
- [ ] Stream URLs include headers CDN expects
- [ ] Tested install + **Reload** + **Remove** from Settings

---

## Official reference packs

Starters in this repo:

| Kind | Path |
|------|------|
| Provider (Sources) | [`starters/provider/`](starters/provider/) |
| Hub (shell tab) | [`starters/hub/`](starters/hub/) |

ForjaHQ inventory (examples only — not required to ship):

| Pack | Manifest |
|------|----------|
| Providers | [forja-packs/providers](https://github.com/mGhassen/forja-packs/tree/main/providers) |
| Live Sports | [forja-packs/livesports](https://github.com/mGhassen/forja-packs/tree/main/livesports) |
| Home hub | [forja-packs/hubs/home](https://github.com/mGhassen/forja-packs/tree/main/hubs/home) |
| Anime hub | [forja-packs/hubs/anime](https://github.com/mGhassen/forja-packs/tree/main/hubs/anime) |
| Asian Drama | [forja-packs/hubs/asian_drama](https://github.com/mGhassen/forja-packs/tree/main/hubs/asian_drama) |
| IPTV VOD | [forja-packs/iptv/vod](https://github.com/mGhassen/forja-packs/tree/main/iptv/vod) |

Host RFCs live in the [Forja](https://github.com/mGhassen/Forja) repo under `docs/rfc/`.
