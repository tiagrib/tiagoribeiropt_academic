---
# Leave the homepage title empty to use the site title
title: ''
date: 2024-05-14
type: landing

sections:
  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
  - block: skills
    id: skills
    content:
      title: Skills
      text: ''
      # Choose a user to display skills from (a folder name within `content/authors/`)
      username: admin
    design:
      columns: '3'
  - block: experience
    id: xp
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Experiences.
      #   Add/remove as many `experience` items below as you like.
      #   Required fields are `title`, `company`, and `date_start`.
      #   Leave `date_end` empty if it's your current employer.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - title: '**Consultor & Advisor in Artificial Intelligence**'
          gradient_start: '#4bb4e3'
          gradient_end: '#2b94c3'
          location: 'based in Lisbon, Portugal. Available remotely to anywhere.'
          date_start: '2024-05-08'
          date_end: ''
          description: |2-
            Available for short-term consulting for companies and projects seeking advising and know-how on the adoption, application, and development of artificial intelligence and AI-driven mechanisms to enable their products and solutions.

            In particular, I can provide expertise in the fields of:
            * Autonomous Digital Humans and Characters
            * Human-Robot Interaction
            * User Experience and Product Vision using AI technologies
            * Metaverse-directed applications
            * LLM adoption/integration, fine-tuning and local deployment

        - title: '**Principal Research Engineer, Autonomous Animation**'
          gradient_start: '#4bb4e3'
          gradient_end: '#2b94c3'
          company: 'Soul Machines'
          company_url: 'https://www.soulmachines.com/'
          location: 'Auckland, New Zealand (fully remote)'
          date_start: '2023-04-01'
          date_end: '2024-05-08'
          description: |2-
            **AGI company that provides Autonomous Digital People for a variety of markets**

              Focused on delivering product value through R&D that intersects the fields of computer graphics animation and artificial intelligence, including, but not limited to the use of Large Language Models (LLMs) and Generative AI within the context of interactive, autonomous behaviour and motion for full body virtual human characters. 
              In my vision, the success of this R&D lies in working together with an animation director.

              Within the challenge of creating new methods for real-time autonomous character animation that is based on the artist-CGI-AI triad, my responsabilities included:

              * Lead the technical and architectural development of the autonomous animation system.
              * Develop autonomous gesturing and social and emotional behaviours of digital people.
              * Participate in the product strategy with feedback from/to technology development.
              * Work with artists to ensure the animated motion looks natural and is fail-safe.
              * Invent mechanisms that enable autonomous animation of digital characters.
              * Create pipelines and workflows that allow to train, evaluate and integrate ML models (e.g. LLMs, GenAI) for animation
              * Promote, support and lead the transfer of research into product.
              * Establish directives for autonomous behaviour design and selection.
              * Provide guidelines for expressive behaviour of emotion and personality.
              * Define instruments to measure animate and interactive qualities of autonomous digital characters.
        - title: AI Animation Scientist & Senior Researcher II
          company: Soul Machines
          company_url: 'https://www.soulmachines.com/'
          location: 'Auckland, New Zealand (fully remote)'
          date_start: '2020-01-20'
          date_end: '2023-03-31'
          description: |-
            **AGI company that provides Autonomous Digital People for a variety of markets**


              Responsibilities include:
              
              * Design and develop the skeletal animation system.
              * Develop autonomous gesturing and social and emotional behaviours of digital people.
              * Work with artists to ensure the animated motion looks natural and is fail-safe.
              * Invent mechanisms that enable autonomous animation of digital characters.
              * Establish directives for autonomous behaviour design and selection.
              * Provide guidelines for expressive behaviour of emotion and personality.
              * Define instruments to measure animate and interactive qualities of autonomous digital characters.
        - title: Data Scientist &amp; Data Pipeline Engineer
          company: kencko foods
          company_url: 'https://www.kencko.com/'
          location: 'Lisbon, Portugal (partially remote)'
          date_start: '2019-01-04'
          date_end: '2019-11-30'
          description: >
            **Smart food company**
              
            * Created custom ETL pipeline using Python from various sources into Google
            BigQuery.

            * Datascience tasks using Google's BigQuery SQL, DataStudio and Spreadsheets. 
        - title: HRI Architecture Consultor
          company: Högskolan Väst (University West)
          company_url: 'https://www.researchgate.net/project/START-Student-Tutor-And-Robot-Tutee'
          location: 'Trollhättan, Sweden (remote)'
          date_start: '2018-09-01'
          date_end: '2018-09-30'
          description: >
            **University College**

            Provided consulting on the HRI architecture aimed at the use of the NAO and
            Pepper robots
        - title: Robot Animation &amp; Unreal Engine Developer
          company: Gagosian Gallery
          company_url: 'https://gagosian.com/exhibitions/2018/urs-fischer-play/'
          location: 'Brooklyn & New York City, USA (partially remote)'
          date_start: '2017-12-01'
          date_end: '2018-03-31'
          description: >-
            **Contemporary Art Gallery**

            Exhibition 'PLAY', conceived by the NYC-based artists Urs Fischer, with
            Madeline Hollander

            Provided consulting on Robot Animation, development of robot animation tools
            (Maya, Houdini), and development of interactive behaviour simulation in Unreal
            Engine. 
        - title: Technical Direction
          company: 'GAIPS, INESC-ID'
          company_url: 'http://gaips.inesc-id.pt/'
          location: 'Lisbon and Oeiras, Portugal'
          date_start: '2011-02-01'
          date_end: '2017-11-30'
          description: |
            **Reseach Lab**

            * Developed an HRI platform for various projects and robots
            * Provided guidance and assistance to various MSc and PhD student project
        - title: Research Assistant
          company: 'EMOTE EU FP7 Project @ GAIPS, INESC-ID'
          company_url: 'http://www.emote-project.eu/'
          location: 'Lisbon and Oeiras, Portugal'
          date_start: '2011-02-01'
          date_end: '2017-11-30'
          description: |
            **Embodied Perceptive Tutors for Empathy-Based Learning**

            * Research Assistant
            * Architecture Design & Development,
            * Behaviour Management & Animation
        - title: Research Assistant
          company: 'LiREC EU FP7 Project @ GAIPS, INESC-ID'
          company_url: 'http://www.lirec.eu/'
          location: 'Lisbon and Oeiras, Portugal'
          date_start: '2011-02-01'
          date_end: '2017-11-30'
          description: |
            **LIving with Robots and Embodied Companions**

            * Research Assistant
            * Robot Animation System

    design:
      columns: '2'
  - block: portfolio
    id: projects
    content:
      title: Projects
      filters:
        folders:
          - project
      # Default filter index (e.g. 0 corresponds to the first `filter_button` instance below).
      default_button_index: 0
      # Filter toolbar (optional).
      # Add or remove as many filters (`filter_button` instances) as you like.
      # To show all items, set `tag` to "*".
      # To filter by a specific tag, set `tag` to an existing tag name.
      # To remove the toolbar, delete the entire `filter_button` block.
      buttons:
        - name: All
          tag: '*'
        - name: Robots
          tag: Robots
        - name: EU Research
          tag: EUResearch
        - name: Software
          tag: Software
        - name: Interactive Art
          tag: Art
    design:
      # Choose how many columns the section has. Valid values: '1' or '2'.
      columns: '2'
      view: compact
      # For Showcase view, flip alternate rows?
      flip_alt_rows: false
  - block: collection
    id: posts
    content:
      title: Recent Posts
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - post
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: compact
      columns: '2'
  - block: collection
    id: featured
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      columns: '2'
      view: citation
  # - block: collection
  #   content:
  #     title: Recent Publications
  #     text: |-
  #       {{% callout note %}}
  #       Quickly discover relevant content by [filtering publications](./publication/).
  #       {{% /callout %}}
  #     filters:
  #       folders:
  #         - publication
  #       exclude_featured: true
  #   design:
  #     columns: '2'
  #     view: citation
  - block: tag_cloud
    content:
      title: Popular Topics
    design:
      columns: '2'
  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        If you wish to inquiry mean about consulting and advising services, or just to network and connect, please use the submission form below, or contact me directly using the e-mail address provided.
        Alternatively, reach out directly on social media platform such as LinkedIn or X (Twitter).
      # Contact (add or remove contact options as necessary)
      email: me@tiagoribeiro.pt
      # Automatically link email and phone or display as text?
      autolink: true
      # Email form provider
      form:
        provider: netlify
        formspree:
          id:
        netlify:
          # Enable CAPTCHA challenge to reduce spam?
          captcha: true
    design:
      columns: '2'
---
