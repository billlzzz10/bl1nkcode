# Quickstart: Gemini Phoenix Engine

## Prerequisites
1.  **Node.js v20+**
2.  **pnpm** (`npm i -g pnpm`)
3.  **uv** (`pip install uv`)
4.  **Milvus MCP Server**

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```

3.  **Setup Milvus MCP Server**:
    ```bash
    git clone https://github.com/zilliztech/mcp-server-milvus.git
    cd mcp-server-milvus
    # Follow instructions to start the server (typically python main.py or similar)
    # Ensure it's running and accessible
    ```

## Running the CLI

1.  **Doctor Check**:
    Verify your environment is ready.
    ```bash
    pnpm --filter @phoenix/cli exec phoenix doctor
    ```

2.  **Build Semantic Index**:
    Index the catalog content into Milvus.
    ```bash
    pnpm --filter @phoenix/cli exec phoenix index
    ```

## Development

*   **Build**: `pnpm build`
*   **Watch Mode**: `pnpm dev`