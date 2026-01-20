# Prompt Engineering Templates

This directory contains a collection of curated prompt templates based on the
best practices outlined in the project's `PROMPT_ENGINEERING_BEST_PRACTICES.md`
document.

These templates are designed to be used with the Gemini CLI to perform common
development tasks with high-quality, consistent results.

## Structure

Each `.toml` file in this directory represents a category of prompts (e.g.,
`code-generation.toml`, `code-review.toml`).

Within each file, individual prompts are defined with a description and a
template that includes placeholders for context (e.g., `{{code}}`, `{{language}}`).

## Usage

These templates can be loaded and used by the CLI's prompt execution engine.
Refer to the main project documentation for instructions on how to invoke
these prompts.
