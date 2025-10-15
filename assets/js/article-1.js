// article-1.js
// Builds Table of Contents and enables smooth scrolling + active link highlight

(function(){
  function slugify(text){
    return text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  }

  function buildTOC(containerSelector, headingsSelector){
    const container = document.querySelector(containerSelector);
    if(!container) return;
    const headings = document.querySelectorAll(headingsSelector);
    if(!headings.length) return;

    const nav = document.createElement('div');
    headings.forEach(h => {
      if(!h.id) h.id = slugify(h.textContent);
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.addEventListener('click', (e)=>{
        e.preventDefault();
        document.querySelector('#' + h.id).scrollIntoView({behavior:'smooth',block:'start'});
        history.replaceState(null,'', '#' + h.id);
      });
      nav.appendChild(a);
    });
    container.appendChild(nav);
  }

  // build for desktop and mobile containers
  document.addEventListener('DOMContentLoaded', ()=>{
    buildTOC('#toc', '.article-content h2, .article-content h3');
    buildTOC('#toc-mobile', '.article-content h2, .article-content h3');

    // observe scroll to highlight active
    const links = document.querySelectorAll('.toc-card a');
    const headingEls = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'));
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const id = entry.target.id;
          document.querySelectorAll('.toc-card a').forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+id));
        }
      });
    },{root:null,rootMargin:'-40% 0px -40% 0px',threshold:0});

    headingEls.forEach(h=>observer.observe(h));
  });
})();
