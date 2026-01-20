# ✍️ Phoenix Engine: Code & Style Guide

This document outlines the strict coding standards, architectural principles, and development philosophy for the Phoenix Engine project. Adherence to these rules is mandatory to ensure quality, consistency, and maintainability.

### **Core Architectural Principles**

1.  **The Catalog is the Single Source of Truth:** All new capabilities MUST be representable within the `catalog/index.json`. Do not build features that bypass the catalog.
2.  **Clear Separation of Concerns (TS vs. Python):**
    -   **TypeScript (`core`, `cli`, etc.):** Is for **Orchestration**. It handles user interaction, I/O, network requests, and calling other tools. It should remain lightweight and fast.
    -   **Python (`skills-ref`):** Is for **Computation & Validation**. It handles heavy logic, file parsing (`strictyaml`), complex validation, and data processing.
    -   **Communication:** The TS layer MUST communicate with the Python layer via shell commands (`uv run ...`), treating it as a separate, versioned service.
3.  **Security is Not Optional (The Sentinel Mandate):** All code that modifies the user's system or handles user data MUST pass through a security check. The `BeforeTool` Security Sentinel is our first line of defense and must be respected.
4.  **Creation Requires Validation (The Sandbox Mandate):** No new executable skill or command can be created without first being tested in a sandboxed environment (`isolated-vm`) and passing a validation pipeline. There are no shortcuts.

### **TypeScript Style Guide**

-   **Strict Mode:** All `tsconfig.json` files MUST have `"strict": true`. No exceptions.
-   **ESM First:** The entire codebase is `type: "module"`. Use `import/export` syntax exclusively. Avoid `require()`.
-   **Dependency Management:** Use `pnpm`. Avoid global installations. All dependencies must be explicitly listed in the correct `package.json`.
-   **Linting & Formatting:** `ESLint` and `Prettier` are enforced. All code must be formatted before commit. Use the provided root `lint` and `format` scripts.
-   **Error Handling:** Use explicit `try...catch` blocks for I/O and network operations. Do not let promises go unhandled.
-   **Logging:** Use a structured logger (to be defined in `packages/sdk`), not `console.log`, for application logic. `console.log` is only for printing final output to the user in the CLI.

### **Python Style Guide**

-   **Package Management:** All dependencies MUST be managed via `pyproject.toml` and locked with `uv pip compile`. We use `uv` for speed and isolated environments.
-   **CLI Framework:** Use `Typer` for creating all user-facing Python CLIs. It provides type-safety and automatic documentation.
-   **Type Hinting:** All functions MUST have full type hints. We run `mypy` or a similar type checker as part of CI.
-   **Formatting:** Use `ruff format` (or `black`) and `ruff check` for linting.

### **A Note on Past Mistakes (The "Never Again" List)**

This project was born from learning. We explicitly forbid repeating the following mistakes:

1.  **Ignoring Dependency Versions:** Never assume a dependency version. Always refer to the specified source of truth. A `^1.25.2` is not the same as `^0.1.0`.
2.  **Assuming a Single Language:** Do not assume the entire world is JavaScript. Be prepared to integrate with other languages (like Python) and respect their ecosystems.
3.  **Building Features Without an Entrypoint:** If you build a "creator" module, there MUST be a user-facing command (`phoenix skills new`) to actually use it.
4.  **Overlooking the "Index":** Do not invent your own data structures when a comprehensive, real-world example (like the plugin `index.json`) has been provided. Architect around the truth.