<!--
Sync Impact Report:
- Version change: Template → 1.0.0
- Added Principles:
  - I. Library-First (derived from context)
  - II. CLI Interface (derived from context)
  - III. Test-First (derived from context)
  - IV. Semantic-First Architecture (Added to enforce Milvus adoption)
- Templates requiring updates:
  - ⚠ specs/001-gemini-phoenix-engine/plan.md (Needs to switch LanceDB → Milvus)
  - ⚠ specs/001-gemini-phoenix-engine/tasks.md (Needs to switch LanceDB → Milvus)
  - ⚠ specs/001-gemini-phoenix-engine/research.md (Needs to reflect Milvus decision)
  - ⚠ specs/001-gemini-phoenix-engine/data-model.md (Needs schema update for Milvus)
-->

# Gemini Phoenix Engine Constitution

## Core Principles

### I. Library-First
**Core logic must be isolated in reusable packages, not tightly coupled to the CLI.**
*   **Rule**: Business logic lives in `packages/core`, `packages/semantic-core`, etc. The CLI (`packages/cli`) is merely a consumer/interface layer.
*   **Rationale**: Ensures logic can be reused by other interfaces (VS Code, Web, Agents) without refactoring.

### II. CLI Interface
**All primary capabilities must be exposed via the `phoenix` CLI.**
*   **Rule**: Every feature (indexing, doctor, skill management) must have a corresponding CLI command.
*   **Protocol**: Commands must support text output for humans and JSON output (`--json`) for machine composition.

### III. Test-First (NON-NEGOTIABLE)
**No feature is complete without verification.**
*   **Rule**: `phoenix doctor` must validate the environment. New features must pass their specific test criteria (e.g., `phoenix index` must succeed before search is considered done).
*   **Rationale**: Prevents regression in a complex monorepo environment.

### IV. Semantic-First Architecture
**The engine relies on vector embeddings for intelligent retrieval.**
*   **Rule**: Use **Milvus** (via `mcp-server-milvus`) as the exclusive vector store backend.
*   **Constraint**: Do not use LanceDB, Qdrant, or other vector stores unless explicitly amended.
*   **Rationale**: Standardizing on Milvus provides a robust, scalable cloud-native vector solution compatible with the MCP ecosystem.

## Governance

**Amendments**:
*   Changes to these principles require a PR with the label `constitution-amendment`.
*   The `CONSTITUTION_VERSION` must be incremented.

**Versioning Policy**:
*   Follow Semantic Versioning (MAJOR.MINOR.PATCH).

**Compliance**:
*   All architectural decisions in `plan.md` must cite the relevant Constitution Principle.
*   `phoenix doctor` serves as the runtime compliance checker.

**Version**: 1.0.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-01-20