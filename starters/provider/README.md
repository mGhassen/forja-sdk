# Starter Provider (`kind: http`)

VOD **stream extractor**. Install → open any movie/TV → **Sources** shows **Starter VOD**.

This is **not** a hub. No shell tab. Providers only resolve play URLs.

## Files

| File | Role |
|------|------|
| `manifest.json` | Pack + plugin (`kind: http`, `types: movie/tv`) |
| `extract.js` | `extract(ctx)` → stream rows |

## Install

```text
/absolute/path/to/forja-sdk/starters/provider/manifest.json
```

**Settings → Forja Packs** → paste that path.

## Ship

1. Copy this folder out of the SDK repo.
2. Change pack `id` / `name` / plugin `id` (do not publish as `starter-provider`).
3. Set `config.apiBase` / `config.origin` for your site.
4. Rewrite `extract.js` — uncomment the `ctx.fetch` path, implement `mapStreams`.
5. Host `manifest.json` + `extract.js`, share the manifest URL.

## Related

- [DEVELOPING.md — VOD extract](../../DEVELOPING.md#vod-extract-plugins-kind-http)
- [vod-stream.schema.json](../../schema/vod-stream.schema.json)
- Hub starter (browse tab): [`../hub/`](../hub/)
