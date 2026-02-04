---
title: "Automating my blog writing process"
author: Shashank Shekhar
date: 2026-02-04
draft: true
---
# Automating My Blog Writing Process with AI

## First, some background

I've been writing blogs since 2023 - starting with tutorial-style articles and recently writing whatever comes to mind. It began as a place to store all my notes but evolved into my primary spot to share my thoughts. I don't like posting on social media (I have some strong opinions on social media), so I use this blog mostly as a mental dump on what I'm thinking, what I've learned, and what I've observed.

## Now let's talk about AI

I started out in 2023 when ChatGPT was already around. Even the earlier models (now retired) were good enough to generate blogs. Not good blogs, but they did generate something. And I did use it - not in the lazy fashion, but to review, find grammatical mistakes, and improve structure. What I didn't worry about then but do now is how it made things monotonous with lots of LLM-isms. I don't care because my earlier blogs were... well, poorly made tutorials. I still have them up because I still refer to them from time to time (after all, they were supposed to be my notes). But because my prompts weren't "hey write an essay on xyz," I did the work - made example codes, wrote the whole thing, got it processed through ChatGPT (later Gemini). I was very much involved but still didn't feel the joy of writing.

## The manual process

```
[Drafting]
  └── Write blog with examples
      │
      ▼
[Processing]
  └── ChatGPT/Gemini optimization
      │
      ▼
[Validation]
  └── Manual review of output
      │
      ▼
[Integration]
  └── Move to blog repository
      │
      ▼
[Compilation]
  └── Build the blog
      │
      ▼
[Release]
  └── Publish content
      │
      ▼
[Distribution]
  └── Deployment
```

There were already some automations around:
1. The blog is built in Hugo; it converts markdown into HTML
2. Blogs deploy on Cloudflare through pre-built integration with GitHub Actions

Where I spent most time:
1. Writing (of course)
2. Reviewing LLM output
3. Reprompting for tweaks
4. Building Hugo server
5. Running locally
6. Deploying to GitHub

It was time-consuming, and because I'm building AI agents at work, I decided to make use of that to automate a lot of time-consuming work.

## The automated process

I built a utility tool which is a very simple command-line tool called `blog-cli` (I'm horrible at naming things). It starts with a simple command:

```sh
blog-cli new --ai
```
```
[Wizard UI]
  └── Input Title & Status (Draft/Live)
      │
      ▼
[Editor Interface]
  └── Open editor for content entry
      │
      ├─────────────────────────────┐
      │                             │
      ▼                             │
[File Generation]                   │
      │                             │
      ▼                             │
[LLM Processing]                    │
      │                             │
      ▼                             │ [Automated via CLI Tool]
[GitHub Integration]                │
      │                             │
      ▼                             │
[GitHub Actions/CI]                 │
      │                             │
      ▼                             │
[Cloudflare Pages]                  │
      │                             │
      └─────────────────────────────┘
```

It cut out most of the manual work, letting me focus on the writing part only. It also let me do everything from the command line. The tool is packaged and installed, so it can be called from any directory. It doesn't require you to open a code base or any IDE. To write, I have used the `$EDITOR` variable set in bashrc file of the system, which is used to open a temp page to write the blog. Completely removed manual update of Hugo repository by calling GitHub APIs via PAT. Deployment is still taken care of by GitHub itself.

## The LLM Component

As I discussed, this automation has a very important AI/LLM component. The component is only called when your blog is finished. You can use the in-tool editor or write separately and paste it into the in-tool editor to process your blogs. The component is **not built for generating blogs on title itself** - it will take your article as user prompts and add additional context from system prompt to improve upon your writing without changing it. It checks for spelling errors, grammar, and adds markdown semantics - so the writer can focus on just writing. For example: adding semantic tags in markdown or breaking a chain of thought into paragraphs. It doesn't add or cut your article. Although I have given user prompt enough freedom to change your input if the user explicitly asks. For example: if you add "make it shorter" - it will, but that's up to the writer - I'm not doing that.

## Technical design

LLM is called via API calls - with BYOK capability. API call is generic and can be used with any Model/Offering/Service. Currently, I am using APIs from OpenRouter. GitHub Integration is a bit tighter but very easy to change if you are using GitLab or Bitbucket.

## Some constraints

It's a CLI tool because I like CLI tools over web UI or desktop apps. No other reason. This could have been a web app, but then I might have never used it. It's also built entirely for Bash. If a writer wants to run this on Windows - the best way to do it is on WSL. It's not packaged for distribution - primarily because it's a personal tool. Also, you need to pass on env variables for GitHub, LLM token, API keys, author name, etc. I may distribute this via GitHub at some point, but I'm not thinking about that currently. You can run this locally by following steps in Readme, but you need to install Bun Runtime.

Here is the system prompt 
```json
 [
      {
        role: "system",
        content: `Transform the following raw thoughts into a well-structured blog post in Markdown format.
- Correct grammar and sentence structure
- Improve readability and flow
- Add appropriate headings (H2, H3) for sections
- Preserve the user's original writing style and vocabulary
- DO NOT add new content or expand beyond what's provided
- DO NOT change the meaning or intent of the original text
- Use Markdown syntax for formatting
- Keep the tone consistent with the original`,
      },
      {
        role: "user",
        content: prompt,
      },
]
```

## Blog-cli Development tools

The utility is using Bun with TypeScript - reasons: Bun is fast and mostly because it's fun. Bun is a drop-in Node replacement, which helps as I used the commander npm package to write the CLI. I used OpenCode with GLM 4.7 as my coding agent and for review and tweaking - I used my brain (Sorry, I also heavily dislike vibe coding as well) :)

## Results

Time I have cut on the end-to-end process is about 70%. This is not arbitrary - I timed myself doing the process manually vs automated. I focus more on thoughts and less on semantics. I enjoy writing more and am expecting to produce more pieces this year than ever before.

## Final Thoughts

AI is a great tool if used correctly - here I use it to help me do mundane repetitive steps and not the actual thinking and writing part. It can easily become a crutch if you are not disciplined.

Thanks for reading - my blog and utility are open to read, and links are provided for both. As it is a personal project, I won't be able to let you update the main branch - you can reach out if you want to contribute - happy to have a conversation :)
