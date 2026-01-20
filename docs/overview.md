### **พิมพ์เขียวผลิตภัณฑ์: Gemini Phoenix Engine**

**เวอร์ชัน:** 17.0 (The Blueprint)
**สถานะ:** Final, Approved for Development

#### **1. README.md (The Front Door)**

นี่คือสิ่งแรกที่ทุกคนจะเห็น มันต้องชัดเจน, สร้างแรงบันดาลใจ, และบอกได้ว่าโปรเจกต์นี้คืออะไรและทำไมมันถึงแตกต่าง

````markdown
# 🔥 Gemini Phoenix Engine: The Definitive AI Workflow Toolkit

**Gemini Phoenix Engine** is not just another extension; it's a complete, resilient, and intelligent ecosystem designed to rebirth your entire workflow within Gemini CLI. It transforms the CLI from a simple tool into a sentient, self-correcting partner that understands, manages, and enhances your AI-driven development lifecycle.

This project is born from the ashes of previous attempts, meticulously engineered to be the definitive, production-ready toolkit. It learns from every interaction, secures every action, and provides a comprehensive suite of tools for creating, managing, and discovering AI capabilities.

---

### ✨ Core Philosophy & Differentiators

This engine is built on three foundational pillars that address the critical flaws of other systems:

1.  **TS-Centric Polyglot Architecture:** We leverage the best of both worlds. A **TypeScript Control Plane** acts as the fast, event-driven nervous system for real-time interactions (Hooks, I/O, Servers), while a **Python "Powerhouse"** (managed by `uv`) handles the heavy lifting of skill validation, parsing, and management. This is not just two languages in one repo; it's a symbiotic relationship.

2.  **The Catalog is King (Catalog-Driven by Default):** The engine is architected around a central `catalog/index.json`. It's not an afterthought; it's the source of truth. The entire system is designed to **parse, install, and manage** capabilities (Plugins, Skills, Commands) from this catalog, enabling granular installation and a rich, discoverable ecosystem.

3.  **Creation with Confidence (The Sandbox & Validation Pipeline):** We don't just let you create skills; we give you a safe environment to do so. Inspired by best-in-class templates, our **Skill Creator** uses an `isolated-vm` sandbox and a strict validation pipeline. No skill gets into your workflow without being tested and proven, preventing the "it works on my machine" problem and ensuring quality from day one.

### 🏗️ Project Structure: A Unified Monorepo

We use `pnpm workspaces` to manage a unified monorepo where every component lives within the `packages` directory. This promotes code sharing, consistent tooling, and simplified dependency management.

```
/gemini-phoenix-engine
|
|--- /catalog/              # The source of truth for all capabilities
|--- /packages/
|    |--- /cli/                # The user-facing CLI for managing the engine
|    |--- /core/               # The heart: Hooks, Installer, Auth, Servers
|    |--- /sdk/                # Shared types, constants, and utilities
|    |--- /browser-extension/  # The Web Clipper
|    |--- /vscode-extension/   # VS Code integration
|    |--- /web/                # The web dashboard
|
|--- package.json             # The root control center
|--- pnpm-workspace.yaml
|--- ...
```

### 🚀 Getting Started

1.  **Prerequisites:** `pnpm` (v8+), `Node.js` (v20+), `uv` (Python package installer).
2.  **Installation:** `pnpm install` (This will also trigger the setup for the Python environment).
3.  **Development:** `pnpm dev`.
4.  **Usage:** The `phoenix` CLI becomes your primary tool:
    *   `phoenix plugins list`
    *   `phoenix plugins install <plugin_name>`
    *   `phoenix skills new`

---
````

#### **2. package.json (The Root Control Center)**

นี่คือศูนย์กลางการควบคุมของ Monorepo ทั้งหมด สะท้อนแนวคิดแบบ Lean ที่ใช้ pnpm workspace อย่างเต็มประสิทธิภาพ

```json
{
  "name": "gemini-phoenix-engine",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm --filter \"./packages/**\" run build",
    "dev": "pnpm --filter \"./packages/**\" --parallel run dev",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "test": "pnpm --filter \"./packages/**\" run test",
    "setup:py": "uv pip install -r packages/core/python/requirements.txt",
    "postinstall": "pnpm run setup:py && pnpm run build"
  },
  "devDependencies": {
    "@types/node": "^20.12.12",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5"
  },
  "packageManager": "pnpm@8.15.6"
}
```

#### **3. PRODUCTS.md (Defining What We Build)**

เอกสารนี้จะอธิบาย "ผลิตภัณฑ์" แต่ละชิ้นใน Monorepo ว่ามันคืออะไร, ทำหน้าที่อะไร, และมีฟีเจอร์หลักอะไรบ้าง

````markdown
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
````

#### **4. STYLE-CODE.md (Defining How We Build)**

