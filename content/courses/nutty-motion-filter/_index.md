---
# Course title, summary, and position.
title: Nutty Motion Filter
linktitle: Nutty Motion Filter
tags: [software,robotanimation,charanimation]
summary: Realtime motion filter especially designed for procedural animation of virtual or robotic characters.<br>Read more about it and learn how to use it here.
weight: 1

date: "2018-09-09T00:00:00Z"
lastmod: "2018-09-09T00:00:00Z"
draft: false  # Is this a draft? true/false
toc: true  # Show table of contents? true/false
type: book  # Do not modify.

image:
  placement: 4
  caption: "Photo by [Geo](https://github.com/gcushen/)"
  focal_point: "Center"
  preview_only: true
  alt_text: An optional description of the image for screen readers.

# Add menu entry to sidebar.
# - name: Declare this menu item as a parent with ID `name`.
# - weight: Position of link in menu.
menu:
  example:
    name: Nutty Motion Filter
    weight: 1

---
<big>An *on-the-fly* motion interpolation technique.

> Given an **input target** value, the NMF **smoothly** and **continuosly** interpolates the output to that target value, while providing some **parameters** that allow to customize the **look and feel** of the resulting motion.</big>

<big>*It can be used both with **angles** (e.g. robot or humanoid joints)<br> or with **motion in space** (e.g. mobile robots).*</big>

<video autoplay loop muted playsinline>
  <source src="/courses/nutty-motion-filter/nmf_demo1.mp4" type="video/mp4">
</video>

When working with animation - be it **virtual or robotic**, *character*- or *object*-wise, we commonly run into the need for **interpolation** techniques to stitch together different pieces of motion or poses in order to form a **smooth and continuous** behaviour.
Choosing your motion interpolation techniques depends on the definition of your problem, as in:
* Does it run in ***realtime*** or ***offline***?
* Do you need to interpolate between ***animations***, ***poses*** or ***both***?
* Is it a ***one-time*** runner, or do you ***continuously*** want to keep driving the motion towards a ***target***?

All these questions apply especially when you are working with **procedural animation**, i.e., one that is generated *on-the-fly* based on given parameters, which may be changing over time.

In that case you typically need it to run in **realtime**, and the motion can either be **continuously** generated from a **mathematical formulation** (e.g. *sine-waves*), **algorithmic formulation** (e.g. *inverse kinematics*) or to be the result of mixing pre-designed **static poses** and **animations** that should elegantly **blend** and **transition** together.

The **Nutty Motion Filter**[^1] (NMF) was created to work as a **motion interpolation** method that is especially directed at such **procedural animation** applications.
It can be applied anywhere in a motion generation pipeline (*typically at the end*) to a **discrete** and **non-continuous** *motion signal driver*, and outputs a C<sup>0</sup>, C<sup>1</sup> or C<sup>2</sup> **continuous motion signal** as a result, depending on the ***order*** of the filter that is used.

Because it is, in its essence, a ***signal-processing algorithm***, it can be used either to control the **angular position** of a given **joint or motor**, or the **position** of a **mobile object or robot** in space.

[^1]: The full description and specification of the NMF can be found at {{< cite page="/publication/ribeiro-2019-arxiv-nutty-animation" view="4" >}}
