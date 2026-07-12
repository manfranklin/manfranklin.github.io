(function () {
  'use strict';

  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = ['en', 'pt'];
  const LANGUAGE_STORAGE_KEY = 'preferred-language';
  const EXTERNAL_LINK_STORAGE_KEY = 'manf-external-link-warning-dismissed';

  function getBodyData() {
    return document.body ? document.body.dataset : {};
  }

  function getBaseUrl() {
    return (getBodyData().baseurl || '').replace(/\/$/, '');
  }

  function normalizePath(pathname) {
    const baseUrl = getBaseUrl();
    const stripped = baseUrl && pathname.startsWith(baseUrl)
      ? pathname.slice(baseUrl.length) || '/'
      : pathname;

    return stripped.replace(/\/+$/, '') || '/';
  }

  function withBaseUrl(path) {
    const baseUrl = getBaseUrl();
    if (!path) {
      return baseUrl || '/';
    }

    if (!baseUrl) {
      return path;
    }

    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  function getCurrentLanguage() {
    const bodyLanguage = getBodyData().currentLanguage;
    if (SUPPORTED_LANGUAGES.includes(bodyLanguage)) {
      return bodyLanguage;
    }

    const path = normalizePath(window.location.pathname);
    return path === '/pt' || path.startsWith('/pt/') ? 'pt' : DEFAULT_LANGUAGE;
  }

  function getRouteKey(pathname) {
    const currentPath = normalizePath(pathname);
    const normalizedPath = currentPath === '/pt' || currentPath.startsWith('/pt/')
      ? currentPath.replace(/^\/pt/, '') || '/'
      : currentPath;

    return normalizedPath === '/' ? '' : normalizedPath.replace(/^\//, '').split('/')[0];
  }

  function getExplicitTranslationUrl(targetLang) {
    const translationUrl = targetLang === 'pt'
      ? getBodyData().translationUrlPt
      : getBodyData().translationUrlEn;

    if (!translationUrl) {
      return null;
    }

    return translationUrl.startsWith('/') ? translationUrl : `/${translationUrl}`;
  }

  function buildTargetPath(targetLang) {
    const explicitUrl = getExplicitTranslationUrl(targetLang);
    if (explicitUrl) {
      return withBaseUrl(explicitUrl) + window.location.search + window.location.hash;
    }

    const currentPath = normalizePath(window.location.pathname);
    const currentLang = getCurrentLanguage();
    const normalizedPath = currentLang === 'pt' ? currentPath.replace(/^\/pt/, '') || '/' : currentPath;
    const routeKey = getRouteKey(window.location.pathname);
    const routeMap = {
      '': { en: '/', pt: '/pt/' },
      blog: { en: '/blog/', pt: '/pt/blog/' },
      showcase: { en: '/showcase/', pt: '/pt/galeria/' },
      galeria: { en: '/showcase/', pt: '/pt/galeria/' },
      resources: { en: '/resources/', pt: '/pt/recursos/' },
      recursos: { en: '/resources/', pt: '/pt/recursos/' },
      search: { en: '/search/', pt: '/pt/pesquisa/' },
      pesquisa: { en: '/search/', pt: '/pt/pesquisa/' },
      about: { en: '/about/', pt: '/pt/sobre/' },
      sobre: { en: '/about/', pt: '/pt/sobre/' },
      disclaimer: { en: '/disclaimer/', pt: '/pt/aviso/' },
      aviso: { en: '/disclaimer/', pt: '/pt/aviso/' },
      'getting-started': { en: '/getting-started/', pt: '/getting-started/' },
      archive: { en: '/archive/', pt: '/archive/' },
      categories: { en: '/categories/', pt: '/categories/' }
    };

    const mappedPath = routeMap[routeKey] ? routeMap[routeKey][targetLang] : null;
    if (mappedPath) {
      return withBaseUrl(mappedPath) + window.location.search + window.location.hash;
    }

    const pathWithoutTrailingSlash = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');
    let fallbackPath = '';

    if (targetLang === 'pt') {
      fallbackPath = pathWithoutTrailingSlash === ''
        ? '/pt/'
        : `${pathWithoutTrailingSlash}-pt/`;
    } else if (currentLang === 'pt' && pathWithoutTrailingSlash.endsWith('-pt')) {
      fallbackPath = pathWithoutTrailingSlash.replace(/-pt$/, '') || '/';
      fallbackPath = fallbackPath === '/' ? '/' : `${fallbackPath}/`;
    } else {
      fallbackPath = pathWithoutTrailingSlash === '' ? '/' : `${pathWithoutTrailingSlash}/`;
    }

    return withBaseUrl(fallbackPath) + window.location.search + window.location.hash;
  }

  function initLanguageSwitcher() {
    const switcher = document.querySelector('[data-language-switcher]');
    if (!switcher) {
      return;
    }

    const select = switcher.querySelector('[data-language-select]');
    if (!select) {
      return;
    }

    const currentLang = getCurrentLanguage();
    select.value = currentLang;
    select.addEventListener('change', (event) => {
      const targetLang = event.target.value;
      if (!SUPPORTED_LANGUAGES.includes(targetLang)) {
        return;
      }

      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, targetLang);
      } catch (error) {
        // Ignore storage failures and continue with navigation.
      }

      window.location.assign(buildTargetPath(targetLang));
    });
  }

  function initNavigation() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-nav-menu]');

    if (!toggle || !menu) {
      return;
    }

    const menuLinks = Array.from(menu.querySelectorAll('a'));

    const setMenuState = (isOpen) => {
      menu.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      const isMobileNavigation = window.innerWidth < 1025;
      menu.setAttribute('aria-hidden', isMobileNavigation ? (isOpen ? 'false' : 'true') : 'false');

      menuLinks.forEach((link, index) => {
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
    };

    const closeMenu = () => {
      setMenuState(false);
    };

    const openMenu = () => {
      setMenuState(true);
      if (menuLinks.length) {
        menuLinks[0].focus();
      }
    };

    const handleMenuKeydown = (event) => {
      const currentIndex = menuLinks.indexOf(document.activeElement);

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        toggle.focus();
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % menuLinks.length;
        menuLinks[nextIndex].focus();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = currentIndex < 0 ? menuLinks.length - 1 : (currentIndex - 1 + menuLinks.length) % menuLinks.length;
        menuLinks[prevIndex].focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        menuLinks[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        menuLinks[menuLinks.length - 1].focus();
      }
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    menu.addEventListener('keydown', handleMenuKeydown);

    document.addEventListener('click', (event) => {
      if (window.innerWidth < 1025 && !menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1025) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  function shouldBypassExternalWarning() {
    try {
      return window.localStorage.getItem(EXTERNAL_LINK_STORAGE_KEY) === 'true';
    } catch (error) {
      return false;
    }
  }

  function getTranslations(language) {
    if (language === 'pt') {
      return {
        title: 'Saindo do site MANF',
        message: 'Você está sendo direcionado para conteúdo hospedado em outro site. Este link será aberto em uma nova janela ou aba do navegador.\n\nA MANF não assume qualquer responsabilidade ou obrigação por danos, perdas, problemas de segurança, riscos de privacidade ou quaisquer consequências resultantes da utilização de sites externos ou do download de produtos, arquivos ou materiais disponibilizados nesses sites.',
        checkboxLabel: 'Não mostrar esta mensagem novamente',
        continueLabel: 'Continuar',
        cancelLabel: 'Cancelar'
      };
    }

    return {
      title: 'Leaving MANF Website',
      message: 'You are being redirected to content hosted on another website. This link will open in a new browser window or tab.\n\nMANF assumes no responsibility or liability for any damage, loss, security issues, privacy risks, or other consequences resulting from the use of external websites or any products, files, or materials downloaded from those websites.',
      checkboxLabel: 'Do not show me this again',
      continueLabel: 'Continue',
      cancelLabel: 'Cancel'
    };
  }

  function isExternalLink(anchor) {
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
    } catch (error) {
      return false;
    }
  }

  function shouldSkipLink(anchor) {
    return anchor.hasAttribute('data-no-external-warning') || anchor.closest('[data-no-external-warning]');
  }

  function enhanceExternalLink(anchor) {
    if (!anchor || !isExternalLink(anchor) || shouldSkipLink(anchor)) {
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
  }

  function initExternalLinkWarning() {
    let modal = document.getElementById('external-link-warning-modal');
    let pendingUrl = null;

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'external-link-warning-modal';
      modal.className = 'external-link-warning-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = [
        '<div class="external-link-warning-dialog" role="document">',
        '  <h2 id="external-link-warning-title" class="external-link-warning-title"></h2>',
        '  <p id="external-link-warning-message" class="external-link-warning-message"></p>',
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
    }

    const closeModal = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('external-link-warning-open');
      pendingUrl = null;
    };

    const continueNavigation = () => {
      const checkbox = modal.querySelector('[data-external-link-dont-show]');
      if (checkbox.checked) {
        try {
          window.localStorage.setItem(EXTERNAL_LINK_STORAGE_KEY, 'true');
        } catch (error) {
          // Ignore storage failures and continue to open the link.
        }
      }

      const url = pendingUrl;
      closeModal();
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    const updateModalContent = (language) => {
      const translations = getTranslations(language);
      modal.querySelector('.external-link-warning-title').textContent = translations.title;
      modal.querySelector('.external-link-warning-message').textContent = translations.message;
      modal.querySelector('.external-link-warning-checkbox span').textContent = translations.checkboxLabel;
      modal.querySelector('[data-external-link-cancel]').textContent = translations.cancelLabel;
      modal.querySelector('[data-external-link-continue]').textContent = translations.continueLabel;
      modal.setAttribute('data-language', language);
    };

    const openModal = (url) => {
      if (shouldBypassExternalWarning()) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      pendingUrl = url;
      updateModalContent(getCurrentLanguage());
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('external-link-warning-open');
      modal.querySelector('[data-external-link-dont-show]').checked = false;
      modal.querySelector('[data-external-link-continue]').focus();
    };

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.querySelector('[data-external-link-cancel]').addEventListener('click', closeModal);
    modal.querySelector('[data-external-link-continue]').addEventListener('click', continueNavigation);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    document.querySelectorAll('a[href]').forEach((anchor) => {
      enhanceExternalLink(anchor);
    });

    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a');
      if (!anchor || !isExternalLink(anchor) || shouldSkipLink(anchor)) {
        return;
      }

      if (shouldBypassExternalWarning()) {
        return;
      }

      event.preventDefault();
      openModal(anchor.href);
    });
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

  function initSearch() {
    const searchInput = document.querySelector('[data-search-input]');
    const searchForm = document.querySelector('[data-search-form]');
    const resultsContainer = document.querySelector('[data-search-results]');
    const summaryContainer = document.querySelector('[data-search-summary]');
    const fallbackContainer = document.querySelector('[data-search-fallback]');

    if (!searchInput || !resultsContainer) {
      return;
    }

    const normalizedBaseUrl = getBaseUrl() === '/' ? '' : getBaseUrl();
    const indexUrl = `${normalizedBaseUrl}/pagefind/index.json`;
    const resultLimit = 12;
    let searchTimer = null;
    let searchIndex = null;

    const getLanguage = () => getCurrentLanguage();

    const loadIndex = async () => {
      if (Array.isArray(searchIndex) && searchIndex.length > 0) {
        return searchIndex;
      }

      const response = await fetch(indexUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Search index unavailable');
      }

      const data = await response.json();
      searchIndex = Array.isArray(data) ? data : [];
      return searchIndex;
    };

    const scoreEntry = (entry, query, tokens) => {
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
    };

    const isMatch = (entry, queryTokens) => {
      const haystack = normalizeText(`${entry.title} ${entry.category} ${entry.excerpt} ${entry.content}`);
      return queryTokens.every((token) => haystack.includes(token));
    };

    const createExcerpt = (entry, tokens) => {
      const source = entry.excerpt || entry.content || '';
      const normalizedSource = source.replace(/\s+/g, ' ').trim();
      const snippet = normalizedSource.length > 280 ? `${normalizedSource.slice(0, 280).trim()}…` : normalizedSource;
      let highlighted = escapeHtml(snippet);

      tokens.forEach((token) => {
        const pattern = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        highlighted = highlighted.replace(pattern, '<mark>$1</mark>');
      });

      return highlighted;
    };

    const renderResults = (results, query) => {
      if (!results.length) {
        if (summaryContainer) {
          summaryContainer.textContent = `No results found for "${query}".`;
        }
        resultsContainer.innerHTML = '<p class="search-empty">No results found.</p>';
        return;
      }

      if (summaryContainer) {
        summaryContainer.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found for "${query}".`;
      }

      const items = results.slice(0, resultLimit).map((result) => {
        const item = result.item;
        const title = escapeHtml(item.title || 'Untitled');
        const category = item.category ? `<span class="search-result-meta">${escapeHtml(item.category)}</span>` : '';
        const date = item.date ? `<span class="search-result-meta">${escapeHtml(item.date)}</span>` : '';
        const excerpt = createExcerpt(item, tokenize(query));

        return `
          <li class="search-result">
            <a href="${escapeHtml(item.url)}" class="search-result-link">
              <h3>${title}</h3>
              <p class="search-result-meta">${date}${date && category ? ' · ' : ''}${category}</p>
              <p class="search-result-excerpt">${excerpt}</p>
            </a>
          </li>`;
      }).join('');

      resultsContainer.innerHTML = `<ul class="search-results">${items}</ul>`;
    };

    const performSearch = async (query) => {
      const trimmedQuery = String(query || '').trim();
      if (!trimmedQuery) {
        resultsContainer.innerHTML = '';
        if (summaryContainer) {
          summaryContainer.textContent = '';
        }
        if (fallbackContainer) {
          fallbackContainer.style.display = 'block';
        }
        return;
      }

      if (fallbackContainer) {
        fallbackContainer.style.display = 'none';
      }

      try {
        const index = await loadIndex();
        const tokens = tokenize(trimmedQuery);
        const normalizedQuery = normalizeText(trimmedQuery);
        const currentLanguage = getLanguage();
        const results = index
          .filter((item) => item && item.type === 'posts')
          .filter((item) => String(item.language || '').toLowerCase().startsWith('pt') ? currentLanguage === 'pt' : currentLanguage === DEFAULT_LANGUAGE)
          .map((item) => ({ item, score: scoreEntry(item, normalizedQuery, tokens) }))
          .filter((entry) => entry.score > 0 && isMatch(entry.item, tokens))
          .sort((a, b) => b.score - a.score);

        renderResults(results, trimmedQuery);
      } catch (error) {
        console.error('Search error:', error);
        if (summaryContainer) {
          summaryContainer.textContent = 'Search is temporarily unavailable.';
        }
        resultsContainer.innerHTML = '<p class="search-empty">Search is temporarily unavailable.</p>';
      }
    };

    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    if (initialQuery) {
      searchInput.value = initialQuery;
      performSearch(initialQuery);
    }

    searchInput.addEventListener('input', (event) => {
      if (searchTimer) {
        window.clearTimeout(searchTimer);
      }

      searchTimer = window.setTimeout(() => {
        performSearch(event.target.value);
      }, 120);
    });

    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        performSearch(searchInput.value);
      });
    }

    if (fallbackContainer) {
      fallbackContainer.style.display = searchInput.value.trim() ? 'none' : 'block';
    }
  }

  function initGallery() {
    const galleries = document.querySelectorAll('[data-gallery]');
    if (!galleries.length) {
      return;
    }

    const createLightbox = () => {
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
    };

    const lightbox = createLightbox();
    let currentImageSet = [];
    let currentImageIndex = 0;

    const updateLightbox = (imageData) => {
      const imageElement = lightbox.querySelector('.lightbox-image');
      const captionElement = lightbox.querySelector('.lightbox-caption');
      imageElement.src = imageData.src;
      imageElement.alt = imageData.alt;
      captionElement.textContent = imageData.caption || imageData.alt;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox-close').focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const showNextImage = () => {
      if (!currentImageSet.length) {
        return;
      }

      currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
      updateLightbox(currentImageSet[currentImageIndex]);
    };

    const showPrevImage = () => {
      if (!currentImageSet.length) {
        return;
      }

      currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
      updateLightbox(currentImageSet[currentImageIndex]);
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('active')) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        showPrevImage();
      } else if (event.key === 'ArrowRight') {
        showNextImage();
      } else if (event.key === 'Escape') {
        closeLightbox();
      }
    });

    galleries.forEach((gallery) => {
      const items = gallery.querySelectorAll('img');
      const imageSet = [];

      items.forEach((image, index) => {
        imageSet.push({
          src: image.currentSrc || image.src,
          alt: image.alt,
          caption: image.getAttribute('data-caption') || image.alt
        });

        image.addEventListener('click', () => {
          currentImageSet = imageSet;
          currentImageIndex = index;
          updateLightbox(imageSet[index]);
        });

        image.style.cursor = 'pointer';
      });
    });
  }

  function init() {
    initLanguageSwitcher();
    initNavigation();
    initExternalLinkWarning();
    initSearch();
    initGallery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
