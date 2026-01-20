# Gemini Phoenix Engine Spec

## Clarifications

### Session 2026-01-20
- Q: How does a user interact with the 'Specialized Agents'? → A: **Interactive CLI Chat Mode** (User runs `phoenix chat` and enters a conversational loop).
- Q: How are 'Skills' defined by the user? → A: **External Python Packages**. Skills are independent packages (not embedded in core) managed by `uv`, which the Core/CLI invokes as plugins.
- Q: How are skills executed safely? → A: **Host Process (Primary)** via `uv run`, with **Docker as an optional supplement** for isolated execution.
- Q: How does the Semantic Optimizer handle tools? → A: **Reorder/Prioritize (Augmentation)**. Relevant tools are moved to the top of the context; others remain as fallbacks. This optimizes token usage/focus without losing versatility.

## Functional Requirements

### User Interface
- **Chat Mode**: The system MUST provide an interactive CLI command (`phoenix chat [agent_name]`) that initiates a stateful conversation loop with the specified agent.
- **Command Discovery**: Users MUST be able to list available skills and agents via `phoenix list` or `phoenix plugins`.

### Plugin Architecture
- **Skill Structure**: Each Skill MUST be structured as a standalone Python package (with `pyproject.toml`).
- **Decoupling**: Skills MUST NOT be hardcoded into the `@phoenix/core` package; they are loaded dynamically or referenced via the Catalog.
- **Management**: The system uses `uv` to manage the environment and dependencies for each skill package independently.

### Execution & Security
- **Execution Mode**: The default execution MUST happen on the host using `uv`.
- **Optional Sandboxing**: The system SHOULD allow users to configure a Docker-based runner for specific skills or environments.
- **Security Sentinel**: The `BeforeTool` hook MUST scan tool arguments and require user confirmation for high-risk actions unless the server is trusted.

### Semantic Intelligence
- **Indexing**: The system MUST provide a `phoenix index` command to traverse the Catalog and ingest skill descriptions into the Vector Store.
- **Optimization Hook**: The `BeforeToolSelection` hook MUST query the Semantic Core for relevant tools based on the user's prompt.
- **Dynamic Context**: The hook MUST return a prioritized list of tools (via `allowedFunctionNames` or reordered definition) to the model, placing the most semantically relevant tools first. Fallback tools MUST remain accessible.

## Non-Functional Requirements

- **Performance**: CLI startup time MUST be < 1 second.
- **Latency**: Semantic embedding and retrieval MUST complete in < 50ms (p95).
- **Offline Capability**: The system MUST function without internet access for local skill execution (after initial installation).
- **Privilege**: The engine MUST function without root privileges (Cloud-Native constraint).

## Domain Model

### Semantic Index (Milvus)
| Field | Type | Description |
|-------|------|-------------|
| `id` | VarChar (PK) | Unique identifier (`plugin:name:command`). |
| `vector` | FloatVector(768) | Embedding vector (`nomic-embed-text-v1.5`). |
| `text` | VarChar | Searchable text content. |
| `type` | VarChar | Category: `command`, `skill`, `documentation`. |
| `source` | VarChar | Origin: `catalog`, `user-docs`. |
| `payload` | JSON | Full definition/reference data. |

### Catalog Schema
- **Structure**: `catalog/index.json` acts as the source of truth.
- **Plugins**: List of available capabilities with versioning and command definitions.
