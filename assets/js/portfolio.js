// Portfolio JS

// Sample articles/projects
const ITEMS = [
  {
    id: 1,
    title: 'Cloud Networking Explained: Mastering Hybrid and Multi-Cloud Strategies for IT Excellence',
    excerpt: 'This article explains how hybrid and multi-cloud networking work, highlighting their components, differences, benefits, challenges, and strategies IT professionals should know.',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop',
    author: 'Jaysen Sordum Barikpoa',
    date: '10 min read',
    published: '2025-09-29',
    content: `<p>Cloud networking combines on-premises infrastructure and cloud resources to provide scalable, flexible connectivity. In this article we cover design patterns, security considerations, and best practices for implementing hybrid cloud networking.</p><p>Read on for diagrams and configuration examples.</p>`
  },
  {
    id: 2,
    title: 'Remote Work vs. Office: Finding the Hybrid Balance',
    excerpt: 'This article explores how companies can strike the perfect balance between remote and in-office work, revealing how a well-designed hybrid model can boost productivity and culture.',
    img: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1400&q=60=crop',
    author: 'Jaysen Sordum Barikpoa',
    date: '10 min read',
    published: '2025-10-13',
    content: `<p>Hybrid models combine flexibility with structured collaboration. This piece explores policy design, communication tools, and manager training to make hybrid work actually work.</p>`
  },
  {
    id: 3,
    title: 'AI in Cybersecurity: Friend or Foe?',
    excerpt: 'Exploring how AI is reshaping cybersecurity as both a powerful defence tool and a dangerous weapon, and asking the big question: friend or foe?',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop',
    author: 'Jaysen Sordum Barikpoa',
    date: '8 min read',
    published: '2025-09-27',
    content: `<p>AI helps detect anomalies at scale but also helps attackers craft automated, targeted attacks. We look at defensive architectures and ethical concerns.</p>`
  },
  {
    id: 4,
    title: 'Agentic AI: How Autonomous Agents Could Transform Small Businesses in Africa—With Realistic Expectations',
    excerpt: 'How autonomous AI could help African SMEs save time, streamline operations, and boost growth—while navigating real-world challenges.',
    img: 'https://media.licdn.com/dms/image/v2/D4D12AQE5hlJRYq2W-g/article-cover_image-shrink_720_1280/B4DZlPMxLXJgAI-/0/1757970372078?e=1763596800&v=beta&t=a6QOyyQcJPODFVDC3FpRJ41SCP6pIMZb7HAOXJ4xuAE',
    author: 'Jaysen Sordum Barikpoa',
    date: '4 min read',
    published: '2025-10-15',
    content: `<p>Practical uses of autonomous agents include automating customer service, procurement, and repetitive bookkeeping tasks. Here we show examples and warn about governance issues.</p>`
  },
  {
    id: 5,
    title: 'Future-Proof Your Career in the Age of AI',
    excerpt: 'This article explores how early-career professionals can adapt, upskill, and thrive in the age of AI by leveraging tools and human strengths.',
    img: 'https://media.licdn.com/dms/image/v2/D5612AQFvWBUkHeFPNA/article-cover_image-shrink_600_2000/B56ZlxxUE1I4AQ-/0/1758550384470?e=1763596800&v=beta&t=A2VG3Riz7foXLBNQzDIFFBLR2YjhMqcD9keZs_cDYVw',
    author: 'Jaysen Sordum Barikpoa',
    date: '8 min read',
    published: '2025-10-20',
    content: `<p>Upskilling, building T-shaped expertise, and focusing on creative problem solving will help professionals stay relevant. This guide contains practical steps to start today.</p>`
  },
  {
    id: 6,
    title: 'Hybrid Project Management in Product Development: Agile Meets Waterfall',
    excerpt: 'Hybrid project management combines the flexibility of Agile with the structure of Waterfall, allowing teams to adapt to change while maintaining clear planning and control.',
    img: 'https://images.unsplash.com/photo-1649478680984-01586ce84ac0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1334',
    author: 'Jaysen Sordum Barikpoa',
    date: '10 min read',
    published: '2025-10-25',
    content: `<p>Blending Agile and Waterfall through hybrid project management lets teams deliver faster, maintain quality, and adapt to change. This guide offers practical strategies to implement hybrid approaches effectively in software and manufacturing projects.</p>`
  }


];

// Pagination config
const PER_PAGE = 6;
let currentPage = 1;
let currentView = 'modal'; // or 'page'

// DOM refs
const cardsEl = document.getElementById('cards');
const countEl = document.getElementById('items-count');
const paginationEl = document.getElementById('pagination');
const viewModalBtn = document.getElementById('viewModalBtn');
const viewPageBtn = document.getElementById('viewPageBtn');

// Bootstrap modal instance
const articleModalEl = document.getElementById('articleModal');
const bsModal = new bootstrap.Modal(articleModalEl);

function render() {
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = ITEMS.slice(start, start + PER_PAGE);

  cardsEl.innerHTML = '';
  pageItems.forEach(item => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-thumb" style="background-image:url('${item.img}')" aria-hidden="true"></div>
      <div class="article-body">
        <h3 class="article-title">${item.title}</h3>
        <p class="article-excerpt">${item.excerpt}</p>
        <div class="mt-auto">
          <div class="meta-row mb-2"><span>${item.author}</span><span class="dot"></span><span>${item.date}</span></div>
        </div>
        <div class="card-footer">
          <div>
            <button class="btn-plain btn-open-modal" data-id="${item.id}">Read (Modal)</button>
          </div>
          <div>
            <a class="btn btn-sm btn-outline-secondary" href="articles/article-${item.id}.html" target="_blank">Open Page <i class="bi bi-box-arrow-up-right ms-1"></i></a>
          </div>
        </div>
      </div>
    `;

    // Entire card clickable to open modal/page based on current view
    card.addEventListener('click', (e) => {
      // prevent double-handling when buttons clicked
      const isBtn = e.target.closest('button') || e.target.closest('a');
      if (isBtn) return;

      if (currentView === 'modal') openModal(item.id);
      else window.open(`article-${item.id}.html`, '_blank');
    });

    // Modal buttons
    card.querySelector('.btn-open-modal').addEventListener('click', (ev) => {
      ev.stopPropagation();
      openModal(item.id);
    });

    cardsEl.appendChild(card);
  });

  countEl.textContent = ITEMS.length;
  renderPagination();
}

function renderPagination() {
  const pages = Math.ceil(ITEMS.length / PER_PAGE);
  paginationEl.innerHTML = '';
  for (let p = 1; p <= pages; p++) {
    const li = document.createElement('li');
    li.className = 'page-item ' + (p === currentPage ? 'active' : '');
    li.innerHTML = `<a class="page-link" href="#">${p}</a>`;
    li.addEventListener('click', (e) => { e.preventDefault(); currentPage = p; render(); });
    paginationEl.appendChild(li);
  }
}

function openModal(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalMeta').textContent = `${item.author} • ${item.published} • ${item.date}`;
  document.getElementById('modalHero').style.backgroundImage = `url('${item.img}')`;
  document.getElementById('modalBody').innerHTML = item.content;
  bsModal.show();
}

// View toggle
viewModalBtn.addEventListener('click', () => { currentView = 'modal'; viewModalBtn.classList.add('active'); viewPageBtn.classList.remove('active'); });
viewPageBtn.addEventListener('click', () => { currentView = 'page'; viewPageBtn.classList.add('active'); viewModalBtn.classList.remove('active'); });

// initial render
render();
