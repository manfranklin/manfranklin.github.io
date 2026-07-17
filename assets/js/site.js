(function () {
  'use strict';

  // Shared client-side behavior for language routing, navigation, warnings, search, and gallery interactions.
  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = new Set(['en', 'pt']);
  const STORAGE_KEYS = {
    LANGUAGE: 'preferred-language',
    EXTERNAL_LINK_WARNING: 'manf-external-link-warning-dismissed'
  };
  const ROUTE_MAP = new Map([
    ['', { en: '/', pt: '/pt/' }],
    ['blog', { en: '/blog/', pt: '/pt/blog/' }],
    ['showcase', { en: '/showcase/', pt: '/pt/galeria/' }],
    ['galeria', { en: '/showcase/', pt: '/pt/galeria/' }],
    ['resources', { en: '/resources/', pt: '/pt/recursos/' }],
    ['recursos', { en: '/resources/', pt: '/pt/recursos/' }],
    ['search', { en: '/search/', pt: '/pt/pesquisa/' }],
    ['pesquisa', { en: '/search/', pt: '/pt/pesquisa/' }],
    ['about', { en: '/about/', pt: '/pt/sobre/' }],
    ['sobre', { en: '/about/', pt: '/pt/sobre/' }],
    ['disclaimer', { en: '/disclaimer/', pt: '/pt/aviso/' }],
    ['aviso', { en: '/disclaimer/', pt: '/pt/aviso/' }],
    ['getting-started', { en: '/getting-started/', pt: '/getting-started/' }],
    ['archive', { en: '/archive/', pt: '/archive/' }],
    ['categories', { en: '/categories/', pt: '/categories/' }]
  ]);

  class DomUtils {
    static getBodyData() {
      return document.body ? document.body.dataset : {};
    }
  }

  class UrlUtils {
    static get baseUrl() {
      return (DomUtils.getBodyData().baseurl || '').replace(/\/$/, '');
    }

    static normalizePath(pathname) {
      const baseUrl = UrlUtils.baseUrl;
      const stripped = baseUrl && pathname.startsWith(baseUrl)
        ? pathname.slice(baseUrl.length) || '/'
        : pathname;

      return stripped.replace(/\/+$/, '') || '/';
    }

    static withBaseUrl(path) {
      if (!path) {
        return UrlUtils.baseUrl || '/';
      }

      if (!UrlUtils.baseUrl) {
        return path;
      }

      return `${UrlUtils.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    }
  }

  class LanguageService {
    static getCurrentLanguage() {
      const bodyLanguage = DomUtils.getBodyData().currentLanguage;
      if (SUPPORTED_LANGUAGES.has(bodyLanguage)) {
        return bodyLanguage;
      }

      const path = UrlUtils.normalizePath(window.location.pathname);
      return path === '/pt' || path.startsWith('/pt/') ? 'pt' : DEFAULT_LANGUAGE;
    }

    static getRouteKey(pathname) {
      const currentPath = UrlUtils.normalizePath(pathname);
      const normalizedPath = currentPath === '/pt' || currentPath.startsWith('/pt/')
        ? currentPath.replace(/^\/pt/, '') || '/'
        : currentPath;

      return normalizedPath === '/' ? '' : normalizedPath.replace(/^\//, '').split('/')[0];
    }

    static getExplicitTranslationUrl(targetLang) {
      const bodyData = DomUtils.getBodyData();
      const translationUrl = targetLang === 'pt'
        ? bodyData.translationUrlPt
        : bodyData.translationUrlEn;

      if (!translationUrl) {
        return null;
      }

      return translationUrl.startsWith('/') ? translationUrl : `/${translationUrl}`;
    }

    static buildTargetPath(targetLang) {
      const explicitUrl = LanguageService.getExplicitTranslationUrl(targetLang);
      const suffix = `${window.location.search}${window.location.hash}`;
      if (explicitUrl) {
        return `${UrlUtils.withBaseUrl(explicitUrl)}${suffix}`;
      }

      const currentPath = UrlUtils.normalizePath(window.location.pathname);
      const currentLang = LanguageService.getCurrentLanguage();
      const normalizedPath = currentLang === 'pt'
        ? currentPath.replace(/^\/pt/, '') || '/'
        : currentPath;
      const routeKey = LanguageService.getRouteKey(window.location.pathname);
      const mapping = ROUTE_MAP.get(routeKey);

      if (mapping) {
        return `${UrlUtils.withBaseUrl(mapping[targetLang])}${suffix}`;
      }

      const pathWithoutTrailingSlash = normalizedPath === '/'
        ? ''
        : normalizedPath.replace(/\/$/, '');
      let fallbackPath = '';

      if (targetLang === 'pt') {
        fallbackPath = pathWithoutTrailingSlash === ''
          ? '/pt/'
          : `${pathWithoutTrailingSlash}-pt/`;
      } else if (currentLang === 'pt' && pathWithoutTrailingSlash.endsWith('-pt')) {
        fallbackPath = pathWithoutTrailingSlash.replace(/-pt$/, '') || '/';
        fallbackPath = fallbackPath === '/' ? '/' : `${fallbackPath}/`;
      } else {
        fallbackPath = pathWithoutTrailingSlash === ''
          ? '/'
          : `${pathWithoutTrailingSlash}/`;
      }

      return `${UrlUtils.withBaseUrl(fallbackPath)}${suffix}`;
    }
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function tokenize(query) {
    return normalizeText(query).split(/\s+/).filter(Boolean);
  }

  // The language switcher keeps the page aligned with the user's preferred locale and route.
  class LanguageSwitcher {
    init() {
      const switcher = document.querySelector('[data-language-switcher]');
      if (!switcher) {
        return;
      }

      const select = switcher.querySelector('[data-language-select]');
      if (!select) {
        return;
      }

      select.value = LanguageService.getCurrentLanguage();
      select.addEventListener('change', (event) => {
        const targetLang = event.target.value;
        if (!SUPPORTED_LANGUAGES.has(targetLang)) {
          return;
        }

        try {
          window.localStorage.setItem(STORAGE_KEYS.LANGUAGE, targetLang);
        } catch (_) {
          // Storage is optional here, so navigation should still proceed.
        }

        window.location.assign(LanguageService.buildTargetPath(targetLang));
      });
    }
  }

  // Navigation is implemented as a keyboard-friendly drawer for mobile and desktop layouts.
  class NavigationMenu {
    init() {
      this.toggle = document.querySelector('[data-nav-toggle]');
      this.menu = document.querySelector('[data-nav-menu]');

      if (!this.toggle || !this.menu) {
        return;
      }

      this.menuLinks = Array.from(this.menu.querySelectorAll('a'));
      this.toggle.addEventListener('click', () => this.toggleMenu());
      this.menu.addEventListener('keydown', (event) => this.handleKeydown(event));
      this.menuLinks.forEach((link) => link.addEventListener('click', () => this.setMenuState(false)));
      document.addEventListener('click', (event) => this.handleDocumentClick(event));
      window.addEventListener('resize', () => this.handleResize());
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.setMenuState(false);
        }
      });
    }

    setMenuState(isOpen) {
      this.menu.classList.toggle('is-open', isOpen);
      this.toggle.classList.toggle('is-open', isOpen);
      this.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      const isMobileNavigation = window.innerWidth < 1025;
      this.menu.setAttribute('aria-hidden', isMobileNavigation ? (isOpen ? 'false' : 'true') : 'false');

      this.menuLinks.forEach((link, index) => {
        if (isMobileNavigation) {
          link.setAttribute('tabindex', isOpen ? '0' : '-1');
        } else {
          link.removeAttribute('tabindex');
        }

        if (isOpen && isMobileNavigation && index === 0) {
          link.setAttribute('data-nav-focus', 'true');
        } else {
          link.removeAttribute('data-nav-focus');
        }
      });
    }

    toggleMenu() {
      const isOpen = this.toggle.getAttribute('aria-expanded') === 'true';
      this.setMenuState(!isOpen);
      if (!isOpen && this.menuLinks.length) {
        this.menuLinks[0].focus();
      }
    }

    handleDocumentClick(event) {
      if (window.innerWidth >= 1025) {
        return;
      }

      if (!this.menu.contains(event.target) && !this.toggle.contains(event.target)) {
        this.setMenuState(false);
      }
    }

    handleResize() {
      if (window.innerWidth >= 1025) {
        this.setMenuState(false);
      }
    }

    handleKeydown(event) {
      const currentIndex = this.menuLinks.indexOf(document.activeElement);

      if (event.key === 'Escape') {
        event.preventDefault();
        this.setMenuState(false);
        this.toggle.focus();
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % this.menuLinks.length;
        this.menuLinks[nextIndex].focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = currentIndex < 0
          ? this.menuLinks.length - 1
          : (currentIndex - 1 + this.menuLinks.length) % this.menuLinks.length;
        this.menuLinks[prevIndex].focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        this.menuLinks[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        this.menuLinks[this.menuLinks.length - 1].focus();
      }
    }
  }

  // External links are intercepted so the site can warn visitors before they leave the current domain.
  class ExternalLinkWarning {
    init() {
      this.modal = document.getElementById('external-link-warning-modal') || this.createModal();
      if (!this.modal) {
        return;
      }

      this.pendingUrl = null;
      this.cacheElements();
      this.bindEvents();
      this.enhanceLinks();
    }

    createModal() {
      const modal = document.createElement('div');
      modal.id = 'external-link-warning-modal';
      modal.className = 'external-link-warning-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = [
        '<div class="external-link-warning-dialog" role="document">',
        '  <h2 class="external-link-warning-title"></h2>',
        '  <p class="external-link-warning-message"></p>',
        '  <label class="external-link-warning-checkbox">',
        '    <input type="checkbox" data-external-link-dont-show />',
        '    <span></span>',
        '  </label>',
        '  <div class="external-link-warning-actions">',
        '    <button type="button" class="button button-secondary" data-external-link-cancel></button>',
        '    <button type="button" class="button button-primary" data-external-link-continue></button>',
        '  </div>',
        '</div>'
      ].join('');

      document.body.appendChild(modal);
      return modal;
    }

    cacheElements() {
      this.titleElement = this.modal.querySelector('.external-link-warning-title');
      this.messageElement = this.modal.querySelector('.external-link-warning-message');
      this.checkboxLabel = this.modal.querySelector('.external-link-warning-checkbox span');
      this.cancelButton = this.modal.querySelector('[data-external-link-cancel]');
      this.continueButton = this.modal.querySelector('[data-external-link-continue]');
      this.dontShowCheckbox = this.modal.querySelector('[data-external-link-dont-show]');
    }

    bindEvents() {
      this.modal.addEventListener('click', (event) => {
        if (event.target === this.modal) {
          this.closeModal();
        }
      });

      this.cancelButton.addEventListener('click', () => this.closeModal());
      this.continueButton.addEventListener('click', () => this.continueNavigation());
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.modal.classList.contains('is-open')) {
          this.closeModal();
        }
      });

      document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || !this.isExternalLink(anchor) || this.shouldSkipLink(anchor)) {
          return;
        }

        if (this.shouldBypassWarning()) {
          return;
        }

        event.preventDefault();
        this.openModal(anchor.href);
      });
    }

    getTranslations(language) {
      if (language === 'pt') {
        return {
          title: 'Saindo do site manfraklin.github.io',
          message: 'Você está sendo direcionado para conteúdo hospedado em outro site. Este link será aberto em uma nova janela ou aba do navegador.\n\nA manfraklin.github.io não assume qualquer responsabilidade ou obrigação por danos, perdas, problemas de segurança, riscos de privacidade ou quaisquer consequências resultantes da utilização de sites externos ou do download de produtos, arquivos ou materiais disponibilizados nesses sites.',
          checkboxLabel: 'Não mostrar esta mensagem novamente',
          continueLabel: 'Continuar',
          cancelLabel: 'Cancelar'
        };
      }

      return {
        title: 'Leaving manfraklin.github.io',
        message: 'You are being redirected to content hosted on another website. This link will open in a new browser window or tab.\n\n manfraklin.github.io assumes no responsibility or liability for any damage, loss, security issues, privacy risks, or other consequences resulting from the use of external websites or any products, files, or materials downloaded from those websites.',
        checkboxLabel: 'Do not show me this again',
        continueLabel: 'Continue',
        cancelLabel: 'Cancel'
      };
    }

    enhanceLinks() {
      document.querySelectorAll('a[href]').forEach((anchor) => {
        if (!this.isExternalLink(anchor) || this.shouldSkipLink(anchor)) {
          return;
        }

        if (anchor.getAttribute('target') !== '_blank') {
          anchor.setAttribute('target', '_blank');
        }

        const rel = (anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
        if (!rel.includes('noopener')) {
          rel.push('noopener');
        }
        if (!rel.includes('noreferrer')) {
          rel.push('noreferrer');
        }

        anchor.setAttribute('rel', rel.join(' '));
      });
    }

    isExternalLink(anchor) {
      if (!anchor || !anchor.getAttribute('href')) {
        return false;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('data:')) {
        return false;
      }

      try {
        const url = new URL(href, window.location.href);
        return url.hostname !== window.location.hostname;
      } catch (_) {
        return false;
      }
    }

    shouldSkipLink(anchor) {
      return anchor.hasAttribute('data-no-external-warning') || anchor.closest('[data-no-external-warning]');
    }

    shouldBypassWarning() {
      try {
        return window.localStorage.getItem(STORAGE_KEYS.EXTERNAL_LINK_WARNING) === 'true';
      } catch (_) {
        return false;
      }
    }

    openModal(url) {
      if (this.shouldBypassWarning()) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      this.pendingUrl = url;
      this.updateModalContent(LanguageService.getCurrentLanguage());
      this.modal.classList.add('is-open');
      this.modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('external-link-warning-open');
      this.dontShowCheckbox.checked = false;
      this.continueButton.focus();
    }

    updateModalContent(language) {
      const translations = this.getTranslations(language);
      this.titleElement.textContent = translations.title;
      this.messageElement.textContent = translations.message;
      this.checkboxLabel.textContent = translations.checkboxLabel;
      this.cancelButton.textContent = translations.cancelLabel;
      this.continueButton.textContent = translations.continueLabel;
      this.modal.setAttribute('data-language', language);
    }

    closeModal() {
      this.modal.classList.remove('is-open');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('external-link-warning-open');
      this.pendingUrl = null;
    }

    continueNavigation() {
      if (this.dontShowCheckbox.checked) {
        try {
          window.localStorage.setItem(STORAGE_KEYS.EXTERNAL_LINK_WARNING, 'true');
        } catch (_) {
          // Persisting the preference is best-effort only.
        }
      }

      const url = this.pendingUrl;
      this.closeModal();
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  }

  // Search loads the generated Pagefind index and ranks posts by relevance and language.
  class SearchController {
    constructor() {
      this.resultLimit = 12;
      this.searchTimer = null;
      this.searchIndex = null;
    }

    init() {
      this.searchInput = document.querySelector('[data-search-input]');
      this.searchForm = document.querySelector('[data-search-form]');
      this.resultsContainer = document.querySelector('[data-search-results]');
      this.summaryContainer = document.querySelector('[data-search-summary]');
      this.fallbackContainer = document.querySelector('[data-search-fallback]');

      if (!this.searchInput || !this.resultsContainer) {
        return;
      }

      this.indexUrl = `${UrlUtils.baseUrl === '/' ? '' : UrlUtils.baseUrl}/pagefind/index.json`;
      this.searchInput.addEventListener('input', (event) => this.handleInput(event));
      if (this.searchForm) {
        this.searchForm.addEventListener('submit', (event) => {
          event.preventDefault();
          this.performSearch(this.searchInput.value);
        });
      }

      const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
      if (initialQuery) {
        this.searchInput.value = initialQuery;
        this.performSearch(initialQuery);
      }

      if (this.fallbackContainer) {
        this.fallbackContainer.style.display = this.searchInput.value.trim() ? 'none' : 'block';
      }
    }

    async loadIndex() {
      if (Array.isArray(this.searchIndex) && this.searchIndex.length > 0) {
        return this.searchIndex;
      }

      const response = await fetch(this.indexUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Search index unavailable');
      }

      const data = await response.json();
      this.searchIndex = Array.isArray(data) ? data : [];
      return this.searchIndex;
    }

    scoreEntry(entry, query, tokens) {
      const normalizedTitle = normalizeText(entry.title);
      const normalizedCategory = normalizeText(entry.category);
      const normalizedExcerpt = normalizeText(entry.excerpt);
      const normalizedContent = normalizeText(entry.content);
      let score = 0;

      if (normalizedTitle.startsWith(query)) {
        score += 120;
      }
      if (normalizedTitle.includes(query)) {
        score += 90;
      }
      if (normalizedCategory.includes(query)) {
        score += 75;
      }
      if (normalizedExcerpt.includes(query)) {
        score += 40;
      }
      if (normalizedContent.includes(query)) {
        score += 20;
      }

      tokens.forEach((token) => {
        if (normalizedTitle.includes(token)) {
          score += 12;
        }
        if (normalizedCategory.includes(token)) {
          score += 8;
        }
        if (normalizedExcerpt.includes(token)) {
          score += 5;
        }
        if (normalizedContent.includes(token)) {
          score += 2;
        }
      });

      return score;
    }

    isMatch(entry, queryTokens) {
      const haystack = normalizeText(`${entry.title} ${entry.category} ${entry.excerpt} ${entry.content}`);
      return queryTokens.every((token) => haystack.includes(token));
    }

    createExcerpt(entry, tokens) {
      const source = entry.excerpt || entry.content || '';
      const normalizedSource = source.replace(/\s+/g, ' ').trim();
      const snippet = normalizedSource.length > 280
        ? `${normalizedSource.slice(0, 280).trim()}…`
        : normalizedSource;
      let highlighted = escapeHtml(snippet);

      tokens.forEach((token) => {
        const pattern = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlighted = highlighted.replace(pattern, '<mark>$1</mark>');
      });

      return highlighted;
    }

    renderResults(results, query) {
      if (!results.length) {
        if (this.summaryContainer) {
          this.summaryContainer.textContent = `No results found for "${query}".`;
        }

        this.resultsContainer.innerHTML = '<p class="search-empty">No results found.</p>';
        return;
      }

      if (this.summaryContainer) {
        this.summaryContainer.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found for "${query}".`;
      }

      const items = results.slice(0, this.resultLimit).map((result) => {
        const item = result.item;
        const title = escapeHtml(item.title || 'Untitled');
        const category = item.category ? `<span class="search-result-meta">${escapeHtml(item.category)}</span>` : '';
        const date = item.date ? `<span class="search-result-meta">${escapeHtml(item.date)}</span>` : '';
        const excerpt = this.createExcerpt(item, tokenize(query));

        return `
          <li class="search-result">
            <a href="${escapeHtml(item.url)}" class="search-result-link">
              <h3>${title}</h3>
              <p class="search-result-meta">${date}${date && category ? ' · ' : ''}${category}</p>
              <p class="search-result-excerpt">${excerpt}</p>
            </a>
          </li>`;
      }).join('');

      this.resultsContainer.innerHTML = `<ul class="search-results">${items}</ul>`;
    }

    async performSearch(query) {
      const trimmedQuery = String(query || '').trim();
      if (!trimmedQuery) {
        this.resultsContainer.innerHTML = '';
        if (this.summaryContainer) {
          this.summaryContainer.textContent = '';
        }
        if (this.fallbackContainer) {
          this.fallbackContainer.style.display = 'block';
        }
        return;
      }

      if (this.fallbackContainer) {
        this.fallbackContainer.style.display = 'none';
      }

      try {
        const index = await this.loadIndex();
        const tokens = tokenize(trimmedQuery);
        const normalizedQuery = normalizeText(trimmedQuery);
        const currentLanguage = LanguageService.getCurrentLanguage();
        const filteredResults = index
          .filter((item) => item && item.type === 'posts')
          .filter((item) => String(item.language || '').toLowerCase().startsWith('pt')
            ? currentLanguage === 'pt'
            : currentLanguage === DEFAULT_LANGUAGE)
          .map((item) => ({ item, score: this.scoreEntry(item, normalizedQuery, tokens) }))
          .filter((entry) => entry.score > 0 && this.isMatch(entry.item, tokens))
          .sort((a, b) => b.score - a.score);

        this.renderResults(filteredResults, trimmedQuery);
      } catch (error) {
        console.error('Search error:', error);
        if (this.summaryContainer) {
          this.summaryContainer.textContent = 'Search is temporarily unavailable.';
        }
        this.resultsContainer.innerHTML = '<p class="search-empty">Search is temporarily unavailable.</p>';
      }
    }

    handleInput(event) {
      if (this.searchTimer) {
        window.clearTimeout(this.searchTimer);
      }

      this.searchTimer = window.setTimeout(() => {
        this.performSearch(event.target.value);
      }, 120);
    }
  }

  // The gallery turns image thumbnails into a lightweight lightbox experience.
  class Gallery {
    init() {
      this.galleries = document.querySelectorAll('[data-gallery]');
      if (!this.galleries.length) {
        return;
      }

      this.lightbox = this.createLightbox();
      this.currentImageSet = [];
      this.currentImageIndex = 0;
      this.bindLightboxEvents();
      this.initGalleryItems();
    }

    createLightbox() {
      const existingLightbox = document.getElementById('lightbox');
      if (existingLightbox) {
        return existingLightbox;
      }

      const lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.innerHTML = [
        '<button class="lightbox-close" type="button" aria-label="Close image viewer">×</button>',
        '<img class="lightbox-image" src="" alt="">',
        '<div class="lightbox-caption"></div>',
        '<button class="lightbox-prev" type="button" aria-label="Previous image">‹</button>',
        '<button class="lightbox-next" type="button" aria-label="Next image">›</button>'
      ].join('');

      document.body.appendChild(lightbox);
      return lightbox;
    }

    bindLightboxEvents() {
      this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
      this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.showPrevImage());
      this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.showNextImage());
      this.lightbox.addEventListener('click', (event) => {
        if (event.target === this.lightbox) {
          this.closeLightbox();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (!this.lightbox.classList.contains('active')) {
          return;
        }

        if (event.key === 'ArrowLeft') {
          this.showPrevImage();
        } else if (event.key === 'ArrowRight') {
          this.showNextImage();
        } else if (event.key === 'Escape') {
          this.closeLightbox();
        }
      });
    }

    initGalleryItems() {
      this.galleries.forEach((gallery) => {
        const items = gallery.querySelectorAll('img');
        const imageSet = Array.from(items).map((image) => ({
          src: image.currentSrc || image.src,
          alt: image.alt,
          caption: image.getAttribute('data-caption') || image.alt
        }));

        items.forEach((image, index) => {
          image.style.cursor = 'pointer';
          image.addEventListener('click', () => {
            this.currentImageSet = imageSet;
            this.currentImageIndex = index;
            this.updateLightbox(imageSet[index]);
          });
        });
      });
    }

    updateLightbox(imageData) {
      const imageElement = this.lightbox.querySelector('.lightbox-image');
      const captionElement = this.lightbox.querySelector('.lightbox-caption');

      imageElement.src = imageData.src;
      imageElement.alt = imageData.alt;
      captionElement.textContent = imageData.caption || imageData.alt;
      this.lightbox.classList.add('active');
      this.lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.lightbox.querySelector('.lightbox-close').focus();
    }

    closeLightbox() {
      this.lightbox.classList.remove('active');
      this.lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    showNextImage() {
      if (!this.currentImageSet.length) {
        return;
      }

      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImageSet.length;
      this.updateLightbox(this.currentImageSet[this.currentImageIndex]);
    }

    showPrevImage() {
      if (!this.currentImageSet.length) {
        return;
      }

      this.currentImageIndex = (this.currentImageIndex - 1 + this.currentImageSet.length) % this.currentImageSet.length;
      this.updateLightbox(this.currentImageSet[this.currentImageIndex]);
    }
  }

  function init() {
    new LanguageSwitcher().init();
    new NavigationMenu().init();
    new ExternalLinkWarning().init();
    new SearchController().init();
    new Gallery().init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
