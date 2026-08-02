---
title: Sobre Mim
date: 2026-07-23 10:24:00 Z
permalink: "/pt/sobre/"
language: pt
description: Saiba mais sobre Manuel Franklin, áreas de interesse e forma de trabalhar.
seo:
  title: Sobre Mim
  description: Saiba mais sobre Manuel Franklin, áreas de interesse e forma de trabalhar.
layout: page
---

{% assign i18n = site.data.i18n[page.language] %}
{% assign about = i18n.pages.about %}

<p>{{ about.intro_1 }}</p>

<p>{{ about.intro_2 }}</p>

<blockquote>
 <p><strong>{{ about.tldr_label }}:</strong> {{ about.tldr_text }}</p>
</blockquote>

<h2>{{ about.longer_heading }}</h2>

<p>{{ about.longer_1 }}</p>

<p>{{ about.longer_2 }}</p>

<p>{{ about.longer_3 }}</p>

<h2>{{ about.interests_heading }}</h2>

<ul>
  {% for item in about.interests_items %}
    <li>{{ item }}</li>
  {% endfor %}
</ul>

<p>{{ about.connect_text }}</p>

<p><strong>✉️ {{ about.email_label }}:</strong> <a href="mailto:{{site.footer-links.email}}">{{ about.email_value }}</a></p>
