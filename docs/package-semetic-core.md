### **พิมพ์เขียวผลิตภัณฑ์: Gemini Phoenix Engine (ฉบับสมบูรณ์และผสานรวม)**

**เวอร์ชัน:** 19.0 (The Synthesis)
**สถานะ:** Final, Approved for Development

#### **1. วิสัยทัศน์ (The Synthesized Vision)**

สร้าง **"Phoenix Engine"** ซึ่งเป็นระบบนิเวศ AI Workflow ที่สมบูรณ์แบบที่สุด โดยการ **ผสานรวม (Synthesize)** แนวคิดที่ดีที่สุดทั้งหมด:

1.  **สถาปัตยกรรม Polyglot (TS + Python):** ยังคงเป็นแกนหลัก โดยมี TypeScript เป็นศูนย์กลางควบคุม และ Python เป็นเครื่องมือเบื้องหลัง
2.  **ขับเคลื่อนด้วยแคตตาล็อก (Catalog-Driven):** `catalog/index.json` คือหัวใจหลักในการจัดการและติดตั้ง "Plugins"
3.  **Agent Persona เฉพาะทาง:** มีทีม Agent ผู้เชี่ยวชาญ (`ui-architect`, `component-developer`, `command-expert`, `catalog-manager`) ที่ทำงานร่วมกัน ไม่ใช่ Agent ครอบจักรวาล
4.  **Semantic Core (หัวใจเชิงความหมาย):** **ผสานรวม** ระบบ Semantic Search (Qdrant + Nomic) เข้ามาเป็น **"สมองชั้นที่สอง"** ของระบบ เพื่อเพิ่มความแม่นยำในการเลือก Skill และ Command
5.  **Validation Pipeline ที่แข็งแกร่ง:** ทุก Skill และ Command ใหม่ต้องผ่านการตรวจสอบใน Sandbox และโดย Python Validator ก่อนเข้าระบบ

#### **2. สถาปัตยกรรมฉบับผสานรวม (The Synthesized Architecture)**

นี่คือโครงสร้างที่รวมทุกอย่างไว้ด้วยกัน:

```
/gemini-phoenix-engine
|
|--- /catalog/              # (1) คลังเก็บ Catalog และเนื้อหา Plugin ทั้งหมด
|--- /packages/
|    |--- /cli/                # (2) Phoenix CLI (มีคำสั่ง `index` เพิ่มเข้ามา)
|    |--- /core/               # (3) หัวใจหลัก (มี Python Bridge และ Logic การเรียกใช้ Semantic Core)
|    |--- /sdk/                # (4) Shared Types และ Utilities
|    |--- /semantic-core/      # (5) <<-- **Package ใหม่ที่รับผิดชอบ Semantic Search ทั้งหมด**
|    |--- /browser-extension/  # (6) Web Clipper
|    |--- /vscode-extension/   # (7) VS Code Integration
|    |--- /web/                # (8) Web Dashboard
|
|--- docker-compose.yml       # (9) <<-- สำหรับรัน Qdrant
|--- package.json             # Root pnpm workspace
|--- pnpm-workspace.yaml
|--- README.md
|--- PRODUCTS.md
|--- STYLE-CODE.md
|--- agent-personas/          # (10) <<-- **ไดเรกทอรีใหม่สำหรับเก็บ Agent Persona ทั้งหมด**
|    |--- phoenix-architect.toml
|    |--- ui-architect.toml
|    |--- component-developer.toml
|    |--- form-specialist.toml
|    |--- command-expert.toml
|    |--- catalog-manager.toml
```

#### **3. การทำงานร่วมกันของทุกระบบ (The Grand Workflow)**

นี่คือภาพการทำงานที่ทุกส่วนประกอบทำงานร่วมกันอย่างสมบูรณ์:

**สถานการณ์: ผู้ใช้ต้องการ "สร้างหน้า Dashboard ที่แสดงข้อมูลจาก Git"**

1.  **ผู้ใช้ป้อนคำสั่ง:** `I need a dashboard page to show recent git commits.`

