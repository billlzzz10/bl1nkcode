# Contract: TS CLI <-> Python Interface

## Overview
The TypeScript Control Plane invokes the Python layer via `uv run` to perform heavy validation and schema management.

## Invocation Pattern

```bash
uv run python -m packages.core.python.skills_ref.main [COMMAND] [ARGS]
```

## Commands

### `validate-all`

**Input**: None (Reads `catalog/index.json` from disk).
**Output (Stdout)**:
- Success: `✅ ...`
- Failure: `Error: ...` (Exit code 1)

### `generate-index`

**Input**: None (Reads `catalog/index.json`).
**Output**:
- Writes: `.cache/catalog.json`
- Stdout: Success message or Error.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PHOENIX_CATALOG_PATH` | Override path to the catalog root (optional). |
| `PHOENIX_CACHE_DIR` | Override path to the cache directory (optional). |
