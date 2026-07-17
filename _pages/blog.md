---
title: Blog
permalink: "/blog/"
layout: default
language: en
pagination:
  enabled: true
  per_page: 6
---

{% assign i18n = site.data.i18n[page.language] %}
{% assign posts = paginator.posts | default: site.posts | where_exp: "post", "post.language == page.language" | where_exp: "post", "post.published != false" %}

<div class="blog-archive">
  <header class="blog-header">
    <p class="blog-kicker">{{ i18n.blog.title | default: "Blog" }}</p>
    <h1>{{ page.title }}</h1>
    <p class="section-description">{{ i18n.blog.description }}</p>
  </header>

  {% if posts.size > 0 %}
    <div class="posts-list">
      {% for post in posts %}
        <article class="post-item">
          <div class="post-item-header">
            <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
            <time class="post-item-date">{{ post.date | date: "%b %d, %Y" }}</time>
          </div>

          {% if post.categories %}
            <div class="post-item-categories">
              {% for category in post.categories %}
                <a href="{{ site.baseurl }}/categories/#{{ category | slugify }}" class="category-tag">{{ category }}</a>
              {% endfor %}
            </div>
          {% endif %}

          <p class="post-item-excerpt">{{ post.description | default: post.excerpt | strip_html | truncatewords: 32 }}</p>
          <a href="{{ post.url | relative_url }}" class="read-more-link">{{ i18n.ui.read_more }} →</a>
        </article>
      {% endfor %}
    </div>
  {% else %}
    <p class="section-description">No posts have been published yet.</p>
  {% endif %}

  {% if paginator.total_pages > 1 %}
    <nav class="pagination" aria-label="Blog pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}">← Newer posts</a>
      {% else %}
        <span>← Newer posts</span>
      {% endif %}
      <span class="pagination-current">Page {{ paginator.page }} of {{ paginator.total_pages }}</span>
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}">Older posts →</a>
      {% else %}
        <span>Older posts →</span>
      {% endif %}
    </nav>
  {% endif %}
</div>

<style>
  .blog-header {
    margin-bottom: 2rem;
  }

  .blog-kicker {
    margin: 0 0 0.4rem;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2563eb;
    font-weight: 700;
  }

  .section-description {
    font-size: 1.05rem;
    color: #64748b;
    margin-bottom: 1.5rem;
  }

  .posts-list {
    display: grid;
    gap: 1rem;
  }

  .post-item {
    padding: 1.35rem 1.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2563eb;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .post-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
  }

  .post-item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .post-item h3 {
    margin: 0;
    font-size: 1.16rem;
  }

  .post-item h3 a {
    color: #0f172a;
    text-decoration: none;
  }

  .post-item h3 a:hover {
    color: #2563eb;
  }

  .post-item-date {
    font-size: 0.9rem;
    color: #64748b;
    white-space: nowrap;
  }

  .post-item-categories {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .category-tag {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #dbeafe;
    color: #1d4ed8;
    border-radius: 999px;
    font-size: 0.85rem;
    text-decoration: none;
  }

  .category-tag:hover {
    background: #bfdbfe;
  }

  .post-item-excerpt {
    margin: 0.75rem 0 0.9rem;
    color: #475569;
    line-height: 1.6;
  }

  .read-more-link {
    display: inline-block;
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
    color: #475569;
  }

  .pagination a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }

  .pagination-current {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .post-item-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .post-item-date {
      white-space: normal;
    }

    .pagination {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
