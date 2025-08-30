---
title: My Timeline with Gen AI- A Developer's Journey from Fear to Fluency
author: Shashank Shekhar
date: 2025-08-30
---

![Image not found](/programming-gen.png "programming")

For the past couple of years, like many other software developers, I have fully integrated generative AI into my development toolkit. I want to share my journey and my experience with the different tools that have shaped my workflow.

#### **Early Days: ChatGPT and the Beginning of a New Age**

When ChatGPT launched in late 2022, the reaction was immediate. We tried it, we were horrified it would take our jobs, and I decided I didn't want that anxiety. That lasted until late December or early January when I had to deliver a feature, fast.

I was struggling with the syntax and API of an unfamiliar library, so I quickly asked GPT for help. And well, it delivered.

That was my first real taste and the moment I realized this was a tool, not a replacement. I had to be exact and precise—I had to instruct it, and I had to validate the output. That sounded familiar. Wait, that's just coding. But instead of instructing compilers and interpreters to get machine code, I had a new abstraction layer. I was now providing natural language instructions to a program that, in turn, wrote instructions for my compiler.

##### **Learning:**

- _I was still coding, just in English._

#### **Progression: GitHub Copilot and the Craft of Prompting**

Soon after GPT was announced, I learned about GitHub Copilot. It utilized an OpenAI model to auto-complete code by using predictive analysis. I was still new to the space and had some understanding of ML, but I knew I needed to learn Gen AI better. This felt like a paradigm shift in IT.

Having said that, I HATE autocomplete (yes, I still do). It almost always generated garbage logic, and the _ghost text_ was incredibly distracting.

I stuck with ChatGPT as my daily driver. I was using it more and more to generate boilerplate, but I was getting annoyed. In the initial days, it generated boilerplate very well, but the more I used it for complex tasks, the more terrible the logic it provided. I guessed my prompts weren't good enough.

I started to realize why coding syntax is so deterministic: _machines do not appreciate vague instructions_. It was the same for LLMs. English was too subjective and abstract to define a problem statement properly. Prompting required structure. It was a skill I needed to develop.

##### **Learning:**

- _LLMs, like any machine, don't appreciate vague instructions. Keep your prompts highly structured, almost like a programming language._
- _Abstraction in your instructions will kill productivity. Prompting is a skill. Think before you type._
- _I'm not a fan of autocomplete on steroids. Ghost text was a weird idea._

#### **Cursor, Agent Mode & a Sense of Dread**

While GitHub fumbled and lost its first-mover advantage, a startup called Cursor—a fork of VS Code—utilized Gen AI in a more natural way: as an agent.

Cursor's approach, which seems obvious now, was novel at the time. It would read all the relevant files to build _context_ and then write a file for you. Yes, it was writing entire files. It wasn't just trying to auto-complete your code, and it didn't give you the illusion that you wrote it. It was genius and, frankly, dreadful.

I loved writing code. It was my superpower, my craft. I spent my free time honing this skill, and now a computer program was doing it without breaking a sweat. Anyone could write code now. What value did I provide? Would I have a career? The internet didn't help. Doomers were everywhere, talking about AGI and the Singularity.

Spoiler alert: all of that is nonsense. It's not replacing devs anytime soon. If you want to debate me, I have no interest in changing your mind. Quit now and do whatever you think is a better use of your time.

Back to the timeline. Cursor was good, but my employer was still assessing tools. We had company-wide access to GPT, which was improving, and we had developed workflows to utilize it better. I was still programming.

##### **Learning:**

- _Don't build your sense of self around a skill, a job, or an identity._
- _I'm not a "programmer." I write programs, but I'm more of an IT professional who does a bunch of other things. And even that is a job, not my identity._
- _If your job is a set of routine tasks, think hard. A rapid wave of automation is coming. It's time for a pivot._

#### **More Players, Better Mindset**

My learnings might sound like _"cope"_ to a lot of people, but if you follow along, you'll understand. This should be your career progression regardless of whether AI takes your job. Automation isn't new; it has been happening for decades.

