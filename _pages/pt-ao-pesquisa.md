---
layout: default
title: Pesquisar
permalink: /pt/pesquisa/
language: pt
---

{% assign i18n = site.data.i18n[page.language] %}

<div class="search-page">
  <h1>{{ i18n.ui.search_results }}</h1>

  <form class="search-container" data-search-form>
    <input type="search"
           id="search-input"
           class="search-input"
           placeholder="{{ i18n.ui.search_placeholder }}"
           data-search-input
           aria-label="{{ i18n.nav.search }}">
    <button type="submit" class="search-button">{{ i18n.nav.search }}</button>
  </form>

  <div id="search-summary" data-search-summary class="search-summary" aria-live="polite"></div>
  <div id="search-results" data-search-results></div>

  <div id="fallback-search" data-search-fallback>
    <p>{{ i18n.ui.search_results }} aparecerão aqui enquanto digita...</p>
  </div>
</div>

<style>
  .search-page {
    max-width: 800px;
    margin: 2rem auto;
  }

  .search-container {
    display: flex;
    gap: 0.75rem;
    margin: 2rem 0;
    align-items: stretch;
  }

  .search-input {
    flex: 1;
    min-height: 3rem;
    padding: 0.85rem 1rem;
    border: 1px solid #d3dce6;
    border-radius: 999px;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #007acc;
    box-shadow: 0 0 0 4px rgba(0, 122, 204, 0.12);
  }

  .search-button {
    min-height: 3rem;
    padding: 0.85rem 1.25rem;
    background: var(--search-button-bg, linear-gradient(135deg, #0f172a, #334155));
    color: var(--search-button-color, #ffffff);
    border: 1px solid var(--search-button-border, rgba(15, 23, 42, 0.18));
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    box-shadow: var(--search-button-shadow, 0 8px 20px rgba(15, 23, 42, 0.14));
  }

  .search-button:hover,
  .search-button:focus-visible {
    background: var(--search-button-bg-hover, linear-gradient(135deg, #111827, #1f2937));
    border-color: var(--search-button-border-hover, rgba(15, 23, 42, 0.28));
    transform: translateY(-1px);
    box-shadow: var(--search-button-shadow-hover, 0 10px 24px rgba(15, 23, 42, 0.2));
  }

  .search-button:active {
    transform: translateY(0);
  }

  .search-button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
    box-shadow: none;
    transform: none;
  }

  .search-summary {
    margin-bottom: 1.5rem;
    color: #555;
    font-size: 0.95rem;
  }

  .search-results {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .search-result {
    border: 1px solid #e0e0e0;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fff;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .search-result:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  }

  .search-result-link {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .search-result-link:hover h3 {
    color: #007acc;
  }

  .search-result-meta {
    display: inline-block;
    margin-top: 0.35rem;
    color: #777;
    font-size: 0.9rem;
  }

  .search-result-excerpt {
    margin: 0.8rem 0 0;
    color: #555;
    line-height: 1.75;
  }

  .search-empty {
    color: #555;
    font-size: 1rem;
  }

  mark {
    background: #fff4b2;
    color: #000;
    padding: 0 0.15rem;
  }

  :root {
    --pagefind-ui-primary: #007acc;
    --pagefind-ui-text: #222;
    --pagefind-ui-background: #fff;
    --pagefind-ui-border: #e0e0e0;
    --pagefind-ui-border-width: 1px;
  }

  #search-results {
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .search-page {
      margin: 1.25rem auto 2rem;
    }

    .search-container {
      flex-direction: column;
      gap: 0.65rem;
    }

    .search-input {
      width: 100%;
    }

    .search-button {
      width: 100%;
    }
  }
</style>
