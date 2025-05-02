---
title: Brief Notes on GenAI from April
author: Shashank Shekhar
date: 2025-05-02
---

![headline image](/notesonai.png "Note taking with AI")

## 1 · Machine–Learning Model Taxonomy

### 1.1 Discriminative vs Generative

- **Discriminative models** learn the conditional distribution $P(y\mid x)$ to **separate** classes.

  - *Primary use* · classification/regression.
  - *Typical nature* · often deterministic at inference.
  - *Examples* · Logistic Regression, SVM, plain Feed‑forward NNs, ResNet‑like CNNs.

- **Generative models** learn the joint distribution $P(x,y)=P(x\mid y)P(y)$ and can **synthesize new x**.

  - *Primary use* · both classification **and** data generation/simulation.
  - *Typical nature* · probabilistic/stochastic.
  - *Examples* · Naïve Bayes, Hidden Markov Models, GANs, VAEs, Diffusion models.

| Aspect   | Discriminative      | Generative                      |
| -------- | ------------------- | ------------------------------- |
| Learns   | $P(y\mid x)$        | $P(x,y)$ or $P(x\mid y)P(y)$    |
| Produces | Class label / score | Sample, likelihood **or** label |
| Strength | Decision boundaries | Full data distribution          |
| Weakness | Needs labelled data | Harder to train/scale           |

### 1.2 Deterministic vs Probabilistic

| Aspect   | Deterministic                            | Probabilistic                                                |
| -------- | ---------------------------------------- | ------------------------------------------------------------ |
| Output   | Same value for same input                | Distribution or random sample                                |
| Pros     | Fast, predictable                        | Express uncertainty, robust to missing data                  |
| Cons     | Ignores uncertainty                      | More compute, stochastic results                             |
| Examples | Decision‑Tree inference, SVM, frozen CNN | Naïve Bayes, Gaussian Mixture, Bayesian Network, VAE decoder |

---

## 2 · Vectors & Modalities

### 2.1 Vectors (Embeddings)

*Definition* · Numeric representations that encode the semantics of entities (words, images, users …).

- Enable similarity search (`cosine`, `dot`), clustering, recommendation, retrieval‑augmented generation.
- Learned via Word2Vec, GloVe, fastText, BERT, CLIP, etc.

### 2.2 Modal vs Multimodal

- **Modal** = one input type (text _or_ image _or_ audio).
- **Multimodal** = multiple types jointly (e.g., image + caption).

  - Rising trend: vision–language models (e.g., GPT‑4V, Gemini), audio‑text (e.g., Whisper), video‑text.

### 2.3 Neural Language Models

Large neural nets pretrained on text with **self‑supervised** objectives.

- Families: **GPT‑n** (decoder‑only), **BERT** (encoder‑only), **T5 / BART** (encoder‑decoder), **LLaMA** series.
- Tasks: text generation, summarization, translation, code completion, search ranking.

---

## 3 · Transformer Family

### 3.1 Core Architecture  (“Attention is All You Need”, 2017)

1. **Input embeddings + positional encodings**.
2. Repeated *N* × blocks:

   - Multi‑head _self‑attention_  → Add & LayerNorm.
   - Position‑wise Feed‑Forward NN  → Add & LayerNorm.

3. (Decoder adds masked self‑attention + cross‑attention to encoder outputs.)

### 3.2 Self‑Attention (Quick Intuition)

Each token forms a **Query (Q)** vector that is matched against **Keys (K)** of every token; the similarities weight the **Values (V)** to build a context‑aware representation.

### 3.3 Transformer Variants

| Variant             | Architecture    | Flagship Models   | Typical Tasks                  |
| ------------------- | --------------- | ----------------- | ------------------------------ |
| **Encoder‑only**    | Auto‑encoding   | BERT, RoBERTa     | Classification, QA, embeddings |
| **Decoder‑only**    | Auto‑regressive | GPT, LLaMA‑2 Chat | Text/code generation           |
| **Encoder‑Decoder** | Seq‑to‑Seq      | T5, BART, Pegasus | Translation, summarization     |

### 3.4 Language‑Modeling Objectives

| Objective           | Context Used                         | Predicts      | Archetype       |
| ------------------- | ------------------------------------ | ------------- | --------------- |
| Masked (MLM)        | Bidirectional                        | Masked tokens | BERT            |
| Autoregressive (AR) | Left‑to‑right (or right‑to‑left)     | Next token    | GPT             |
| Prefix LM           | Past tokens (unmasked) + full prefix | Next token    | T5 pre‑training |