From the beginning, computer programming has been refined with the goal of eliminating complexity. From punch cards to assembly to Fortran, C, Python, and now LLMs, every stage was about making software development more accessible. This is just the next step.

At this point, I got an opportunity to work closely with IT operations as a Senior Integration Platform Engineer with my new employer. I dived into business processes and deepened my learning from that point of view. I spent my time identifying gaps and writing solutions. I focused less on learning the syntax of every shiny new programming language (a habit I had to kick for good) and deepened my toolset in Node, TypeScript, and Python, using them to solve business problems and ship fast.

Meanwhile, the market exploded. We got Claude from Anthropic, Gemini from Google, and Meta's Llama models became more famous—and more importantly, open source. A ton of tools, protocols, and systems were emerging in the LLM space, with engineering built around what we now call foundation models. Techniques like RAG and context engineering were developed.

I decided to lean into the tooling and techniques. I learned about model architectures and became part of the growing world of agentic development and automation.

##### **Learnings:**

- _Understand business processes and real-world problems to generate more value._
- _Sharpen your technical skills alongside your business acumen. For a good software engineer, it's not "either/or," it's "and."_
- _AI engineering and agentic workflows are powerful additions to the automation and software engineering toolkit._

#### **The Present: Terminal Agents and Over-Reliance**

By now, I was not only comfortable with AI but actively part of the ecosystem. I went through several low-code, no-code, and coding frameworks for developing autonomous agents, like LangGraph, LangChain, Flowise, N8N, and Crew AI. I now understood tokenization, context windows, memory, embeddings, vector DBs, and the attention mechanism.

In the coding world, we now have editor-independent tools like Claude Code that let you write code from the terminal. Google released its own offering called Gemini CLI, and Open Interpreter became a popular open-source alternative. For developers, these terminal-based agents felt like the most natural way to use Gen AI—generating, reviewing, and committing code in one flow.

The models are getting better, and we're writing less code by hand. But this is a double-edged sword. When we started, models like GPT-3.5 were barely good. They had a lot of flaws and hallucinations. Everyone knew it, so they were cautious.

Now, we have incredibly good models like Claude 3 Opus. Tools are faster and more intelligent. GitHub Copilot finally integrated a true agent mode, and its integration with your repository is amazing. I use it as my daily driver now, almost exclusively in agent mode. The problem is, some developers are over-relying on these advanced models for minimal tasks. While hallucinations have decreased, they haven't disappeared. In fact, they've become more subtle. Models now present wrong answers with so much confidence that you'll miss the error if you aren't looking for it.

Another challenge is that a model's performance significantly decreases as a codebase grows. I experienced this firsthand on a recent greenfield project. As my codebase became larger and more modular, the model started producing subpar results.

I feel that at the current stage of model development, we need to be mindful of our usage. A deep understanding of coding is absolutely necessary if you want to build robust software with these tools. The time I save writing boilerplate is now utilized in writing and running more tests, finding holes, and making the code more bulletproof. This has been liberating. Before, I never had enough time, and the backlog was always full. Now, I still give the same time estimate for a ticket, but that time includes more tests, better design patterns, and vulnerability hunting.

##### **Learning:**

- _Software development is far from automated._
- _Learning to code is still as valuable today, if not more so._
- _Being economical with tokens and agent usage pays dividends._
- _Gen AI-assisted coding only makes you productive if you are also economical with your time._
- _AI assistance freed up my time from boilerplate, allowing me to focus on a more holistic development workflow._

#### **The Future?**

So, what's next? The honest answer is: nobody knows for sure.

Will software engineering as we know it die out? Is another AI winter coming? Will AGI take over humanity? Maybe. Maybe not.

What I do know is this: you can't hold back progress, and losing sleep over hypotheticals is a waste of energy. My plan is to keep learning, adapting, and doing what I enjoy.

And whatever happens, I'll update you here.

Until then, keep coding!
