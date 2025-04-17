// News page functionality
function loadNewsPage() {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const news = storageService.getNews();
  
  // Build page HTML
  let pageHTML = `
    <div id="news" class="page">
      <header>
        <h1 class="text-2xl font-semibold">News & Announcements</h1>
        <p class="text-secondary text-sm">Stay updated with the latest crypto news</p>
      </header>
  `;
  
  // Add news components
  pageHTML += UI.newsArticles(news);
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Initially show only first 3 news items
  const newsItems = document.querySelectorAll('.news-article');
  if (newsItems.length > 3) {
    for (let i = 3; i < newsItems.length; i++) {
      newsItems[i].style.display = 'none';
    }
  }
  
  // Set up event listeners
  setupNewsEvents();
}

// Set up news page event handlers
function setupNewsEvents() {
  // News filter buttons
  const newsFilterBtns = document.querySelectorAll('.news-filter-btn');
  newsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      newsFilterBtns.forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
      
      // Apply filter
      const category = btn.getAttribute('data-category');
      filterNews(category);
    });
  });
  
  // Load more button
  const loadMoreBtn = document.getElementById('load-more-news');
  let showingAll = false;
  
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const newsItems = document.querySelectorAll('.news-article');
      
      if (!showingAll) {
        // Show all news
        newsItems.forEach(item => {
          item.style.display = 'block';
        });
        loadMoreBtn.textContent = 'Show Less';
        showingAll = true;
      } else {
        // Reset to showing only first 3 visible items
        let visibleCount = 0;
        
        newsItems.forEach((item, index) => {
          if (item.style.display !== 'none' && visibleCount < 3) {
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        
        loadMoreBtn.textContent = 'Load More News';
        showingAll = false;
      }
    });
  }
}

// Filter news based on category
function filterNews(category) {
  const newsItems = document.querySelectorAll('.news-article');
  const loadMoreBtn = document.getElementById('load-more-news');
  
  let visibleCount = 0;
  
  newsItems.forEach(item => {
    const itemCategory = item.getAttribute('data-category');
    
    if (category === 'All News' || itemCategory === category) {
      if (visibleCount < 3) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    } else {
      item.style.display = 'none';
    }
  });
  
  // Update load more button text
  if (loadMoreBtn) {
    loadMoreBtn.textContent = 'Load More News';
  }
}