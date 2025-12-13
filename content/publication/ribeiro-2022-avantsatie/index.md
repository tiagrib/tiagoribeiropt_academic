---
# Documentation: https://wowchemy.com/docs/managing-content/

title: Avant-Satie! Using ERIK to encode task-relevant expressivity into the animation
  of autonomous social robots
subtitle: ''
summary: ''
authors:
- Tiago Ribeiro
- Ana Paiva
tags: []
categories: []
date: '2022-01-01'
lastmod: 2022-03-02T15:33:39Z
featured: true
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder.
# Focal points: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight.
image:
  caption: ''
  focal_point: ''
  preview_only: false

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
publishDate: '2022-03-02T15:33:39.118930Z'
publication_types:
- '2'
abstract: ''
publication: '*arXiv preprint arXiv:TBD*'
---
{{% video src="https://www.youtube.com/watch?v=sxBeKxnPoCs" controls="yes" %}}

**ABSTRACT**

ERIK is an expressive inverse kinematics technique that has been previously presented and evaluated both algorithmically and in a limited user-interaction scenario. It allows autonomous social robots to convey posture-based expressive information while gaze-tracking users. We have developed a new scenario aimed at further validating some of the unsupported claims from the previous scenario. Our experiment features a fully autonomous Adelino robot, and concludes that ERIK can be used to direct a user’s choice of actions during execution of a given task, fully through its non-verbal expressive queues.

**SUMMARY**

AvantSatie! is a game that requires players to discover a sequence of notes that corresponded to a short piece of a classical theme. They would have to just step on the keys until they figured it out. 

Their only assistance was a screen that only advanced when they got it, plus Adelino who would provide fully nonverbal cues by shaping its posture positively or negatively in order to convey a "warm-cold" hint. It would do so while tracking the user (old Kinect v2!), and this was performed using ERIK (C-ERIK condition) on Nutty Tracks, which also allowed it to switch between IK and FK mode to perform some additional animation (turn to face screen, "yes"..).

I also compared it to an example-based pose interpolation synthesis (C-EBPS) which performed similar to the IK except that I had to first create dozens of poses for each of the expression [positive, neutral, negative] x [12x horizontal] x [6x vertical directions].

Participants in both conditions performed significantly better than the control one where everything was exactly the same including the autonomous robot behaviour except that it didn't provide the nonverbal hints using its body.