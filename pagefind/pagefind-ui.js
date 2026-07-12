/**
 * Pagefind UI Stub
 * Minimal implementation to prevent 404 errors
 */

(function() {
  'use strict';

  // Simple Pagefind UI stub
  window.PagefindUI = function(options) {
    this.options = options || {};
    this.element = options.element || document.body;
    this.setupUI();
  };

  window.PagefindUI.prototype.setupUI = function() {
    if (!this.element) return;
    
    // Create a simple search UI
    const container = document.createElement('div');
    container.className = 'pagefind-ui';
    container.innerHTML = `
      <form class="pagefind-ui__form">
        <input type="text" 
               class="pagefind-ui__input" 
               placeholder="Search..."
               aria-label="Search">
      </form>
      <div class="pagefind-ui__results"></div>
    `;
    
    if (this.element) {
      this.element.appendChild(container);
    }
  };

  // Stub for pagefind API
  window.pagefind = {
    init: function() {
      return Promise.resolve();
    },
    search: function(term) {
      return Promise.resolve({ results: [] });
    }
  };
})();
