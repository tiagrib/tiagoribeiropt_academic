---
title: Adelino
subtitle: A craft robot I built and design to support my PhD thesis.
summary: '2017<br>A craft robot I built and design to support my PhD thesis.'
tags:
- Robots
date: "2021-01-23T00:00:00Z"
date: "2021-01-23T00:00:00Z"

# Optional external URL for project (replaces project detail page).
external_link: ""

# Featured image
# To use, place an image named `featured.jpg/png` in your page's folder.
# Placement options: 1 = Full column width, 2 = Out-set, 3 = Screen-width
# Focal point options: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight
# Set `preview_only` to `true` to just use the image for thumbnails.
image:
  placement: 1
  caption: "Adelino, the craft robot"
  focal_point: "Center"
  preview_only: false
  alt_text: The Adelino Robot.


# Slides (optional).
#   Associate this project with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides = "example-slides"` references `content/slides/example-slides.md`.
#   Otherwise, set `slides = ""`.
slides: ""
---

Adelino is a craft robot, that was built using wood and hobby-grade servos, to demonstrate how well the Nutty Tracks and ERIK can perform even on a low-fidelity robot.

{{< figure src="adelino_poses.jpg" title="The Adelino robot, in four different expressive postures. The top row shows front views of each posture. Under each is the corresponding side view." >}}
{{< vimeo 232300140 >}}
*Demonstration of the ERIK Expressive Kinematics technique with Adelino
(published in the ACM International Conference in Multi-modal Interaction, ICMI’17)*



Following on *Hoffman & Ju, 2014*, we started by designing the concept of the robot using 3d animation software.
The robot was designed as a line shape, as it is common for traditional and 3D animators to start their learning process by animating lines of action.
These lines of action are “the first line indicated in a pose, that shows the basic overall posture, prior to adding the rest of the details” (*Goldberg, 2008*).
The lines are used to design the attitude poses of a character – ones “that convey what a character is feeling while he’s moving”.
We can think of the line of action of a humanoid character to be its spine, grounded by its dominant leg.
Based on this concept, we created a robotic line of action, with a minimum amount of degrees of freedom (DoFs).
We added however, a face-like tip on the line in order to allow it to express gazing behaviour.
After our design concept phase, during which we tested some 3D animations with the character, we settled with five DoFs.
In order to overcome typical low-end servos’ limitations of rotating only 90 degrees to each side, the head was changed to be nearly symmetric along its vertical axis.
Instead of having a front or back side, depending on the target posture and gaze direction, the robot could twist and turn upon itself, using the head upside down, while still having the same appearance.

{{< figure src="adelino_concept-768x452.png" title="The concept design of the Adelino robot. It was initially modelled and animated using 3D animation software, to explore the size and placement of each segment and articulation, in order to maximize its expressive capabilities." >}}


### References

Eric Goldberg. 2008. **Character Animation Crash Course!** *Silman-James Press*, ISBN 978-1-879505-97-1.

Guy Hoffman and Wendy Ju. 2014. **Designing Robots With Movement in Mind.** *Journal of Human-Robot Interaction, Vol. 3, Issue 1 (February 2014)*, 91-122.https://doi.org/10.5898/JHRI.3.1.Hoffman