---

## 4 · Learning Paradigms

| Paradigm            | Labels           | Model Learns                  | Canonical Example          |
| ------------------- | ---------------- | ----------------------------- | -------------------------- |
| **Supervised**      | Explicit         | Map _x → y_                   | ImageNet classification    |
| **Unsupervised**    | None             | Structure of _x_              | Word2Vec, PCA, clustering  |
| **Self‑Supervised** | Labels from data | Predict masked / future parts | GPT pre‑training, BERT MLM |

---

## 5 · Model Adaptation & Fine‑Tuning

| Technique                    | Data Need               | Compute   | Brief                                    |
| ---------------------------- | ----------------------- | --------- | ---------------------------------------- |
| Prompt Engineering           | None (zero‑shot)        | –         | Steer behavior via instructions/examples |
| Supervised Fine‑Tuning (SFT) | Labelled pairs          | High      | Adjust all weights to task domain        |
| **LoRA / Adapters**          | Labelled pairs          | Low–Med   | Train tiny rank‑update layers; mergeable |
| RLHF                         | Human preference scores | Very High | Align model to helpful/safe outputs      |

---

## 6 · Prompt Engineering

### 6.1 Anatomy of a Good Prompt

**Instruction → Context → Input → Output‑format → Tone/Role**

### 6.2 Prompting Techniques

| Technique                 | Best For                  | Key Idea                                |
| ------------------------- | ------------------------- | --------------------------------------- |
| Zero‑Shot                 | Simple, common tasks      | Ask directly                            |
| Few‑Shot                  | Pattern imitation         | Give 2–5 exemplars                      |
| Chain‑of‑Thought          | Reasoning/maths           | “Let’s think step by step”              |
| Self‑Consistency          | Reliable CoT answer       | Sample K reasoning paths, majority vote |
| ReAct                     | Tool‑using agents         | Interleave reasoning & external actions |
| Tree‑of‑Thought           | Complex planning          | Explore multiple branches, backtrack    |
| Retrieval‑Augmented (RAG) | Factual or domain answers | Retrieve docs → feed as context         |

### 6.3 Security Concerns in Prompting

1. **Prompt injection / jailbreaks**
2. **Data leakage** (keys, PII)
3. **Prompt leakage** (system prompt exposure)
4. **Malicious content generation** (spam, phishing, code exploits)
5. **Token flooding / prompt DOS**

*Mitigations* · input sanitation, guardrail LLMs, content filters, max‑token limits, rate‑limits, red‑teaming.

---

## 7 · Foundation Models

Large, self‑supervised, general‑purpose models adaptable to many downstream tasks.

- **Examples** : GPT‑4 (text), CLIP (image+text), DALL·E (image), SAM (vision segmentation).
- **Benefits** : reuse, performance, economy of scale.
- **Risks** : bias, compute cost, ecological footprint, opacity.

---

## 8 · Scaling Laws & Emergent Abilities

- Empirical power‑law links between loss ↔ parameters, data, compute (OpenAI, DeepMind).
- **Emergence** : qualitative jumps (few‑shot learning, tool use) above certain scale (≈10 B+, 100 B+ params).
- **Implications** : unpredictable behaviours, but strong generalization—drives interest in alignment & evals.

---

## 9 · Variational Autoencoder (VAE) — Quick Recap

1. **Encoder** → μ, σ² (latent distribution).
2. **Reparameterization trick** → sample *z*.
3. **Decoder** → reconstruct/generate _x̂_.
4. **Loss** = Reconstruction Loss + KL‑Divergence( q(z|x) ‖ N(0,1) ).

| Strength            | Why It Matters                   |
| ------------------- | -------------------------------- |
| Generative          | New images/text variants         |
| Smooth latent space | Interpolation, arithmetic        |
| Structured          | Semi‑supervised & controllable   |
| Stable training     | No adversarial collapse (vs GAN) |

---

## 10 · Quick Cheat‑Sheet — Which Technique When?

- **Need a fast tweak?** → Prompt Engineering.
- **Domain‑specific answers?** → SFT or LoRA.
- **Politeness / helpfulness?** → RLHF.
- **Up‑to‑date factuality?** → RAG.
- **Creative image/text synthesis?** → Diffusion, VAE, GAN.

---
