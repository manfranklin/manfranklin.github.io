/**
 * Pagefind UI Stub
 * Minimal implementation to prevent 404 errors.
 */

(function () {
  'use strict';

  class PagefindUI {
    constructor(options = {}) {
      this.options = options;
      this.element = options.element || document.body;
      this.render();
    }

    render() {
      if (!this.element) {
        return;
      }

      const container = document.createElement('div');
      container.className = 'pagefind-ui';
      container.appendChild(this.createForm());
      container.appendChild(this.createResultsRegion());
      this.element.appendChild(container);
    }

    createForm() {
      const form = document.createElement('form');
      form.className = 'pagefind-ui__form';

      const input = document.createElement('input');
      input.className = 'pagefind-ui__input';
      input.type = 'text';
      input.placeholder = 'Search...';
      input.setAttribute('aria-label', 'Search');

      form.appendChild(input);
      return form;
    }

    createResultsRegion() {
      const results = document.createElement('div');
      results.className = 'pagefind-ui__results';
      return results;
    }
  }

  window.PagefindUI = PagefindUI;
  window.pagefind = {
    init: async () => undefined,
    search: async () => ({ results: [] })
  };
})();
