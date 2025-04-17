// Explore page functionality
function loadExplorePage() {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const allProjects = storageService.getAllProjects();
  
  // Get unique categories
  const categories = Array.from(new Set(allProjects.map(project => project.category)));
  
  // Build page HTML
  let pageHTML = `
    <div id="explore" class="page">
      <header>
        <h1 class="text-2xl font-semibold">Explore Projects</h1>
        <p class="text-secondary text-sm">Discover new crypto airdrops</p>
      </header>
  `;
  
  // Add explore components
  pageHTML += UI.projectsGrid(allProjects, categories);
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Set up event listeners
  setupExploreEvents();
}

// Load project detail page
function loadProjectDetailPage(projectId) {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const allProjects = storageService.getAllProjects();
  const myProjects = storageService.getMyProjects();
  
  // Find the selected project
  const project = allProjects.find(p => p.id === projectId);
  
  if (!project) {
    contentArea.innerHTML = UI.notFound();
    return;
  }
  
  // Check if project is in my projects
  project.isAdded = myProjects.some(p => p.id === project.id);
  
  // Set page content
  contentArea.innerHTML = UI.projectDetail(project);
  
  // Set up event listeners
  setupProjectDetailEvents(project);
}

// Set up explore page event handlers
function setupExploreEvents() {
  // Search functionality
  const searchInput = document.getElementById('search-projects');
  searchInput.addEventListener('input', filterProjects);
  
  // Toggle filters button
  const toggleFiltersBtn = document.getElementById('toggle-filters');
  const categoryFilters = document.getElementById('category-filters');
  
  toggleFiltersBtn.addEventListener('click', () => {
    if (categoryFilters.style.display === 'none') {
      categoryFilters.style.display = 'flex';
    } else {
      categoryFilters.style.display = 'none';
    }
  });
  
  // Category filter buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // If clear button clicked, reset filters
      if (btn.getAttribute('data-category') === 'clear') {
        filterBtns.forEach(b => b.classList.remove('btn-primary'));
        filterProjects();
        return;
      }
      
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      
      // Apply filter
      filterProjects();
    });
  });
}

// Set up project detail page event handlers
function setupProjectDetailEvents(project) {
  // Back button
  const backBtn = document.getElementById('back-to-explore');
  backBtn.addEventListener('click', () => {
    window.location.hash = 'explore';
  });
  
  // Favorite toggle
  const favoriteBtn = document.querySelector('.toggle-favorite');
  favoriteBtn.addEventListener('click', () => {
    // Toggle favorite status
    const updatedProject = { ...project, isFavorite: !project.isFavorite };
    storageService.updateProject(updatedProject);
    
    // Reload page to reflect changes
    loadProjectDetailPage(project.id);
  });
  
  // Add/Remove project toggle
  const addProjectBtn = document.querySelector('.toggle-add-project');
  addProjectBtn.addEventListener('click', () => {
    if (project.isAdded) {
      // Remove from my projects
      storageService.removeFromMyProjects(project.id);
      project.isAdded = false;
    } else {
      // Add to my projects
      storageService.addToMyProjects(project);
      project.isAdded = true;
    }
    
    // Reload page to reflect changes
    loadProjectDetailPage(project.id);
  });
}

// Filter projects based on search and category filters
function filterProjects() {
  const searchTerm = document.getElementById('search-projects').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.btn-primary');
  const categoryFilter = activeFilter ? activeFilter.getAttribute('data-category') : null;
  
  // Get all project cards
  const projectsGrid = document.getElementById('projects-grid');
  const projectCards = projectsGrid.querySelectorAll('.project-card');
  
  // Get all projects to reference data
  const allProjects = storageService.getAllProjects();
  
  // Filter projects
  projectCards.forEach(card => {
    const projectId = card.getAttribute('data-id');
    const project = allProjects.find(p => p.id === projectId);
    
    if (!project) return;
    
    const matchesSearch = project.name.toLowerCase().includes(searchTerm) || 
                         project.description.toLowerCase().includes(searchTerm);
    const matchesCategory = !categoryFilter || categoryFilter === 'clear' || project.category === categoryFilter;
    
    if (matchesSearch && matchesCategory) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}