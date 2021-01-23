---
title: Nutty Tracks
subtitle: www.nuttytracks.com
summary: '2013-<br>Programmable symbolic animation system for robot animation.'
tags:
- Software
date: "2021-01-23T00:00:00Z"


image:
  caption: © Tiago Ribeiro
  focal_point: Smart

# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides: ""
---
**Nutty** is a symbolic animation engine based on CGI methods that allows to animate both virtual and robotic characters. It is simultaneously a design-time and run-time environment, both for designing and programming animation, as well as to execute it in real-time during interaction. It runs either standalone, or as a plug-in, for which we currently support Autodesk 3dsmax. 

[Original paper from SIGGRAPH'13](https://dl.acm.org/citation.cfm?id=2503394)

{{< figure src="nutty_screenshot.png" title="A screenshot of Nutty Tracks featuring the Adelino robot." >}}
{{< vimeo 67197221 >}}




Using Nutty provides us with high flexibility regarding the design, blending and modulation of animations on any robot.
It allows to use professional animation tools (e.g. Autodesk 3ds Max4) to design animations and postures, and provides a generic translation layer between the character’s animation parameters and the actions and parameters that arrive from other components in the system.
One of the principles of Nutty is to work on animation at a symbolic level. This means that while the system is aware of the structural hierarchy of the robot, its animation isn’t processed at the level of the actual joints, but on symbolic joints. These symbolic joints can actually be mapped to a real robotic joint, or to a set of joints, thus working as an aggregated joint (e.g. we can animate a 1-DoF joint called VerticalGaze which is later decomposed into several real motors of the real robot’s neck).
The composing of animation programs in the Nutty Tracks GUI follows a box-flow type of interface greatly inspired in other programming tools commonly used by artists, such as the Unreal Engine/Development Kit (UE/UDK), Pure Data or Houdini.
Animation Controllers (ACs) are connected into a chain of execution that generates and composes animation either procedurally or using animations and postures that were pre-designed (e.g. with Autodesk 3ds Max). These chains of ACs are further composed into a hierarchy of layers that can be activated and deactivated during interaction in order to either blend or override their animated degrees-of-freedom with each other.

{{< vimeo 155593476 >}}

Using Nutty provides us with high flexibility regarding the design, blending and modulation of animations on any robot.
It allows to use professional animation tools (e.g. Autodesk 3ds Max4) to design animations and postures, and provides a generic translation layer between the character’s animation parameters and the actions and parameters that arrive from other components in the system.
One of the principles of Nutty is to work on animation at a symbolic level. This means that while the system is aware of the structural hierarchy of the robot, its animation isn’t processed at the level of the actual joints, but on symbolic joints. These symbolic joints can actually be mapped to a real robotic joint, or to a set of joints, thus working as an aggregated joint (e.g. we can animate a 1-DoF joint called VerticalGaze which is later decomposed into several real motors of the real robot’s neck).
The composing of animation programs in the Nutty Tracks GUI follows a box-flow type of interface greatly inspired in other programming tools commonly used by artists, such as the Unreal Engine/Development Kit (UE/UDK), Pure Data or Houdini.
Animation Controllers (ACs) are connected into a chain of execution that generates and composes animation either procedurally or using animations and postures that were pre-designed (e.g. with Autodesk 3ds Max). These chains of ACs are further composed into a hierarchy of layers that can be activated and deactivated during interaction in order to either blend or override their animated degrees-of-freedom with each other.