เอกสารนี้คือ "กฎของบ้าน" ที่ทุกคนในทีมต้องปฏิบัติตาม มันสะท้อนบทเรียนจากความผิดพลาดทั้งหมดของเรา

````markdown
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

---

### **พิมพ์เขียวผลิตภัณฑ์: Gemini Phoenix Engine (ฉบับสมบูรณ์)**

**เวอร์ชัน:** 17.1 (Component-Pinned Blueprint)
**สถานะ:** Final, Ready for Development

(เอกสาร `README.md`, `PRODUCTS.md`, และ `STYLE-CODE.md` ยังคงเดิมจากเวอร์ชัน 17.0)

#### **การตรอกหมุด: `package.json` สำหรับแต่ละ Package**

นี่คือรายละเอียดของ `package.json` สำหรับแต่ละส่วนประกอบในไดเรกทอรี `packages/` ซึ่งเป็นหัวใจของการทำให้ Monorepo นี้ทำงานได้จริง

##### **1. Root `package.json` (ศูนย์กลางควบคุม)**

(ยังคงเดิมจากเวอร์ชัน 17.0 - ทำหน้าที่ควบคุม workspace ทั้งหมด)

```json
// /package.json
{
  "name": "gemini-phoenix-engine",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm --filter \"./packages/**\" run build",
    "dev": "pnpm --filter \"./packages/**\" --parallel run dev",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "test": "pnpm --filter \"./packages/**\" run test",
    "setup:py": "uv pip install -r packages/core/python/requirements.txt",
    "postinstall": "pnpm run setup:py && pnpm run build"
  },
  "devDependencies": {
    "@types/node": "^20.12.12",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.5"
  },
  "packageManager": "pnpm@8.15.6"
}
```

---

##### **2. Core Engine (`packages/core/package.json`)**

**หน้าที่:** หัวใจของระบบ, จัดการ Hooks, Installer, Auth, Servers, และเป็นสะพานเชื่อมไปยัง Python

```json
// /packages/core/package.json
{
  "name": "@phoenix/core",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.25.2",
    "chalk": "^5.3.0",
    "chokidar": "^3.5.3",
    "express": "^4.18.2",
    "fs-extra": "^11.2.0",
    "isolated-vm": "^4.7.2",
    "keytar": "^7.9.0",
    "open": "^9.1.0",
    "ora": "^8.0.1",
    "ws": "^8.16.0",
    "zod": "^3.22.4",
    "@phoenix/sdk": "workspace:*" // <<-- อ้างอิง SDK ภายใน
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^20.12.12",
    "@types/ws": "^8.5.10",
    "typescript": "^5.4.5"
  }
}
```

---

##### **3. Phoenix CLI (`packages/cli/package.json`)**

**หน้าที่:** เครื่องมือ CLI หลักที่ผู้ใช้โต้ตอบด้วย

```json
// /packages/cli/package.json
{
  "name": "@phoenix/cli",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "phoenix": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "commander": "^11.1.0",
    "inquirer": "^9.2.14",
    "chalk": "^5.3.0",
    "ora": "^8.0.1",
    "@phoenix/core": "workspace:*", // <<-- เรียกใช้ Logic จาก Core
    "@phoenix/sdk": "workspace:*"
  },
  "devDependencies": {
    "@types/inquirer": "^9.0.7",
    "@types/node": "^20.12.12",
    "typescript": "^5.4.5"
  }
}
```

---

##### **4. VS Code Extension (`packages/vscode-extension/package.json`)**

**หน้าที่:** การผสานการทำงานเข้ากับ VS Code

```json
// /packages/vscode-extension/package.json
{
  "name": "@phoenix/vscode-extension",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "main": "./dist/extension.js",
  "scripts": {
    "build": "tsc -p ./",
    "dev": "tsc -watch -p ./"
  },
  "dependencies": {
    "@phoenix/sdk": "workspace:*"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@types/node": "^20.12.12",
    "typescript": "^5.4.5"
  }
}
```

---

##### **5. Browser Extension (`packages/browser-extension/package.json`)**

**หน้าที่:** Web Clipper สำหรับเบราว์เซอร์

```json
// /packages/browser-extension/package.json
{
  "name": "@phoenix/browser-extension",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  },
  "dependencies": {
    "preact": "^10.19.3"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.8.2",
    "@types/chrome": "^0.0.267",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}
```

---

##### **6. Web Dashboard (`packages/web/package.json`)**

**หน้าที่:** UI บนเว็บสำหรับแสดงผลและจัดการ

```json
// /packages/web/package.json
{
  "name": "@phoenix/web",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@phoenix/sdk": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}
```

---

##### **7. Shared SDK (`packages/sdk/package.json`)**

**หน้าที่:** แหล่งรวม Types, Constants, และ Utilities ที่ใช้ร่วมกัน

```json
// /packages/sdk/package.json
{
  "name": "@phoenix/sdk",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

---
