// Dashboard page functionality
function loadDashboardPage() {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const user = storageService.getUser();
  const myProjects = storageService.getMyProjects();
  const allProjects = storageService.getAllProjects();
  const news = storageService.getNews();
  
  // Build page HTML
  let pageHTML = `
    <div id="dashboard" class="page">
      <header>
        <h1 class="text-2xl font-semibold">Dashboard</h1>
        <p class="text-secondary text-sm">Track your crypto airdrop projects</p>
      </header>
  `;
  
  // Add dashboard components
  pageHTML += UI.dashboardSummary(user);
  pageHTML += UI.myProjects(myProjects, allProjects);
  pageHTML += UI.newsPreview(news);
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Set up dashboard-specific event listeners
  setupDashboardEvents();
}

// Set up dashboard-specific event handlers
function setupDashboardEvents() {
  // Project card click events are handled in app.js
}

// Initialize any dashboard charts or dynamic elements
function initDashboardCharts() {
  // No charts on the dashboard page for now
}