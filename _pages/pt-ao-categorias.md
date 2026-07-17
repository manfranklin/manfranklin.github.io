---
title: Categorias
permalink: "/pt/categorias/"
layout: default
language: pt
---

{% assign category_groups = site.categories | sort %}

<div class="archive-page">
  <header class="archive-header">
    <p class="archive-kicker">Blog</p>
    <h1>{{ page.title }}</h1>
    <p class="archive-description">Explorar artigos agrupados por categoria.</p>
  </header>

  {% if category_groups.size > 0 %}
    <div class="archive-list">
      {% for category_pair in category_groups %}
        {% assign category_name = category_pair[0] %}
        {% assign category_posts = category_pair[1] | where_exp: "post", "post.language == page.language" | where_exp: "post", "post.published != false" %}
        {% if category_posts.size > 0 %}
          <section class="archive-section" id="{{ category_name | slugify }}">
            <h2>{{ category_name }}</h2>
            <ul>
              {% for post in category_posts %}
                <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
              {% endfor %}
            </ul>
          </section>
        {% endif %}
      {% endfor %}
    </div>
  {% else %}
    <p>Ainda não há categorias publicadas.</p>
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
