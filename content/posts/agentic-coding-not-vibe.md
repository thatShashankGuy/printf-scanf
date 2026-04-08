---
title: "How I Use AI Coding Agents Without Vibes"
author: Shashank Shekhar
date: 2026-04-08
draft: false
---

I'm knee deep into AI coding agents and agentic programming. Yes, I have strong opinions about Vibe coding and I'm a big advocate of vetting your code. We are still responsible for our code, and AI doesn't take accountability away from us.

Having said that, today I want to look at the bright side. I have really started enjoying my agents more. I found love in coding without typing code. This was not always the case - I always found auto-completion features more enjoyable than prompting in a terminal. But recently I have found my groove with prompts. So here are a few things I do now to feel like programming without actually writing much code.

## Pseudocode with Keywords

I type in pseudocode using regular programming keywords - IF, ELSE, WHILE, SET, >, !=, ==, and so on. My prompts are mixed with TypeScript and Python with English.

```
IF transaction_id = null OR undefined THEN
    ADD a rollback function 
    ADD a log entry
    ADD error handling
    CANCEL transaction 

ELSE
    FIRE Success Event and CALL consumer API 
```

## Constraints

I add a list of DOs and DON'Ts at the end of my instructions. I am able to express myself better and I am able to validate things fast, as my instructions are very targeted.

```
DO NOT - OVERRIDE EXISTING LOGIC 
DO - CREATE NEW FUNCTIONS TO KEEP BEHAVIOUR MODULAR 
```

## Ask A Lot

I ask AI to explain the code, explain decisions, and what different approaches it would take. A lot of work goes into discussing code without actual implementation. Sometimes we throw away a big implementation once we find a better approach via this method by replacing it.

```
Explain the reasoning behind implementation
Propose another approach 
Without editing any code provide alternative code change 
What are major risks with your current implementation 
```

## Sub Agents and Context Management

AI responses are much better with context. Once the context window is filled, AI responses degrade. Sub agents are a great way to manage context outside your main task, keeping your main agent free to focus on the main task at hand.

## Extensive Testing

AI can write good tests - AI can write bad tests. AI often writes silently passing tests. Read tests, run tests, change a few inputs in tests. Spend freed-up time in regression testing. We are moving from writing code to stewarding and steering it, and testing is the most important part of this new role.

## Disclaimer

I use Codex and Claude mostly, but this should work with all coding agents. This is my process, and I do not guarantee it will work for all use cases. I do not write a full feature in one shot prompt - at least for now. I do not vibe code.

These minor rituals have helped me stay focused and produce high-quality code. I have started enjoying coding again, hopefully you will too. :)
