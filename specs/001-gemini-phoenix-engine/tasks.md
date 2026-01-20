# Tasks: Gemini Phoenix Engine

**Feature**: Gemini Phoenix Engine (The Synthesis)
**Branch**: `001-gemini-phoenix-engine`
**Spec**: [specs/001-gemini-phoenix-engine/spec.md]
**Status**: Generated

## Dependencies

1. **Setup**: Cleanup & Environment (Phase 1)
2. **Foundational**: Semantic Core & Python CLI (Phase 2)
3. **User Stories**:
   - US1: Interactive CLI Chat Mode (MVP)
   - US5: Semantic Intelligence (MVP)
   - US3: Plugin Architecture
   - US2: Command Discovery
   - US4: Execution & Security
4. **Polish**: Documentation & Context

## Implementation Phases

### Phase 1: Setup
**Goal**: Establish a clean, unified monorepo structure and ensure all tooling is ready.
**Test Criteria**: `pnpm install` succeeds; workspace structure matches plan.

- [x] T001 Merge `gemini-phoenix-engine` wrapper into root `package/` structure
- [x] T002 Configure root `package.json` and `pnpm-workspace.yaml` for unified workspace
- [x] T003 Initialize `.gemini/commands/speckit.constitution.toml`
- [x] T004 Install `uv` and run `pnpm install` to bootstrap all packages

### Phase 2: Foundational
**Goal**: Build the core nervous system (TS) and brain (Semantic Core/Python) required for features.
**Test Criteria**: `phoenix doctor` passes; `skills-ref --help` works.

- [x] T005 [P] Clone and setup `mcp-server-milvus` in `package/semantic-core/mcp-server-milvus`
- [x] T006 [P] Implement Python CLI `skills-ref` with Typer in `package/core/python/skills_ref/main.py`
- [x] T007 [P] Implement `phoenix doctor` command in `package/cli/src/commands/doctor.ts`
- [x] T008 Link extensions and verify `phoenix` CLI global availability

### Phase 3: User Story 1 - Interactive CLI Chat Mode
**Goal**: Provide a stateful conversation loop with specialized agents.
**Test Criteria**: `phoenix chat ui-architect` enters a REPL; agent responds with persona context.

- [ ] T009 [US1] Implement agent persona loading logic in `package/core/src/agents.ts`
- [ ] T010 [US1] Create interactive REPL/Chat loop in `package/cli/src/commands/chat.ts`
- [ ] T011 [US1] Register `chat` command in CLI entrypoint `package/cli/src/index.ts`

### Phase 4: User Story 5 - Semantic Intelligence
**Goal**: Enable semantic search capability for skills and commands.
**Test Criteria**: `phoenix index` creates a vector store in Milvus; search returns relevant tools.

- [x] T012 [US5] Implement indexing logic (Catalog -> Milvus) in `package/semantic-core/src/index.ts`
- [x] T013 [US5] Create `index` command in `package/cli/src/commands/index-command.ts`
- [x] T014 [US5] Implement `BeforeToolSelection` hook for semantic retrieval in `package/core/src/hooks/semantic-retrieval.ts`

### Phase 5: User Story 3 - Plugin Architecture
**Goal**: Support external Python packages as skills managed by `uv`.
**Test Criteria**: Skill environments are isolated; `uv run` executes skill logic correctly.

- [ ] T015 [P] [US3] Define standard skill package template with `pyproject.toml`
- [ ] T016 [P] [US3] Implement `uv` environment management logic in `package/core/src/python-bridge.ts`
- [x] T017 [US3] Create initial `catalog/index.json` with example plugin definition

### Phase 6: User Story 2 - Command Discovery
**Goal**: Allow users to explore available skills and agents.
**Test Criteria**: `phoenix list` displays agents and plugins from the catalog.

- [ ] T018 [US2] Implement catalog exploration logic in `package/core/src/skills.ts`
- [ ] T019 [US2] Create `list` and `plugins` commands in `package/cli/src/commands/list.ts`

### Phase 7: User Story 4 - Execution & Security
**Goal**: Safe execution of tools with optional sandboxing.
**Test Criteria**: `api_key` in arguments triggers warning; Docker runner executes when configured.

- [x] T020 [US4] Implement `BeforeTool` security scanner hook in `package/core/src/hooks/security-scanner.ts`
- [ ] T021 [US4] Implement optional Docker-based execution runner in `package/core/src/runners/docker.ts`

### Phase 8: Polish & Cross-Cutting Concerns
**Goal**: Production readiness and documentation.
**Test Criteria**: All documentation is up-to-date; all tasks marked complete.

- [x] T022 Create/Update `GEMINI.md` persistent context file
- [x] T023 Generate final `README.md` and `docs/quickstart.md` updates

## Dependencies

- **T001-T004** (Setup) must be complete before any logic.
- **T005-T008** (Foundational) must be complete before US1 or US5.
- **US5** (Semantic) is a prerequisite for intelligent tool selection in **US1** (Chat).

## Implementation Strategy

1. **MVP First**: Focus on `doctor`, `index`, and `chat` commands.
2. **Incremental Delivery**: Deliver Semantic Indexing before specialized agents to provide immediate value.
3. **Parallel Execution**: Python CLI (T006) and TS CLI (T007) can be developed independently once core structure is merged.
