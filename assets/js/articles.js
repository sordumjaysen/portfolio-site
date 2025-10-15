/* =========================================================
   articles.js
   Shared behavior for all article pages.
   Place this in /assets/js/articles.js and include it
   in every article HTML file with:
     <script src="/assets/js/articles.js" defer></script>
   ---------------------------------------------------------
   Capabilities:
   - Detects if the current page is an article (presence of <article>)
   - Builds a dynamic Table of Contents (TOC) and injects into #toc
   - Enables smooth scrolling when TOC links are clicked
   - Highlights the active section as the user scrolls
   - Lightweight, dependency-free, and well-commented
   ======================================================== */

(function(){
  'use strict';

  // --- Helper utilities --------------------------------------------------
  function q(selector, root=document){ return root.querySelector(selector); }
  function qa(selector, root=document){ return Array.from(root.querySelectorAll(selector)); }
  function isArticlePage(){
    // Heuristics to decide if current page is an article:
    // 1) There's an <article> element OR
    // 2) body has class "article" OR "article-page"
    if (q('article')) return true;
    const bodyClass = document.body.className || '';
    if (/(\barticle\b|\barticle-page\b)/i.test(bodyClass)) return true;
    // As a last resort, look for a main content container with a common class name
    if (q('.article-content')) return true;
    return false;
  }

  // --- TOC building ------------------------------------------------------
  function buildTOC(){
    const article = q('article') || q('.article-content');
    if (!article) return null;

    // Select headings to include in TOC (h2 and h3 are common)
    const headings = qa('h2, h3', article);
    if (!headings.length) return null;

    // Create container if not present
    let toc = q('#toc');
    if (!toc){
      const wrapper = document.createElement('nav');
      wrapper.id = 'toc';
      wrapper.setAttribute('aria-label', 'Table of contents');
      const tocWrapper = document.createElement('div');
      tocWrapper.className = 'toc-wrapper';
      wrapper.appendChild(tocWrapper);
      // Try to insert into a sidebar or before the article
      const sidebar = q('.sidebar') || q('.page-grid') || document.body;
      // If we found a .page-grid, place the TOC in the second column; otherwise insert before article
      if (q('.page-grid')){
        // create a column container if necessary
        toc = document.createElement('aside');
        toc.id = 'toc';
        toc.setAttribute('aria-label','Table of contents');
        toc.className = 'toc-wrapper';
        const grid = q('.page-grid');
        // append to grid (second column) - grid CSS should handle sticky behaviour
        grid.appendChild(toc);
      } else {
        (sidebar || document.body).insertBefore(wrapper, article);
        toc = wrapper;
      }
      // create list
      const ul = document.createElement('ul');
      toc.appendChild(ul);
    }

    const ul = toc.querySelector('ul') || toc.appendChild(document.createElement('ul'));

    // Build list items. Ensure each heading has an id for linking.
    headings.forEach((h, idx) => {
      if (!h.id){
        // create a safe id from text content
        const base = h.textContent.trim().toLowerCase().replace(/[^a-z0-9\- ]+/g,'').replace(/\s+/g,'-').slice(0,60);
        let candidate = base || ('heading-' + idx);
        // ensure uniqueness
        let i = 1;
        while (document.getElementById(candidate)){
          candidate = base + '-' + i++;
        }
        h.id = candidate;
      }
      const li = document.createElement('li');
      // Indent h3 items visually by adding a class
      if (h.tagName.toLowerCase() === 'h3') li.style.paddingLeft = '12px';
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', function(e){
        e.preventDefault();
        // Use smooth scroll. The CSS scroll-margin-top on headings handles offset.
        document.getElementById(h.id).scrollIntoView({behavior:'smooth', block:'start'});
        // update URL hash without jumping
        history.replaceState(null, '', '#' + h.id);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });

    return { toc, headings };
  }

  // --- Active section highlight using IntersectionObserver --------------
  function activateOnScroll(headings, toc){
    if (!headings || !headings.length) return;
    const links = Array.from(toc.querySelectorAll('a'));

    // Map id -> link for quick lookup
    const idToLink = {};
    links.forEach(l => {
      try {
        const id = l.getAttribute('href').slice(1);
        if (id) idToLink[id] = l;
      }catch(e){}
    });

    // IntersectionObserver options tuned for article reading
    const obs = new IntersectionObserver((entries) => {
      // Find the most visible heading
      let visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible){
        // Clear active classes
        Object.values(idToLink).forEach(l => l.classList.remove('active'));
        const id = visible.target.id;
        const link = idToLink[id];
        if (link) link.classList.add('active');
      }
    }, { root: null, rootMargin: '0px 0px -60% 0px', threshold: [0, 0.1, 0.4, 0.75, 1] });

    headings.forEach(h => obs.observe(h));
  }

  // --- Initialize when DOM is ready ------------------------------------
  function init(){
    if (!isArticlePage()) return;

    // Build or refresh the TOC
    const built = buildTOC();
    if (!built) return;
    const { toc, headings } = built;

    // Activate highlighting
    activateOnScroll(headings, toc);

    // Improve keyboard accessibility: focus management for TOC
    toc.setAttribute('tabindex','0');

    // Optional: collapse/expand TOC on narrow screens
    // (simple toggle added for mobile ergonomics)
    if (window.matchMedia && window.matchMedia('(max-width:999px)').matches){
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'toc-toggle';
      toggle.textContent = 'Contents';
      toggle.style.display = 'block';
      toggle.style.marginBottom = '8px';
      const parent = toc.parentElement || toc;
      parent.insertBefore(toggle, toc);
      toggle.addEventListener('click', () => {
        toc.classList.toggle('open');
      });
    }

    // Expose a small API for other scripts if needed
    window.__article = window.__article || {};
    window.__article.rebuildTOC = function(){ 
      // remove old TOC and build anew
      const old = document.getElementById('toc');
      if (old) old.remove();
      return buildTOC();
    };
  }

  // Wait for DOMContentLoaded or run immediately if already ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

