---
title: Tags
permalink: "/tags/"
layout: default
language: en
---

{% assign tag_groups = site.tags | sort %}

<div class="archive-page">
  <header class="archive-header">
    <p class="archive-kicker">Blog</p>
    <h1>{{ page.title }}</h1>
    <p class="archive-description">Browse posts grouped by tag.</p>
  </header>

  {% if tag_groups.size > 0 %}
    <div class="archive-list">
      {% for tag_pair in tag_groups %}
        {% assign tag_name = tag_pair[0] %}
        {% assign tag_posts = tag_pair[1] | where_exp: "post", "post.language == page.language" | where_exp: "post", "post.published != false" %}
        {% if tag_posts.size > 0 %}
          <section class="archive-section" id="{{ tag_name | slugify }}">
            <h2>#{{ tag_name }}</h2>
            <ul>
              {% for post in tag_posts %}
                <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
              {% endfor %}
            </ul>
          </section>
        {% endif %}
      {% endfor %}
    </div>
  {% else %}
    <p>No tags have been published yet.</p>
  {% endif %}
</div>

<style>
  .archive-header {
    margin-bottom: 2rem;
  }

  .archive-kicker {
    margin: 0 0 0.4rem;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2563eb;
    font-weight: 700;
  }

  .archive-description {
    color: #64748b;
  }

  .archive-list {
    display: grid;
    gap: 1rem;
  }

  .archive-section {
    padding: 1rem 1.25rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2563eb;
    border-radius: 12px;
  }

  .archive-section h2 {
    margin-top: 0;
    font-size: 1.1rem;
  }

  .archive-section ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  .archive-section a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }
</style>