2.  **`before_model_optimizer` (Hook ใน `core`) ทำงาน:**
    *   **ไม่ใช่การเดา Keyword อีกต่อไป!** Hook จะส่ง Prompt ของผู้ใช้ไปยัง `semantic-core`.
    *   **`semantic-core` ทำงาน:**
        *   `searcher.ts` สร้าง Embedding ของ Prompt ด้วย `nomic-embed-text-v1.5`.
        *   ส่ง Vector ไปค้นหาใน Qdrant (ที่รันบน Docker).
        *   Qdrant คืนผลลัพธ์เป็น Skill/Command ที่เกี่ยวข้องที่สุด เช่น `git-pr-workflows` (Plugin), `/git:commit` (Command), `git-advanced-workflows` (Skill).
    *   Hook สร้าง JSON Patch ที่มีรายชื่อ Tool ที่เกี่ยวข้องที่สุดเหล่านี้ ส่งให้ Gemini CLI.

3.  **Gemini Model เลือกใช้ Agent:** จาก Tool ที่มีให้เลือก โมเดลจะฉลาดพอที่จะเลือก Agent ที่เหมาะสมที่สุด ซึ่งก็คือ **`phoenix-architect`** (เพราะนี่คืองานสร้างระบบใหม่).

4.  **`phoenix-architect` (Agent) ทำงาน:**
    *   Agent วิเคราะห์คำขอ และวางแผนการสร้างหน้า Dashboard.
    *   **มันไม่ได้สร้างโค้ดเอง!** มันจะสร้างแผนและมอบหมายงานให้ Agent ผู้เชี่ยวชาญตัวอื่น:
        *   "ผมจะวางโครงสร้างหน้า `GitDashboardPage`.
        *   **มอบหมายให้ `component-developer`:** สร้าง `<CommitListItem>` และ `<LoadingSpinner>`.
        *   **มอบหมายให้ `command-expert`:** ตรวจสอบว่าเรามี command `/git:log` ที่ดึงข้อมูล commit หรือยัง ถ้าไม่ ให้สร้างขึ้นมาโดยใช้ `!{git log ...}`."

5.  **ผู้ใช้ (หรือ Parent Agent) ยืนยันแผน:** "ดำเนินการต่อ"

6.  **`component-developer` (Agent) ทำงาน:**
    *   สร้างโค้ด React สำหรับ `<CommitListItem>` และ `<LoadingSpinner>` ตามสเปกที่ `ui-architect` วางไว้.
    *   **ผลลัพธ์เป็นภาษาไทย:** โค้ดทั้งหมดจะมีคอมเมนต์และตัวอย่างการใช้งานเป็นภาษาไทย.

7.  **`command-expert` (Agent) ทำงาน:**
    *   สร้างไฟล์ `git-log.toml` ที่มี `prompt = "!{git log --pretty=format:'%h - %s (%an)' -n 15}"`.
    *   แนะนำว่าไฟล์นี้ควรอยู่ใน Plugin `git-pr-workflows`.

8.  **ผู้ใช้ (หรือ Parent Agent) เพิ่มไฟล์ใหม่เข้าระบบ:**

9.  **`catalog-manager` (Agent) ถูกเรียกใช้:**
    *   ผู้ใช้ (หรือระบบ CI/CD) รันคำสั่ง `phoenix plugins update` (สมมติ).
    *   Agent `catalog-manager` ทำงาน.
    *   มันเรียก `uv run python -m skills_ref validate-all` เพื่อตรวจสอบความถูกต้องของ command ใหม่.
    *   จากนั้นเรียก `uv run python -m skills_ref generate-index` เพื่ออัปเดต `.cache/catalog.json`.
    *   สุดท้าย มันเรียก `phoenix index` (CLI command) เพื่อให้ `semantic-core` ทำการ Index เนื้อหาของ command ใหม่ลงใน Qdrant.

10. **เสร็จสิ้นวงจร:**
    *   ตอนนี้ระบบมีทั้งหน้า UI ใหม่, command ใหม่, และ "ความรู้" เกี่ยวกับ command ใหม่นั้นก็ถูกบันทึกลงใน Vector Store เรียบร้อยแล้ว พร้อมสำหรับคำสั่งถัดไปของผู้ใช้.

---