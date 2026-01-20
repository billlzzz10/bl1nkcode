# 🔥 Gemini Phoenix Engine

**Gemini Phoenix Engine** is a comprehensive toolkit for AI-driven development workflows, featuring a "TS-Centric Polyglot Architecture" (TypeScript + Python) and a Cloud-Native Semantic Core powered by **Milvus**.

## 🚀 Key Features

*   **Polyglot Core**: TypeScript Control Plane (`package/cli`, `package/core`) + Python Powerhouse (`package/core/python`).
*   **Semantic Search**: Vector indexing and retrieval using **Milvus** via MCP.
*   **Catalog-Driven**: Capabilities defined in `catalog/index.json` and loaded dynamically.
*   **Specialized Agents**: Persona-based agent configuration (`agent-personas/`).
*   **Security First**: `BeforeTool` hooks for secret scanning and semantic tool optimization.

## 🛠️ Installation

1.  **Prerequisites**:
    *   Node.js v20+
    *   pnpm
    *   uv (Python tool)
    *   Milvus (Running via MCP or Docker)

2.  **Setup**:
    ```bash
    pnpm install
    # This automatically runs 'uv pip install' for Python dependencies
    ```

## 🎮 Usage

### CLI Commands

*   **Check Health**:
    ```bash
    node package/cli/dist/index.js doctor
    ```

*   **Index Capabilities**:
    ```bash
    node package/cli/dist/index.js index
    ```

*   **Manage Skills (Python)**:
    ```bash
    python -m package.core.python.skills_ref.main validate-all
    ```

## 🏗️ Architecture

*   `package/cli`: The `phoenix` CLI entry point.
*   `package/core`: Core business logic, hooks, and Python bridge.
*   `package/semantic-core`: Vector database integration (Milvus).
*   `package/sdk`: Shared types.
*   `catalog/`: Source of truth for plugins and skills.

## 🤝 Contributing

This project uses `pnpm workspaces`.
*   Build: `pnpm build`
*   Test: `pnpm test`
