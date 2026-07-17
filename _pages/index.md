---
layout: default
title: Home
permalink: /
language: en
---

{% assign i18n = site.data.i18n[page.language] %}
{% assign featured_posts = site.posts | where_exp: "post", "post.language == page.language" | where_exp: "post", "post.published != false" | limit: 3 %}

<section class="hero">
  <div class="hero-content">
    <h1>{{ i18n.home.hero_title }}</h1>
    <p class="hero-subtitle">{{ i18n.home.hero_subtitle }}</p>
    <div class="hero-cta">
      <a href="{{ site.baseurl }}/blog" class="button button-primary">{{ i18n.home.cta_blog }}</a>
    </div>
  </div>
</section>

<section class="featured-section disclaimer-callout" aria-label="Site disclaimer">
  <h2>{{ i18n.home.disclaimer_title }}</h2>
  <p>{{ i18n.home.disclaimer_text }} <a href="{{ site.baseurl }}/disclaimer/">{{ i18n.home.disclaimer_link }}</a>.</p>
</section>

<section class="featured-section">
  <h2>{{ i18n.home.featured_posts }}</h2>
  <div class="posts-grid">
    {% for post in featured_posts %}
      <article class="post-card">
        {% if post.image %}
          <div class="post-card-image">
            <img src="{{ post.image | relative_url }}" alt="{{ post.title | escape }}" loading="lazy">
          </div>
        {% endif %}
        <div class="post-card-body">
          <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
          <p class="post-meta">
            {{ post.date | date: "%b %-d, %Y" }}
            {% if post.categories %}
              • {{ post.categories[0] }}
            {% endif %}
          </p>
          <p class="post-excerpt">{{ post.description | default: post.excerpt | strip_html | truncatewords: 28 }}</p>
          <a href="{{ post.url | relative_url }}" class="read-more">{{ i18n.ui.read_more }} →</a>
        </div>
      </article>
    {% endfor %}
  </div>
  <div class="section-footer">
    <a href="{{ site.baseurl }}/blog" class="button button-secondary">{{ i18n.home.view_all_posts }}</a>
  </div>
</section>

<style>
  .hero {
    margin-bottom: 2.5rem;
    padding: 2rem 0 1rem;
  }

  .hero-content {
    text-align: center;
    max-width: 760px;
    margin: 0 auto;
  }

  .hero-subtitle {
    color: #64748b;
    font-size: 1.08rem;
    line-height: 1.75;
    margin-top: 1rem;
  }

  .hero-cta {
    margin-top: 1.5rem;
  }

  .button {
    display: inline-block;
    padding: 0.7rem 1.1rem;
    border-radius: 999px;
    font-weight: 600;
    text-decoration: none;
  }

  .button-primary {
    background: #2563eb;
    color: white;
  }

  .button-secondary {
    background: #f8fafc;
    color: #1d4ed8;
    border: 1px solid #dbeafe;
  }

  .featured-section {
    margin-top: 2rem;
  }

  .disclaimer-callout {
    margin: 1.5rem 0 2rem;
    padding: 1rem 1.25rem;
    border: 1px solid #dbeafe;
    border-radius: 16px;
    background: #f8fafc;
  }

  .disclaimer-callout h2 {
    margin-bottom: 0.4rem;
  }

  .disclaimer-callout p {
    margin: 0;
    color: #475569;
    line-height: 1.7;
  }

  .featured-section h2 {
    margin-bottom: 1rem;
  }

  .posts-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .post-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  }

  .post-card-image img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }

  .post-card-body {
    padding: 1rem;
  }

  .post-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.05rem;
    text-align: left;
  }

  .post-card h3 a {
    color: #0f172a;
    text-decoration: none;
  }

  .post-meta {
    color: #64748b;
    font-size: 0.9rem;
    margin: 0 0 0.6rem;
  }

  .post-excerpt {
    color: #475569;
    margin: 0 0 0.8rem;
    line-height: 1.6;
  }

  .read-more {
    color: #2563eb;
    font-weight: 600;
    text-decoration: none;
  }

  .section-footer {
    margin-top: 1rem;
  }
</style>

<section class="featured-section">
  <h2>{{ i18n.home.featured_projects }}</h2>
  <!--p>
    <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
      Example External Link
    </a>
  </p-->
  <div class="projects-grid">
    {% assign projects = site.showcase | where: "language", "en" | limit: 3 %}
    {% for project in projects %}
      <article class="project-card">
        {% if project.image %}
          <div class="project-image">
            <img src="{{ project.image }}" alt="{{ project.title }}" loading="lazy">
          </div>
        {% endif %}
        <h3>{{ project.title }}</h3>
        <p>{{ project.excerpt | strip_html }}</p>
        <a href="{{ project.url }}" class="read-more">{{ i18n.home.view_project }} →</a>
      </article>
    {% endfor %}
  </div>
</section>
