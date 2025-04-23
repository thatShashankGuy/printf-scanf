---
title: Anatomy of a prompt
author: Shashank Shekhar
date: 2025-04-23
---

![Image](/atanomypromt.png "anatomy of prompt")

## Quick Announcement

I started this blog to reflect on my learning and write down my ideas in a more digestible format. I kind of deviated from that by making it very textbook-style, code-centric articles.

They were also extremely long, so—based on feedback—I’d like to start over and do some mix-and-match. While I’ll still occasionally write code-heavy articles, I’ll also do these small “TILs” to jot down raw notes in a more standard format.

I hope you enjoy this, and feel free to send your feedback via email or over LinkedIn.

---

## What Is Prompting?

Prompting is something we all do in 2025, so I don’t know who needs a definition—but for people living under a rock, here’s Wikipedia’s:

> **Prompt**  
> Natural language text describing the task that an AI should perform.

We use prompts to generate code, refine emails, decode jargon, and proofread and polish blogs—because we’re not all great writers! 😉

A GenAI response is only as good as its prompt. As an engineer who generates scripts, prompting needs to be meticulous—otherwise most of the time saved via prompting gets eaten up in debugging and even more time in rewriting. (Frustrating stuff.)

---

## Anatomy of a Prompt

A good prompt can be broken into **five parts**:

1. **Instruction**  
   Tell the model what to do. Be specific, clear, and action-oriented.  
   _Example:_

   ```
   Summarize the following paragraph in 3 bullet points.
   ```

2. **Input Data**  
   Provide the data the LLM will work on: a paragraph, a code snippet, user data, etc. In code scenarios, this is like passing arguments to a function or API body.

3. **Output Format**  
   If you know what your output should look like, give an example. This guides the model’s structure—bullet points, assertion outputs, email format, formality level, etc.

4. **Role**  
   Specify the personality, style, or expertise the model should adopt.

   ```
   Respond like a professional doctor explaining to a 10-year-old.

   ```

5. **Context** (optional but powerful)  
   Give background so the model can ground its response. For instance, tell your LLM it’s an “expert software architect” when brainstorming architecture.

---

### Full-Five-Part Prompt Example

```
You are a professional technical writer.
Summarize the following article in 3 bullet points.
Article:
[Paste text here]
Respond in plain English, suitable for beginners.
```

