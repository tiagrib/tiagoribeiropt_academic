---
# Documentation: https://wowchemy.com/docs/managing-content/

title: "ROI on R&D"
subtitle: "Is R&D in an AI company an expense or an investment?"
summary: "Is R&D in an AI company an expense or an investment?"
authors: []
tags: [random-topics]
categories: []
date: 2025-08-23T10:00:00Z
lastmod: 2025-08-23T10:00:00Z
featured: false
draft: false
preview_only: true
projects: []
---
<p style="text-align: center; font-style: italic; font-size: 0.9em; color: #666; margin-top: 10px;">
Screenshot captured from https://www.youtube.com/watch?v=Q2I7u0tjlJs on Aug 23, 2025 from paper 'VMP: Versatile Motion Priors for Robustly Tracking Motion on Physical Characters'. Cost was added by me.
</p>

---
> *Extended from original post on [LinkedIn](https://www.linkedin.com/posts/tiagrib_i-was-checking-a-paper-by-disney-research-activity-7364229310439657473-08uz).*
---

I was checking a paper by Disney Research<sup>[1](#ref1)</sup> about training a control policy for full-body kinematic motion, and saw this comparison on the video: Our vs CALM (SOTA).


So I looked up the cost of cloud computing for 3 days with an RTX 4090 and 2 weeks with an A100 on ***getdeploying***<sup>[1](#ref1)</sup> and got these values: `$17` vs `$141`.


This was the cost of the training cycle of a motion model for robots using the newly developed method versus the previous state of the art.\
A drop to just `12%` of the original cost.\
This is why R&D is an **investment**, and not a cost. \
Of course it doesn't mean the company saves `$124`.\
It would save `$124` **on every iteration on this model** that would be necessary to ship a custom AI-driven feature to a client.\
That's your AI Product operational cost, and if you are developing AI-driven products, those won't be profitable without managing this bill.


Yet I've surprisingly heard things like *"investors don't like to hear about research"*. 
Like if they would only invest once you're ready to package and sale, because they don't want to jump onto something that "still needs research". 


Every tech needs research.\
Every tech that's currently on your computer or on your phone still needs research. \
Presenting a business plan without a deep research plan is like going on a 100 km hike wearing just "cool" branded clothes and no survival gear.\
Could it work?\
Well, maybe.\
If it's always sunny, and if you run into the right people and end up trekking with them.\
Just very very risky, especially in the current market where weather seem to shift almost daily.


My take is that a solid R&D vision and plan should always be developed and presented alongside the business vision and plan of any product, be it for a new startup pitch, to investors, or internally within a company's roadmap/quarterly planning meeting.


If an investor doesn't like to see your R&D plan, then that means
<ol type="a">
  <li>They need help understanding the technical landscape</li>
  <li>The investor seeks risk mitigation in a powerpoint instead of in your team</li>
  <li>Not the right investor for your current stage</li>
  <li>Ok or maybe you presented it very poorly</li>
</ol>


Because you never know what the investor thinks and you never want to lose opportunities, you must make sure to properly clarify this statement to them. \
Explain why an **AI product NEEDS a research roadmap**. \
Explain how it will not hold back any kind of quick MVP shipping and validation.\
That it will **not hold back GTM or monetization**.\
But instead, that it will ensure **FINANCIAL VIABILITY** of the business in the long run.\
That's something the investors do like to hear.


Of course, if you're bootstrapping - then it should become obvious to you that there's no clear distinction between your "dev" and your "R&D" team, at least for the first couple of years.


### References
<a name="ref1">1.</a> Agon Serifi, Ruben Grandia, Espen Knoop, Markus Gross, and Moritz Bächer. 2024. **VMP: Versatile Motion Priors for Robustly Tracking Motion on Physical Characters.** *In Proceedings of the ACM SIGGRAPH/Eurographics Symposium on Computer Animation (SCA '24)*. Eurographics Association, Goslar, DEU, 1–11. https://doi.org/10.1111/cgf.15175

<a name="ref1">1.</a> GetDeploying website: https://getdeploying.com/reference/cloud-gpu (last visited Aug 30, 2025)