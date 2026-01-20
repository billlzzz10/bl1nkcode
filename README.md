A simple hello world agent, delivered as a VS Code Extension, that generates
a README for a given folder, available with two entrypoints:

* Right-clicking a folder in the explorer and selecting "Generate README"
* By selecting "Generate README" via the IDE's command palette

To try it, set your Gemini API key in `./src/config.ts`.

In production, you'll need to secure the API key somehow.