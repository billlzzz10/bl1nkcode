# 📦 Phoenix Engine: Product Suite

The Gemini Phoenix Engine is not a single application but a suite of interconnected products, each serving a distinct purpose within the ecosystem.

### 1. **Core Engine (`packages/core`)**

This is the non-user-facing heart of the entire system. It runs as a background process or is invoked by other components.

-   **Responsibilities:**
    -   **Installer Engine:** Parses the `catalog/index.json` and handles the installation/uninstallation of plugins.
    -   **Hook Manager:** Implements the logic for `BeforeTool`, `BeforeModel`, and `AfterTool` hooks (Security Sentinel, Context Optimizer, Usage Logger).
    -   **Authentication Service:** Manages OAuth 2.0 flows and secure token storage (`keytar`).
    -   **Server Backend:** Runs an Express server to provide an API for the Web UI and a WebSocket server for real-time communication.
    -   **Python Bridge:** Contains the logic to execute the Python (`skills-ref`) CLI using `uv run` for validation and searching.

### 2. **Phoenix CLI (`packages/cli`)**

This is the primary user-facing command-line interface for managing the engine. It's the "control panel" for the user.

-   **Features:**
    -   `phoenix plugins list|search|install|uninstall`: Manages the lifecycle of plugins from the catalog.
    -   `phoenix skills new|validate`: An interactive workflow for creating and validating new skills, which utilizes the Sandbox and Python Validator.
    -   `phoenix doctor`: A diagnostic tool to check if all dependencies (Node, pnpm, uv, Python) are installed correctly.
    -   `phoenix config get|set`: Manages engine configuration.

### 3. **VS Code Extension (`packages/vscode-extension`)**

Brings the power of the Phoenix Engine directly into the developer's editor, providing a rich, integrated experience.

-   **Features:**
    -   **Sidebar View:** Displays a tree view of all available and installed plugins from the catalog.
    -   **Command Palette Integration:** Allows users to run `phoenix` CLI commands (e.g., "Phoenix: Install Plugin") directly from the VS Code command palette.
    -   **Skill/Command Autocompletion:** Provides autocompletion for installed custom commands (`/git:commit`) within the editor.
    -   **Inline Diagnostics:** Shows warnings or errors from the Security Sentinel hook directly in the code editor.

### 4. **Browser Extension (`packages/browser-extension`)**

The "Web Clipper" that acts as a bridge between the web and the Gemini CLI context.

-   **Features:**
    -   **Content Clipping:** Captures selected text, page content, or URLs.
    -   **Send to Context:** Uses Native Messaging to communicate with the Core Engine, creating a reference file (`.gemini/reference/web-clip-*.md`) that can be used in prompts.
    -   **Quick Actions:** A context menu option to quickly trigger a command with the clipped content (e.g., "Summarize this with Phoenix").

### 5. **Web Dashboard (`packages/web`)**

A web-based interface for visualizing analytics and managing the engine, for users who prefer a graphical interface.

-   **Features:**
    -   **Usage Analytics:** Displays charts and graphs based on the `usage_log.json`, showing most used skills, success/failure rates, etc.
    -   **Plugin Marketplace:** A beautiful, searchable interface for the `catalog/index.json`, allowing for one-click installation.
    -   **Security Log:** A dedicated view for all security alerts triggered by the Security Sentinel hook.

### 6. **Shared SDK (`packages/sdk`)**

A non-executable, internal package containing shared code used across all other products in the suite.

-   **Contents:**
    -   **TypeScript Types:** `Plugin`, `Skill`, `Command`, `Agent` interfaces.
    -   **Constants:** Shared keys, event names, and default configurations.
    -   **Utility Functions:** Common functions for parsing, logging, etc., that are used by more than one package.