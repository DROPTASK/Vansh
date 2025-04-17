// Main application logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize application
  initApp();
  
  // Set up event listeners
  setupEventListeners();
});

// Initialize the application
function initApp() {
  // Load initial state from local storage
  const currentTheme = storageService.getTheme();
  applyTheme(currentTheme);
  
  // Set default page to dashboard if no hash
  if (!window.location.hash) {
    window.location.hash = 'dashboard';
  }
  
  // Handle initial route
  handleRouteChange();
}

// Set up event listeners
function setupEventListeners() {
  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', toggleTheme);
  
  // Navigation items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // Update active class
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Handle browser navigation and hash changes
  window.addEventListener('hashchange', handleRouteChange);
  
  // Check and reset daily tasks every 5 minutes
  setInterval(() => {
    storageService.checkDailyTasksReset();
  }, 5 * 60 * 1000);
}

// Toggle between light and dark theme
function toggleTheme() {
  const bodyElement = document.body;
  const themeLink = document.getElementById('theme-css');
  const themeIconElement = document.querySelector('#theme-toggle i');
  
  if (bodyElement.classList.contains('theme-light')) {
    // Switch to dark theme
    bodyElement.classList.remove('theme-light');
    bodyElement.classList.add('theme-dark');
    themeLink.href = 'styles/theme-dark.css';
    themeIconElement.className = 'ri-moon-line';
    storageService.setTheme('dark');
  } else {
    // Switch to light theme
    bodyElement.classList.remove('theme-dark');
    bodyElement.classList.add('theme-light');
    themeLink.href = 'styles/theme-light.css';
    themeIconElement.className = 'ri-sun-line';
    storageService.setTheme('light');
  }
}

// Apply theme based on stored preference
function applyTheme(theme) {
  const bodyElement = document.body;
  const themeLink = document.getElementById('theme-css');
  const themeIconElement = document.querySelector('#theme-toggle i');
  
  if (theme === 'dark') {
    bodyElement.classList.remove('theme-light');
    bodyElement.classList.add('theme-dark');
    themeLink.href = 'styles/theme-dark.css';
    themeIconElement.className = 'ri-moon-line';
  } else {
    bodyElement.classList.remove('theme-dark');
    bodyElement.classList.add('theme-light');
    themeLink.href = 'styles/theme-light.css';
    themeIconElement.className = 'ri-sun-line';
  }
}

// Handle route changes
function handleRouteChange() {
  const contentArea = document.getElementById('content-area');
  const hash = window.location.hash.substring(1) || 'dashboard';
  const route = hash.split('/')[0]; // Extract main route, ignoring parameters
  
  // Update active navigation item
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-page') === route) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Show loading spinner
  contentArea.innerHTML = UI.loadingSpinner();
  
  // Load the appropriate page content
  switch (route) {
    case 'dashboard':
      loadDashboardPage();
      break;
    case 'investment':
      loadInvestmentPage();
      break;
    case 'explore':
      if (hash.includes('/project/')) {
        const projectId = hash.split('/project/')[1];
        loadProjectDetailPage(projectId);
      } else {
        loadExplorePage();
      }
      break;
    case 'statistics':
      loadStatisticsPage();
      break;
    case 'tasks':
      loadTasksPage();
      break;
    case 'news':
      loadNewsPage();
      break;
    default:
      contentArea.innerHTML = UI.notFound();
      break;
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Global event handlers for common UI actions
document.addEventListener('click', function(e) {
  // Check if clicked element is a project card
  if (e.target.closest('.project-card')) {
    const card = e.target.closest('.project-card');
    const projectId = card.getAttribute('data-id');
    window.location.hash = `explore/project/${projectId}`;
  }
});