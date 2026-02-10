---
title: "Keep your AI assisted workflows simple, stupid  "
author: Shashank Shekhar
date: 2026-02-10
draft: false
---

I sometimes end up in programming/AI rabbit holes on Reddit. This weekend I browsed for many, many posts where the point of discussion was AI skill issues. "You don't prompt well," "add a Agent.md," "Ask LLM to re-eval their work," "Ask to create a feedback loop to optimize initial prompts," and many more. So many pre-implementation steps. So many guardrails. It's like baby-proofing a house or, likely, asking the baby to baby-proof the house.

I'm going to say something very obvious but very controversial - you don't need to actually do so much groundwork. You don't need a manifesto of a prompt, you don't need "skills" for AI, and you don't need management of multiple agents (in most cases). You need to know how to write programs. You need to know how to read code and figure out how to debug.

I have tried everything - because the genie is out of the box, AI is here, and I am not really a gatekeeper, old-school conservative when it comes to programming. I enjoy writing code with and without AI. I am actually very, very happy with LLM-powered autocomplete and CLI terminals that let me generate so much boilerplate which helps me fast-track my work.

What I don't enjoy is the wild amount of setup these AI bros suggest - TDD, Agent file, skill file instruction file - garbage amount of token output on Plan mode. It made me slow, not fast. AI generates way too much code that going back slightly is not possible - debugging is tedious and time-consuming, and if it's a brownfield project, well, good luck - scraping and re-writing.

I have always been a big fan of the KISS principle - I have implemented KISS in pretty much all aspects of my life - food, workout, work, and of course, programming.

Here is my stupid simple workflow:

1. Simple agent file - with YAML syntax - explaining AI what to do and what not to do.
2. After that, all I need is my codex/opencode terminal, my nvim/vscode with GitHub Copilot, and a good old simple brain to write most of the technical complex code.

**Big disclaimer though:** This works great, but it might not if you have given up on using your brain - that's the engine of my process, not the LLM. If you have decided not to read or write code, my process is garbage, and all of my critique doesn't apply to you.

I write a lot, and I do write code for a living. This is not for clicks, but I am the fastest in my implementations than ever before. I swear by the fact that knowing programming is still the biggest advantage you will ever get. The KISS principle is also part of that. So I will strongly suggest to keep it simple, stupid, and just learn programming.
