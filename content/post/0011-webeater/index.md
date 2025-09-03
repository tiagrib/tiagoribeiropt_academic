---
# Documentation: https://wowchemy.com/docs/managing-content/

title: Webeater
subtitle: "Quick out of the box web content extractor in Python aimed at AI agents."
summary: "Quick out of the box web content extractor in Python aimed at AI agents."
authors: []
tags: [random-topics]
categories: []
date: 2025-09-01T00:00:00Z
lastmod: 2025-09-01T00:00:00Z
featured: false
draft: false
projects: []

# Featured image
# To use, place an image named `featured.jpg/png` in your page's folder.
# Placement options: 1 = Full column width, 2 = Out-set, 3 = Screen-width
# Focal point options: Smart, Center, TopLeft, Top, TopRight, Left, Right, BottomLeft, Bottom, BottomRight
# Set `preview_only` to `true` to just use the image for thumbnails.
image:
  placement: 1
  caption: 'Webeater - The web content extractor for AI agents'
  focal_point: 'Center'
  preview_only: true
  alt_text: 'Webeater - The web content extractor for AI agents'
---
<a href="featured.png" target="_blank">
  <img src="featured.png" alt="Webeater - The web content extractor for AI agents" style="cursor: pointer; max-width: 200px;">
</a>
<p style="text-align: center; font-style: italic; font-size: 0.9em; color: #666; margin-top: 10px;">
Webeater - A Python easy web content extractor.
</p>

---
Webeater Github Repo:\
https://github.com/tiagrib/webeater
---


During the past few months I've been dedicating some time to explore some neurosymbolic approaches to AI agents that I could run locally *(which I'll save for a future post)*.\
One of the tools I immediately needed was web search, as a simple method call straight from Python.\
It was quite easy to search on google or on wikipedia, or even extract content from wikipedia directly using its API.\
Turn out, however, that extracting live content from random websites was neither as simple nor efficient.

-- *cut to the chase* --

After searching for Python libs that could just do it for me, I found myself having to code my own solution using **Selenium** and **BeautifulSoup**.\
I've split out the code and cleaned it up slightly and have published it as ***Webeater***. 

**WebEater** is a web content extraction tool designed to fetch and process web pages easily and quickly from Python.\
It is made for **developers and researchers** who need to extract structured data from web pages in order to create datasets or feed them directly to AI agents and LLMs.\
The tool goes straight to the point, focusing on extracting text and structured data from web pages,
while providing some additional configurations and hits for better effectiveness.

It's still at an early stage, so will surely not cover every single edge cases or complex scenarios.\
I'll welcome contributions and feedback to help improve its capabilities.

## Features
- Fetches web pages and extracts text content into Markdown format.
- Return clean, plain text or a JSON object optionally containing lists of images and links found on the page.
- Handles JavaScript-heavy pages using Selenium and BeautifulSoup
