---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "Nutty Motion Filter"
subtitle: ""
summary: ""
authors: []
tags: [robotanimation,charanimation]
categories: []
date: 2021-01-30T19:34:27Z
lastmod: 2021-01-30T19:34:27Z
featured: true
draft: true
toc: true

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ""
  focal_point: ""
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---
When working with animation - be it **virtual or robotic**, *character*- or *object*-wise, we commonly run into the need for **interpolation** techniques.
Choosing your techniques depends on the definition of your problem, as in:
* Does it run in *realtime* or *offline*?
* Do you need to blend between *animations*, or *poses* or *both*?
* Is it a *one-time* runner, or do you *continuously* want to keep driving the motion towards a *target*?

All these questions apply especially when you are working with **procedural animation**, i.e., one that is generated *on-the-fly* based on given parameters, which may be changing over time.

In that case you typically need it to run in *realtime*, and the motion can either be *continuously* generated from a **mathematical formulation** (e.g. *sine-waves*), **algorithmic formulation** (e.g. *inverse kinematics*) or to be the result of mixing pre-designed **static poses** and **animations** that should elegantly **blend** and **transition** together.

The **Nutty Motion Filter**[^1] (NMF) was created to work as a **motion interpolation** method that is especially directed at such **procedural animation** applications.
It can be applied anywhere in a motion generation pipeline (*typically at the end*) to a **discrete** and **non-continuous** *motion signal driver*, and outputs a C<sup>0</sup>, C<sup>1</sup> or C<sup>2</sup> **continuous motion signal** as a result, depending on the ***order*** of the filter that is used.

# Online Demo


# Definitions


# Examples

[^1]: The full description and specification of the NMF can be found at {{< cite page="/publication/ribeiro-2019-arxiv-nutty-animation" view="4" >}}