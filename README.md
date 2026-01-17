# Decision Autopsy
<img src="/logo.svg" width="120" alt="Decision Autopsy Logo" />


**Decision Autopsy** is an internal, production-minded system that reconstructs *decision context* and runs a **structured, auditable AI analysis pipeline** to turn outcomes into organizational learning.

Most tools explain *what* happened.  
Decision Autopsy explains **why a decision made sense at the time it was made**.

This project intentionally prioritizes **system design, determinism, and reliability** over "smart" AI behavior.

---

## TL;DR (Reviewer Summary)

- Decisions are treated as **first-class system artifacts**
- Raw human context is **frozen at time-T**
- AI outputs are **structured, validated, and failure-tolerant**
- The system produces **explainable hypotheses**, not verdicts
- Humans remain the final authority

The AI model is swappable.  
The **pipeline design is the core contribution**.

---

## What This Project Demonstrates

This project demonstrates:

- A real **internal SaaS workflow**
- Deterministic data modeling (raw vs structured context)
- A **multi-step AI analysis pipeline**
- Failure-tolerant AI integration
- Human-in-the-loop review
- Production-safe guardrails around LLM usage

It does **not** attempt to be a chatbot or a recommender system.

---

## What This Is / Is Not

### This **IS**
- An internal decision analysis tool
- A decision forensics system
- A structured AI pipeline
- A post-mortem *and* pre-mortem analysis tool

### This is **NOT**
- ❌ A chatbot
- ❌ "Paste text → magic answer"
- ❌ Autonomous decision-making AI
- ❌ A recommender system

---

## Architecture Overview

```
User Input (Slack / Email / Notes)
         ↓
Raw Context Storage (Immutable)
         ↓
Paste-to-Parse (AI-assisted extraction)
         ↓
Human Review & Approval
         ↓
Structured Context (Deterministic JSON)
         ↓
AI Analysis Pipeline
  ├─ Core Analysis
  └─ Synthesis
         ↓
Validated, Explainable Results
```

---

## Technology Stack (All Free-Tier)

### Frontend
- React
- TypeScript
- Vite
- Material UI (MUI)

### Backend
- Node.js
- Express
- REST APIs only

### Database
- PostgreSQL
- Prisma ORM

### AI Provider
- Groq Cloud (free tier)
- OpenAI-compatible API
- CPU-only, demo-safe

---

## Core Data Model

The system **separates raw human input from structured context** to preserve determinism and auditability.

### Decision
- Raw context (immutable)
- AI-extracted structured context (human-approved)
- Optional outcome (post-mortem)
- Linked analyses

### Analysis
- Status: `PENDING | COMPLETED | LOW_CONFIDENCE | FAILED`
- Structured results only
- Explicit confidence score
- Model metadata

This separation is deliberate and non-negotiable.

---

## Paste-to-Parse (Key Feature)

Users can paste:
- Slack threads
- Email chains
- Meeting notes

The system:
1. Runs a **pre-processing AI step**
2. Extracts:
   - Title
   - Assumptions
   - Constraints
   - Risks
   - Metrics
3. Requires **human review before saving**

A **"Magic Fill (Demo)"** shortcut is included for live demos.

---

## AI Analysis Pipeline

### Design Constraints
- 2 AI calls total
- Synchronous execution
- Deterministic orchestration
- Structured JSON only

---

### Step 1: Core Analysis

**Inputs**
- Structured decision context
- Optional outcome

**Outputs**
- Assumption validity checks
- Possible cognitive biases (as hypotheses)
- Missing signals

Biases are phrased cautiously and always cite evidence.

---

### Step 2: Synthesis

**Outputs**
- Counterfactual scenarios
- Human-readable summary
- Explicit uncertainty handling

---

## JSON Safety & Failure Handling

LLMs occasionally emit invalid JSON.  
**This system never crashes because of that.**

Strategy:
1. Attempt JSON repair
2. Parse safely
3. Validate with schema
4. If invalid:
   - Mark analysis as `LOW_CONFIDENCE`
   - Preserve raw output
   - Display warning banner

The demo is failure-proof by design.

---

## Confidence Scores (Important)

Confidence values are **heuristics**, not claims of truth.

They reflect:
- Schema validation success
- Internal consistency
- Completeness of signals

Confidence is intentionally conservative and bounded.

---

## UX Principles

- No hidden automation
- No silent overwrites
- No "AI knows best" posture
- Clear user control at every step

If the AI fails, the failure is visible.

---

## Deployment

- **Frontend**: Vercel (Vite build)
- **Backend**: Render
- **Database**: Hosted PostgreSQL (free tier)

CORS and environment configuration are explicitly handled.

---

## Known Limitations (Intentional)

- No authentication
- No background jobs
- No external integrations (Slack, email, etc.)
- Desktop-only UI
- No fine-tuning

These are **conscious scope decisions**, not omissions.

---

## Why This Is Not "Just ChatGPT"

Yes — you *can* paste a Slack thread into ChatGPT.

But ChatGPT:
- Does not preserve decision-time context
- Does not enforce structure
- Does not separate raw vs interpreted data
- Does not provide auditability
- Does not model uncertainty explicitly
- Does not survive invalid output safely

Decision Autopsy is about **systemized reasoning**, not text generation.

---

## Project Status

✅ Core functionality complete  
✅ End-to-end deployed  
✅ Demo-safe  
✅ Portfolio-ready  

Further work would be incremental polish, not foundational fixes.

---

## License

MIT
