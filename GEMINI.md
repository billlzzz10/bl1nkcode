# Gemini Phoenix Engine

This document provides a summary of the Gemini Phoenix Engine project based on an analysis of the codebase.

## Project Overview

This project is a TypeScript monorepo that uses pnpm workspaces. It's named "Gemini Phoenix Engine" and is designed as a comprehensive toolkit for AI-driven development workflows within the Gemini CLI.

The architecture is described as a "TS-Centric Polyglot Architecture," with a TypeScript Control Plane for real-time interactions and a Python "Powerhouse" for heavy lifting. However, the Python component's files appear to be missing from the repository.

The monorepo contains several packages, with the main ones being:

*   `package/cli`: A user-facing CLI tool named `phoenix`.
*   `package/core`: The core logic, which includes a web server, sandboxing capabilities, and more.

## Building and Running

The following commands are available in the root `package.json` to manage the project:

*   **Installation:**
    ```bash
    pnpm install
    ```
*   **Development:**
    ```bash
    pnpm dev
    ```
*   **Build:**
    ```bash
    pnpm build
    ```
*   **Linting:**
    ```bash
    pnpm lint
    ```
*   **Testing:**
    ```bash
    pnpm test
    ```

## Development Conventions

*   The project uses **ESLint** for linting (see `.eslintrc.json`).
*   **Prettier** is used for code formatting.
*   The project follows a monorepo structure using **pnpm workspaces**.

## Inconsistencies and Missing Components

During the analysis, several inconsistencies were identified:

*   **Directory Structure:** The `pnpm-workspace.yaml` and `README.md` refer to a `packages/` directory, but the actual workspace packages are located in the `package/` directory.
*   **Missing Python Component:** The documentation and root `package.json` refer to a Python component, but the corresponding files (e.g., `package/core/python/requirements.txt`) were not found.
*   **Missing Packages:** The `README.md` mentions several other packages (`sdk`, `browser-extension`, `vscode-extension`, `web`) that are not present in the `package/` directory.

These inconsistencies suggest that the project might be in a state of refactoring or that some components are not included in the repository.

## Active Technologies
- TypeScript (Node.js 20+), Python 3.11+ + pnpm, uv, LanceDB, Typer (Python), Commander (TS), @xenova/transformers (001-gemini-phoenix-engine)
- LanceDB (Vector Store), Filesystem (Catalog/Config) (001-gemini-phoenix-engine)
- TypeScript (Node.js 20+), Python 3.11+ + pnpm, uv, mcp-server-milvus, Typer (Python), Commander (TS), @xenova/transformers (001-gemini-phoenix-engine)
- Milvus (Vector Store), Filesystem (Catalog/Config) (001-gemini-phoenix-engine)

## Recent Changes
- 001-gemini-phoenix-engine: Added TypeScript (Node.js 20+), Python 3.11+ + pnpm, uv, LanceDB, Typer (Python), Commander (TS), @xenova/transformers
