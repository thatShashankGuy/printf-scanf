---
title: Learning from Agentic Automation
author: Shashank Shekhar
date: 2025-08-23
---

![automation](/automation.png "automation")

Over the past few months, I’ve been learning and building **AI Agents / LLM-driven automation workflows.**

I learned a lot - some exciting, some challenging and I decided to document my learnings in this blog.

---

### LLM Workflows and Agentic Automation is Backend Engineering with Extra Steps

Yep! Maybe I’ll ruffle some feathers, but building AI agents is very much a **backend / automation pipeline-driven process.** The same basic principles apply — and that’s actually a good thing.

This means we already understand many of the pitfalls and curveballs that come with production-grade automation. The difference is: in the case of agents, a mistake can break your bank.

**Apply all the validation you can.** Which brings me to the next point...

---

### The Hard Part Is Deciding What _Not_ to Pass

When designing prompts and workflows, the instinct is to keep feeding more context into the model — more examples, more documents, more background. But in practice, **irrelevant or noisy information often hurts more than it helps.**

- Passing too much unfiltered context can cause models to drift, hallucinate, or simply waste tokens.
- Filtering, chunking, and ranking inputs before they reach the LLM is often the difference between a brittle agent and a reliable one.
- Think of it as building an _information diet_: curating what the model sees is just as important as how you frame the task.

Don’t just observe your flow. **Be in the loop.**

---

### Human-in-the-Loop (HITL) Is Not Optional

When prototyping agents, it’s tempting to automate everything end-to-end. But in practice, **the Human-in-the-Loop (HITL) pattern often determines whether the system produces intelligent behavior or unpredictable nonsense.**

- During prototyping, humans can validate intermediate outputs, approve critical actions, or correct model drift.
- In production, HITL is still relevant if accountability, compliance, and security of your users’ input is your responsibility.
- HITL allows the system to learn faster and fail safer.

No smooth segue here — let’s get to the next point

---

### Orchestration > Model

It’s easy to think the latest state-of-the-art model will solve everything. But I’ve seen firsthand that **poor orchestration can cripple even the best models.**

- Without careful workflow design, an LLM may loop endlessly, call the wrong tools, or misinterpret context.
- Decisions about memory management, tool-calling, and step ordering often matter more than which model you choose.
- In fact, a well-orchestrated system with a mid-tier model can often outperform a poorly orchestrated one with a cutting-edge LLM.

Many of my automations failed — sometimes due to shaky orchestration, and other times because of my next point (and main frustration).

---

### Observability Is Not There Yet

One of the biggest ongoing challenges is **observability.** Unlike traditional software systems, where logs and metrics are standardized, LLM-driven agents operate like a black box.

- How do you debug when an agent makes a bad decision?
- How do you trace reasoning across multiple steps, tools, and context windows?
- How do you measure accuracy, latency, or “hallucination rate” in production?

Right now, I’m experimenting with tools like **LangGraph** and **Flowise**, but I still don’t have a robust diagnostic setup for my room full of agents.

---

### TL;DR

- I’m new and still learning, but backend engineering experience helps a lot.
- Guardrails are important.
- Focus on orchestration more than the SOTA model of the day.
- Figure out observability early.

**Happy Building!**
