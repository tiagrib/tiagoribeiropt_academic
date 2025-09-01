---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Language and token atomicity"
subtitle: "We need more representation, not more context"
summary: "We need more representation, not more context"
authors: []
tags: [random-topics]
categories: []
date: 2025-07-01T10:00:00Z
lastmod: 2025-07-01T10:00:00Z
featured: false
draft: false
preview_only: true
projects: []
---
---
> *Extended from original post on [LinkedIn](https://www.linkedin.com/posts/tiagrib_inventing-new-things-requires-a-type-of-activity-7309922684568535040-swZx) as a quoted repost of [Alex Kantrowitz](https://www.linkedin.com/in/alexkantrowitz)'s [post on his interview with Yann LeCun](https://www.linkedin.com/posts/alexkantrowitz_inventing-new-things-requires-a-type-of-activity-7308491556112551936-6Obf).*
---
Human-level AI requires much more than just language.\
LLMs are limited to understanding semantic relationships between words.\
These relationships are used as probabilistic operators which, at scale, and trained on different data, allow them to be used as general-purpose computers (not so well) or on task-specific computers (better), but always with the requirements that the task gets translated into written language.\
Thus their ability to operate remains at the atomicity of a"word" (token) which is not what we sense as the atomicity of "human-level AI".

There are two main evolutions that must take place:
- 1️⃣ The atomicity must allow for **non-linguistic representations**, which we already find in multimodal models.\
These are paving the way in the right direction by allowing to transfer representations between word-tokens and non-word tokens.
    - ❗ However a truly multi-modal model must be able to capture and represent these **mixed word-non-word representations together**, and not just perform as a mixture-of-experts of each modality that then fuse their outputs into a common latent space.

<br>

- 2️⃣ The **architecture** of the networks must evolve: we're stuck in encoder-decoder sequences.\
That's not really how our brain works, and we need to get back into our own brain to gather inspiration for how knowledge and reasoning take place to generate behaviour.
    - **❗Context windows must go**. Imagine a person that can only watch a 10-second movie clip, or listen to a 30-second long piece of audio before they have a breakdown. This would be a dramatic change. The attention mechanism, which brought us LLMs in the first place, is actually related to this limitation. It's not just a "scalable" limitation, it's the NEED for the attention mechanism to look at all the input tokens that is the real limitation.
    - ❗We need AI models that can process inputs and generate outputs in a **continuous loop**, which would fit more properly into a cognitive architecture, and allow the agent to process e.g. user and scene perception continuously, while generating or maintaining behaviour execution.