# forja-sdk

**EngineJS contracts** for [Forja](https://github.com/mGhassen/Forja) plugin authors.

This is the public SDK. Schemas, catalog/torrent kits, starters, and the authoring guide live here — not in the host app and not inside any pack inventory.

| | |
|--|--|
| **Guide** | [`DEVELOPING.md`](DEVELOPING.md) |
| **Contract index** | [`contract.json`](contract.json) |
| **Starters** | [`starters/`](starters/) — **provider** (Sources) + **hub** (shell tab) |
| **Host** | [mGhassen/Forja](https://github.com/mGhassen/Forja) |
| **Official packs (examples)** | [mGhassen/forja-packs](https://github.com/mGhassen/forja-packs) |

## Layout

```
forja-sdk/
├── DEVELOPING.md
├── contract.json
├── catalog-kit.js / torrent-kit.js
├── schema/ · fixtures/
└── starters/
    ├── README.md      which kind to pick
    ├── provider/      VOD extract → Sources panel
    └── hub/           catalog tab → layout / rail / details
```

## Starters

| Pack | Install path | Shows up as |
|------|--------------|-------------|
| [Provider](starters/provider/) | `…/starters/provider/manifest.json` | **Sources** row on movie/TV |
| [Hub](starters/hub/) | `…/starters/hub/manifest.json` | **Starter** shell tab |

Paste the absolute `manifest.json` path in **Settings → Forja Packs**. Details: [`starters/README.md`](starters/README.md).

## Use in a pack

1. Read [`DEVELOPING.md`](DEVELOPING.md).
2. Copy [`starters/provider/`](starters/provider/) or [`starters/hub/`](starters/hub/).
3. Keep `manifest.json` aligned with [`schema/manifest.schema.json`](schema/manifest.schema.json).
4. Host a `manifest.json` URL — users install it in **Settings → Forja Packs**.

You do **not** need the forja-packs repo to ship a community pack. That repo is ForjaHQ’s inventory only.

## License

See [LICENSE](LICENSE) if present; otherwise same terms as Forja unless noted.
