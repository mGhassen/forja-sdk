# Starter Hub (`kind: catalog`)

Catalog **hub**. Install → new **Starter** tab in the shell with hero + rails + search + details.

This is **not** a provider. Hubs browse; providers extract streams. Wire play via `meta.open` (here: `surface: tmdb`) so installed providers fill Sources.

## Files

| File | Role |
|------|------|
| `manifest.json` | Pack + plugin (`kind: catalog`, `nav`, capabilities) |
| `_kit.js` | Copy of SDK [`catalog-kit.js`](../../catalog-kit.js) (`hubOk`, `hubItems`, …) |
| `catalog.js` | `extract(ctx)` — `layout` / `rail` / `search` / `details` |

## Install

```text
/absolute/path/to/forja-sdk/starters/hub/manifest.json
```

**Settings → Forja Packs** → paste that path. Enable the pack → **Starter** tab appears.

## What it demonstrates

| Action | Behavior |
|--------|----------|
| `layout` | Hero + Featured / Movies / Series rails |
| `rail` | Static sample titles (TMDB art URLs) |
| `search` | Filter sample titles by name/genre |
| `details` | Full meta + `open.surface: tmdb` for play |

## Ship

1. Copy this folder out of the SDK repo.
2. Change pack `id`, plugin `id`, `nav.tabId` / `nav.label` (do not publish as `starter-hub`).
3. Replace `CATALOG` in `catalog.js` with your upstream (`ctx.fetch`).
4. Keep `_kit.js` in sync with SDK `catalog-kit.js`, or vendor a slim subset.
5. Optional: add `icons/nav.png` and set `nav.icon`.
6. Host the bundle files, share the manifest URL.

## Related

- [DEVELOPING.md — Catalog hubs](../../DEVELOPING.md#catalog-hub-plugins-kind-catalog)
- [catalog-envelope.schema.json](../../schema/catalog-envelope.schema.json)
- Provider starter (Sources): [`../provider/`](../provider/)
