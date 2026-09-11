# Starters

Pick the pack kind you are building. Each folder is an installable pack — copy it out, rename ids, replace the upstream.

| Folder | Kind | What you get in Forja |
|--------|------|------------------------|
| [`provider/`](provider/) | `http` VOD extractor | Row under **Sources** on movie/TV details |
| [`hub/`](hub/) | `catalog` hub | New **shell tab** with layout / rails / details |

```
starters/
├── README.md          ← you are here
├── provider/          ← stream extract (Sources panel)
└── hub/               ← catalog tab (KitShell)
```

## Which one?

- Scraping / resolving playable URLs → **provider**
- Browse UI (rails, search, details page) → **hub**
- Need both → two packs (or one repo with two manifests). Host keeps browse and extract separate.

Full contract: [`../DEVELOPING.md`](../DEVELOPING.md).

## Install any starter (desktop)

**Settings → Forja Packs** → paste absolute path to that folder’s `manifest.json`.
