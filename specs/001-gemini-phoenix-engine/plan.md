# Implementation Plan: Gemini Phoenix Engine (The Synthesis)

**Branch**: `001-gemini-phoenix-engine` | **Date**: 2026-01-20 | **Spec**: [specs/001-gemini-phoenix-engine/spec.md]
**Input**: Feature specification from `/specs/001-gemini-phoenix-engine/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create the **Gemini Phoenix Engine**, a Cloud-Native AI Workflow ecosystem. This involves restructuring the project to a unified monorepo, establishing a Semantic Core using **Milvus** (via `mcp-server-milvus`) for vector search, and implementing a Python-based Skill Management CLI (`skills-ref`) alongside the TypeScript Control Plane. The system will support specialized agents and semantic tool selection.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Python 3.11+
**Primary Dependencies**: pnpm, uv, mcp-server-milvus, Typer (Python), Commander (TS), @xenova/transformers
**Storage**: Milvus (Vector Store), Filesystem (Catalog/Config)
**Testing**: Vitest (TypeScript), Pytest (Python)
**Target Platform**: Linux / Cloud-Native (Container-ready)
**Project Type**: Monorepo (pnpm workspaces)
**Performance Goals**: Fast startup (<1s), Low latency embedding & search (<50ms)
**Constraints**: Must run without root privileges (Cloud-Native), Offline capability for embeddings
**Scale/Scope**: Core engine + CLI + Semantic Search + Agent configuration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-First**: Core logic isolated in `package/core` and `package/semantic-core`.
- **CLI Interface**: Both TS (`phoenix`) and Python (`skills-ref`) CLIs required.
- **Semantic-First Architecture**: Adopting **Milvus** ensures a robust, scalable vector solution as mandated by Principle IV.

## Project Structure

### Documentation (this feature)

```text
specs/001-gemini-phoenix-engine/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
package/
├── cli/                # User-facing CLI (Commander)
│   ├── src/
│   │   ├── commands/   # doctor, index, etc.
│   │   └── index.ts
├── core/               # Core logic & Python bridge
│   ├── python/
│   │   ├── skills_ref/ # Python CLI (Typer)
│   │   └── main.py
├── semantic-core/      # Vector search & Embeddings (Milvus Integration)
│   ├── src/
│   │   └── index.ts
├── sdk/                # Shared types & utilities
└── catalog/            # Skill/Command definitions (root or package/catalog?)
    └── index.json
```

**Structure Decision**: Unified `package/` structure. The temporary `gemini-phoenix-engine/` wrapper will be merged into the root `package/` directory.