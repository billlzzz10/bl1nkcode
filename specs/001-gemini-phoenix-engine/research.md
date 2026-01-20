# Research: Gemini Phoenix Engine

## Vector Database: Milvus (via MCP)

### Decision
**Use Milvus** via `mcp-server-milvus`.

### Rationale
1.  **Scalability**: Milvus is a dedicated, high-performance vector database designed for scale, superior to embedded options for complex workloads.
2.  **MCP Integration**: Leveraging the existing `mcp-server-milvus` simplifies integration into the Model Context Protocol ecosystem.
3.  **Constitution Compliance**: Adheres to Principle IV (Semantic-First Architecture).

### Alternatives Considered
*   **LanceDB**: Good for embedded, but replaced by Milvus for robustness and standardization.
*   **Qdrant**: Previously considered, but Milvus chosen for current architecture.
*   **Chroma**: Less mature MCP integration compared to Milvus.

## Python Environment Management: uv

### Decision
**Use `uv`** for Python package and environment management.

### Rationale
*   **Speed**: Significantly faster than pip/virtualenv/poetry.
*   **Simplicity**: unified tool for venv management and package installation.
*   **Integration**: Easy to call from the TypeScript control plane.

## Framework Selection

*   **TS CLI**: `Commander` (Standard, robust).
*   **Python CLI**: `Typer` (Modern, type-safe, easy to build CLIs).
*   **Embeddings**: `@xenova/transformers` (Run local models in JS/Node without Python dependency for the embedding step itself, keeping the "Hot path" in Node).