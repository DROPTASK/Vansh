// UI Components for generating HTML

const UI = {
  // Dashboard summary component
  dashboardSummary(user) {
    // Calculate real percentages
    const projectPercentage = user.totalProjects > 0 ? Math.round((user.projectsAdded / user.totalProjects) * 100) : 0;
    const taskPercentage = user.totalTasks > 0 ? Math.round((user.tasksCompleted / user.totalTasks) * 100) : 0;
    
    return `
      <div class="dashboard-summary mb-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="summary-box card">
            <div class="summary-box-icon">
              <i class="ri-money-dollar-circle-line"></i>
            </div>
            <div class="summary-box-content">
              <h3 class="text-sm text-secondary">Total Investment</h3>
              <div class="flex items-center">
                <p class="text-xl font-semibold">$${user.totalInvestment.toLocaleString()}</p>
                <span class="badge ${user.investmentChange > 0 ? 'badge-success' : 'badge-error'} ml-2">
                  <i class="ri-arrow-${user.investmentChange > 0 ? 'up' : 'down'}-s-line mr-1"></i>
                  ${user.investmentChange > 0 ? '+' : ''}$${user.investmentChange}
                </span>
              </div>
            </div>
          </div>
          
          <div class="summary-box card">
            <div class="summary-box-icon earning">
              <i class="ri-coin-line"></i>
            </div>
            <div class="summary-box-content">
              <h3 class="text-sm text-secondary">Total Earnings</h3>
              <div class="flex items-center">
                <p class="text-xl font-semibold">$${user.totalEarnings.toLocaleString()}</p>
                <span class="badge ${user.earningsChange > 0 ? 'badge-success' : 'badge-error'} ml-2">
                  <i class="ri-arrow-${user.earningsChange > 0 ? 'up' : 'down'}-s-line mr-1"></i>
                  ${user.earningsChange > 0 ? '+' : ''}$${user.earningsChange}
                </span>
              </div>
            </div>
          </div>
          
          <div class="summary-box card">
            <div class="summary-box-icon project">
              <i class="ri-folder-line"></i>
            </div>
            <div class="summary-box-content">
              <h3 class="text-sm text-secondary">Projects Added</h3>
              <div class="flex items-center">
                <p class="text-xl font-semibold">${user.projectsAdded}</p>
                <span class="badge text-secondary ml-2">
                  <i class="ri-bar-chart-line mr-1"></i> ${projectPercentage}%
                </span>
              </div>
              <div class="progress-mini-container">
                <div class="progress-mini-bar" style="width: ${projectPercentage}%"></div>
              </div>
              <div class="text-xs text-secondary mt-1">
                <span class="font-medium">${user.projectsAdded} of ${user.totalProjects}</span> projects
              </div>
            </div>
          </div>
          
          <div class="summary-box card">
            <div class="summary-box-icon task">
              <i class="ri-task-line"></i>
            </div>
            <div class="summary-box-content">
              <h3 class="text-sm text-secondary">Tasks Completed</h3>
              <div class="flex items-center">
                <p class="text-xl font-semibold">${user.tasksCompleted}</p>
                <span class="badge text-secondary ml-2">
                  <i class="ri-bar-chart-line mr-1"></i> ${taskPercentage}%
                </span>
              </div>
              <div class="progress-mini-container">
                <div class="progress-mini-bar" style="width: ${taskPercentage}%"></div>
              </div>
              <div class="text-xs text-secondary mt-1">
                <span class="font-medium">${user.tasksCompleted} of ${user.totalTasks}</span> tasks
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // My projects component
  myProjects(projects, allProjects) {
    // If no projects added yet, show a message
    if (projects.length === 0) {
      return `
        <div class="my-projects card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">My Projects</h2>
            <a href="#explore" class="btn btn-primary btn-sm">Explore Projects</a>
          </div>
          <div class="empty-state">
            <p class="text-center text-secondary">You haven't added any projects yet. Explore and add projects to track them here.</p>
          </div>
        </div>
      `;
    }
    
    // Otherwise, show the projects
    const projectCards = projects.map(project => this.projectCard(project)).join('');
    
    return `
      <div class="my-projects card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">My Projects</h2>
          <a href="#explore" class="btn btn-primary btn-sm">Explore Projects</a>
        </div>
        <div class="projects-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${projectCards}
        </div>
      </div>
    `;
  },
  
  // Project card component
  projectCard(project) {
    return `
      <div class="project-card" data-id="${project.id}">
        <div class="card-content" style="background: linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo}); border-color: ${project.borderColor}">
          <div class="card-header">
            <div class="project-logo">
              <img src="${project.logo}" alt="${project.name} logo" />
            </div>
            <div class="favorite-icon ${project.isFavorite ? 'active' : ''}">
              <i class="ri-star-${project.isFavorite ? 'fill' : 'line'}"></i>
            </div>
          </div>
          <div class="card-body">
            <h3 class="project-name">${project.name}</h3>
            <p class="project-category">${project.category}</p>
            <p class="project-description">${project.description.length > 60 ? project.description.substring(0, 60) + '...' : project.description}</p>
          </div>
        </div>
        <div class="card-footer">
          <div class="project-social">
            <button class="btn btn-icon btn-sm btn-ghost"><i class="ri-twitter-x-line"></i></button>
            <button class="btn btn-icon btn-sm btn-ghost"><i class="ri-discord-line"></i></button>
            <button class="btn btn-icon btn-sm btn-ghost"><i class="ri-telegram-line"></i></button>
          </div>
          <button class="btn btn-sm ${project.isAdded ? 'btn-error' : 'btn-primary'}">
            ${project.isAdded ? 'Leave' : 'Join'}
          </button>
        </div>
      </div>
    `;
  },
  
  // Project detail component
  projectDetail(project) {
    const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    return `
      <div id="project-detail" class="page">
        <div class="page-header">
          <button id="back-to-explore" class="btn btn-ghost btn-sm mb-4">
            <i class="ri-arrow-left-line mr-1"></i> Back to Explore
          </button>
        </div>
        
        <div class="project-header" style="background: linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})">
          <div class="container">
            <div class="project-logo">
              <img src="${project.logo}" alt="${project.name} logo" />
            </div>
            <div class="project-title">
              <h1>${project.name}</h1>
              <div class="project-category">${project.category}</div>
            </div>
            <div class="project-actions">
              <button class="toggle-favorite btn btn-circle btn-sm">
                <i class="ri-star-${project.isFavorite ? 'fill' : 'line'}"></i>
              </button>
              <button class="toggle-add-project btn ${project.isAdded ? 'btn-error' : 'btn-primary'} btn-sm ml-2">
                ${project.isAdded ? 'Remove' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
        
        <div class="project-content card">
          <div class="project-description">
            <h2>Description</h2>
            <p>${project.description}</p>
          </div>
          
          <div class="project-details grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
            <div class="detail-item">
              <h3>Total Funding</h3>
              <p class="value">${project.funding}</p>
            </div>
            <div class="detail-item">
              <h3>Token Reward</h3>
              <p class="value">${project.reward}</p>
            </div>
            <div class="detail-item">
              <h3>TGE Date</h3>
              <p class="value">${project.tgeDate}</p>
            </div>
            <div class="detail-item">
              <h3>Type</h3>
              <p class="value">${project.type}</p>
            </div>
          </div>
          
          <div class="project-tags">
            <h2>Tags</h2>
            <div class="tags-list">
              ${tags}
            </div>
          </div>
          
          <div class="project-tasks mt-6">
            <h2>Project Tasks</h2>
            <div id="project-tasks-list">
              <!-- Tasks will be loaded dynamically -->
              <div class="empty-state">
                <p class="text-center text-secondary">No tasks associated with this project yet.</p>
                <button class="btn btn-primary btn-sm mt-2">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // News preview component for dashboard
  newsPreview(news) {
    // Get latest 3 news items
    const latestNews = news.slice(0, 3);
    const newsItems = latestNews.map(item => `
      <div class="news-item">
        <div class="news-image">
          <img src="${item.image}" alt="${item.title}" />
        </div>
        <div class="news-content">
          <h3 class="news-title">${item.title}</h3>
          <p class="news-date">${item.date}</p>
        </div>
      </div>
    `).join('');
    
    return `
      <div class="news-preview card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Latest News</h2>
          <a href="#news" class="btn btn-outline btn-sm">View All</a>
        </div>
        <div class="news-list">
          ${newsItems}
        </div>
      </div>
    `;
  },
  
  // Investment charts component
  investmentCharts() {
    return `
      <div class="investment-charts card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Investment Performance</h2>
        </div>
        
        <div class="chart-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="chart-container">
            <h3 class="chart-title">Portfolio Growth</h3>
            <canvas id="portfolioChart" height="200"></canvas>
          </div>
          
          <div class="chart-container">
            <h3 class="chart-title">Monthly ROI</h3>
            <canvas id="roiChart" height="200"></canvas>
          </div>
          
          <div class="chart-container">
            <h3 class="chart-title">Monthly Earnings</h3>
            <canvas id="earningsChart" height="200"></canvas>
          </div>
        </div>
      </div>
    `;
  },
  
  // Transaction log component
  transactionLog(transactions) {
    const transactionItems = transactions.map(transaction => `
      <tr class="transaction-item ${transaction.type}">
        <td class="transaction-date">${transaction.date}</td>
        <td class="transaction-project">${transaction.project}</td>
        <td class="transaction-type">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
        <td class="transaction-amount ${transaction.type === 'earning' ? 'earning' : 'investment'}">
          ${transaction.type === 'earning' ? '+' : '-'}$${transaction.amount}
        </td>
      </tr>
    `).join('');
    
    return `
      <div class="transaction-log card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Transaction Log</h2>
          <button id="add-transaction" class="btn btn-primary btn-sm">Add Transaction</button>
        </div>
        
        <div class="transaction-table-container overflow-x-auto">
          <table class="transaction-table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactionItems}
            </tbody>
          </table>
        </div>
        
        <!-- Transaction Modal -->
        <div id="transaction-modal" class="modal" style="display: none;">
          <div class="modal-content card">
            <h2 class="text-lg font-semibold mb-4">New Transaction</h2>
            <form id="transaction-form">
              <div class="form-group mb-4">
                <label for="tx-type">Type</label>
                <select id="tx-type" class="select w-full" required>
                  <option value="investment">Investment</option>
                  <option value="earning">Earning</option>
                </select>
              </div>
              
              <div class="form-group mb-4">
                <label for="tx-project">Project</label>
                <input type="text" id="tx-project" class="input w-full" required placeholder="Enter project name" />
              </div>
              
              <div class="form-group mb-4">
                <label for="tx-amount">Amount ($)</label>
                <input type="number" id="tx-amount" class="input w-full" required placeholder="Enter amount" min="0" step="0.01" />
              </div>
              
              <div class="form-actions flex justify-end">
                <button type="button" id="cancel-transaction" class="btn btn-ghost mr-2">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },
  
  // Projects grid component for explore page
  projectsGrid(projects, categories) {
    // Create filter buttons for each category
    const filterButtons = ['All Projects', ...categories].map(category => `
      <button class="filter-btn ${category === 'All Projects' ? 'btn-primary' : 'btn-outline'}" 
              data-category="${category === 'All Projects' ? 'clear' : category}">
        ${category}
      </button>
    `).join('');
    
    // Create project cards
    const projectCards = projects.map(project => this.projectCard(project)).join('');
    
    return `
      <div class="explore-container">
        <div class="search-bar card mb-4">
          <div class="search-input-container">
            <i class="ri-search-line search-icon"></i>
            <input type="text" id="search-projects" class="search-input" placeholder="Search projects..." />
          </div>
          
          <div class="filter-toggle">
            <button id="toggle-filters" class="btn btn-ghost btn-sm">
              <i class="ri-filter-3-line mr-1"></i> Filters
            </button>
          </div>
        </div>
        
        <div id="category-filters" class="category-filters card mb-4">
          <div class="filter-buttons flex flex-wrap gap-2">
            ${filterButtons}
          </div>
        </div>
        
        <div id="projects-grid" class="projects-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          ${projectCards}
        </div>
      </div>
    `;
  },
  
  // Statistics charts component
  statisticsCharts() {
    return `
      <div class="statistics-container">
        <div class="time-period card mb-4">
          <div class="time-buttons flex flex-wrap gap-2">
            <button class="time-period-btn btn-primary" data-period="week">
              <i class="ri-calendar-line mr-1"></i> Week
            </button>
            <button class="time-period-btn" data-period="month">
              <i class="ri-calendar-check-line mr-1"></i> Month
            </button>
            <button class="time-period-btn" data-period="quarter">
              <i class="ri-calendar-todo-line mr-1"></i> Quarter
            </button>
            <button class="time-period-btn" data-period="year">
              <i class="ri-calendar-event-line mr-1"></i> Year
            </button>
            <button class="time-period-btn" data-period="all">
              <i class="ri-history-line mr-1"></i> All Time
            </button>
          </div>
        </div>
        
        <div class="chart-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="chart-container card">
            <h3 class="chart-title">
              <i class="ri-funds-line mr-1"></i> Portfolio Growth
            </h3>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas id="portfolioGrowthChart"></canvas>
            </div>
            <div class="chart-footer text-center text-sm text-secondary mt-2">
              Based on your investment transactions over time
            </div>
          </div>
          
          <div class="chart-container card">
            <h3 class="chart-title">
              <i class="ri-pie-chart-line mr-1"></i> Project Distribution
            </h3>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas id="projectDistributionChart"></canvas>
            </div>
            <div class="chart-footer text-center text-sm text-secondary mt-2">
              Projects by category
            </div>
          </div>
          
          <div class="chart-container card">
            <h3 class="chart-title">
              <i class="ri-award-line mr-1"></i> Airdrop Success Rate
            </h3>
            <div class="doughnut-wrapper">
              <canvas id="successRateChart"></canvas>
              <div class="doughnut-center">
                <span id="success-rate-value" class="rate-value">0%</span>
                <span class="rate-label">Success</span>
              </div>
            </div>
            <div class="chart-footer text-center text-sm text-secondary mt-2">
              Projects with earnings vs. total projects
            </div>
          </div>
          
          <div class="chart-container card">
            <h3 class="chart-title">
              <i class="ri-task-line mr-1"></i> Task Completion Rate
            </h3>
            <div class="doughnut-wrapper">
              <canvas id="taskCompletionChart"></canvas>
              <div class="doughnut-center">
                <span id="task-completion-value" class="rate-value">0%</span>
                <span class="rate-label">Completed</span>
              </div>
            </div>
            <div class="chart-footer text-center text-sm text-secondary mt-2">
              Completed tasks vs. total tasks
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Tasks overview component
  tasksOverview(user) {
    const completionRate = user.totalTasks > 0 
      ? Math.round((user.tasksCompleted / user.totalTasks) * 100) 
      : 0;
    
    return `
      <div class="tasks-overview card mb-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">
            <i class="ri-task-line mr-1"></i> Tasks Overview
          </h2>
          <div class="flex gap-2">
            <button id="add-custom-task-btn" class="btn btn-outline btn-sm">
              <i class="ri-add-line mr-1"></i> Custom Task
            </button>
            <button id="add-task-btn" class="btn btn-primary btn-sm">
              <i class="ri-add-line mr-1"></i> Add Task
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="stat-box card">
            <div class="stat-box-icon">
              <i class="ri-pie-chart-line"></i>
            </div>
            <div class="stat-box-content">
              <h3 class="stat-title">Completion Rate</h3>
              <div class="progress-container">
                <div class="progress-bar" style="width: ${completionRate}%"></div>
              </div>
              <p class="stat-value">${completionRate}%</p>
            </div>
          </div>
          
          <div class="stat-box card">
            <div class="stat-box-icon">
              <i class="ri-file-list-line"></i>
            </div>
            <div class="stat-box-content">
              <h3 class="stat-title">Total Tasks</h3>
              <p class="stat-value">${user.totalTasks}</p>
            </div>
          </div>
          
          <div class="stat-box card">
            <div class="stat-box-icon completed">
              <i class="ri-check-line"></i>
            </div>
            <div class="stat-box-content">
              <h3 class="stat-title">Completed</h3>
              <p class="stat-value">${user.tasksCompleted}</p>
            </div>
          </div>
          
          <div class="stat-box card">
            <div class="stat-box-icon pending">
              <i class="ri-time-line"></i>
            </div>
            <div class="stat-box-content">
              <h3 class="stat-title">Pending</h3>
              <p class="stat-value">${user.totalTasks - user.tasksCompleted}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  
  // Task list component
  taskList(tasks, allProjects) {
    // Split tasks by type
    const projectTasks = tasks.filter(task => task.type === 'project');
    const customTasks = tasks.filter(task => task.type === 'custom' || task.type === 'daily');
    
    // Create task items HTML
    const projectTasksHTML = projectTasks.length > 0
      ? projectTasks.map(task => this.taskItem(task)).join('')
      : '<div class="empty-state"><p class="text-center text-secondary"><i class="ri-inbox-line text-2xl mb-2"></i><br>No project tasks yet.</p></div>';
    
    const customTasksHTML = customTasks.length > 0
      ? customTasks.map(task => this.taskItem(task)).join('')
      : '<div class="empty-state"><p class="text-center text-secondary"><i class="ri-inbox-line text-2xl mb-2"></i><br>No custom tasks yet.</p></div>';
    
    // Count tasks by status
    const totalProjectTasks = projectTasks.length;
    const completedProjectTasks = projectTasks.filter(task => task.completed).length;
    
    const totalCustomTasks = customTasks.length;
    const completedCustomTasks = customTasks.filter(task => task.completed).length;
    
    // Get all project names for the task modal
    const projectOptions = allProjects.map(project => 
      `<option value="${project.name}">${project.name}</option>`
    ).join('');
    
    return `
      <div class="task-list-container">
        <div class="task-filters card mb-4">
          <div class="filter-buttons flex flex-wrap gap-2">
            <button class="task-filter-btn active" data-filter="all">
              <i class="ri-list-check mr-1"></i> All Tasks
            </button>
            <button class="task-filter-btn" data-filter="pending">
              <i class="ri-time-line mr-1"></i> Pending
            </button>
            <button class="task-filter-btn" data-filter="completed">
              <i class="ri-check-line mr-1"></i> Completed
            </button>
          </div>
        </div>
        
        <div class="task-lists grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="project-tasks card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">
                <i class="ri-folder-line mr-1"></i> Project Tasks
              </h2>
              <div class="task-counter badge">
                ${completedProjectTasks}/${totalProjectTasks}
              </div>
            </div>
            <div id="project-tasks-list" class="tasks-list">
              ${projectTasksHTML}
            </div>
          </div>
          
          <div class="custom-tasks card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">
                <i class="ri-calendar-todo-line mr-1"></i> Custom & Daily Tasks
              </h2>
              <div class="task-counter badge">
                ${completedCustomTasks}/${totalCustomTasks}
              </div>
            </div>
            <div id="custom-tasks-list" class="tasks-list">
              ${customTasksHTML}
            </div>
          </div>
        </div>
        
        <!-- Task Modal -->
        <div id="task-modal" class="modal" style="display: none;">
          <div class="modal-content card">
            <h2 class="text-lg font-semibold mb-4">
              <i class="ri-add-line mr-1"></i> Add New Task
            </h2>
            <form id="task-form">
              <div class="form-group">
                <label for="task-title">
                  <i class="ri-text mr-1"></i> Task Title
                </label>
                <input type="text" id="task-title" class="input w-full" required placeholder="Enter task title" />
              </div>
              
              <div class="form-group">
                <label for="task-project">
                  <i class="ri-folder-line mr-1"></i> Project (Optional)
                </label>
                <select id="task-project" class="select w-full">
                  <option value="">No Project</option>
                  ${projectOptions}
                </select>
              </div>
              
              <div class="form-group">
                <label for="task-due-date">
                  <i class="ri-calendar-line mr-1"></i> Due Date
                </label>
                <input type="date" id="task-due-date" class="input w-full" required />
              </div>
              
              <div class="form-group">
                <label for="task-type">
                  <i class="ri-list-settings-line mr-1"></i> Task Type
                </label>
                <select id="task-type" class="select w-full" required>
                  <option value="project">Project Task</option>
                  <option value="custom">Custom Task</option>
                  <option value="daily">Daily Task</option>
                </select>
              </div>
              
              <div class="form-actions flex justify-end">
                <button type="button" id="cancel-task" class="btn btn-ghost mr-2">
                  <i class="ri-close-line mr-1"></i> Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="ri-add-line mr-1"></i> Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },
  
  // Task item component
  taskItem(task) {
    const taskClass = task.completed ? 'completed' : '';
    const titleClass = task.completed ? 'task-complete' : '';
    const checkboxChecked = task.completed ? 'checked' : '';
    const taskTypeIcon = task.type === 'project' ? 'ri-folder-line' : 
                        (task.type === 'daily' ? 'ri-repeat-line' : 'ri-list-check-line');
    
    // Format the due date nicely
    const dueDateObj = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let dueDateLabel = '';
    if (dueDateObj.toDateString() === today.toDateString()) {
      dueDateLabel = 'Today';
    } else if (dueDateObj.toDateString() === tomorrow.toDateString()) {
      dueDateLabel = 'Tomorrow';
    } else {
      dueDateLabel = dueDateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    }
    
    // Check if task is overdue
    const isOverdue = !task.completed && dueDateObj < today && dueDateObj.toDateString() !== today.toDateString();
    const dueDateClass = isOverdue ? 'task-overdue' : '';
    
    return `
      <div class="task-item ${taskClass}" data-id="${task.id}" data-completed="${task.completed}">
        <div class="task-checkbox-container">
          <input type="checkbox" class="task-checkbox" ${checkboxChecked} />
          <span class="checkmark" style="border-color: ${task.projectColor || 'var(--primary-color)'}"></span>
        </div>
        
        <div class="task-content">
          <h4 class="${titleClass}">${task.title}</h4>
          <div class="task-details flex items-center gap-2">
            ${task.project ? 
              `<span class="task-project-badge" style="background-color: ${task.projectColor || 'var(--primary-color)'}">
                <i class="ri-folder-line mr-1"></i> ${task.project}
               </span>` : 
              ''}
            <span class="task-type-badge">
              <i class="${taskTypeIcon} mr-1"></i> ${task.type.charAt(0).toUpperCase() + task.type.slice(1)}
            </span>
            <span class="task-due-date ${dueDateClass}">
              <i class="ri-calendar-line mr-1"></i> ${dueDateLabel}
            </span>
          </div>
        </div>
        
        <div class="task-actions">
          <button class="delete-task btn btn-ghost btn-sm">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    `;
  },
  
  // News articles component
  newsArticles(newsItems) {
    // Get unique categories
    const categories = ['All News', ...new Set(newsItems.map(item => item.category))];
    
    // Define icons for each category
    const categoryIcons = {
      'All News': 'ri-newspaper-line',
      'Airdrop': 'ri-parachute-line',
      'Market': 'ri-line-chart-line',
      'Launch': 'ri-rocket-line',
      'Partnership': 'ri-handshake-line',
      'Update': 'ri-refresh-line',
      'Security': 'ri-shield-check-line',
      'Technology': 'ri-code-box-line',
      'Regulation': 'ri-government-line'
    };
    
    // Create filter buttons with icons
    const filterButtons = categories.map(category => {
      const icon = categoryIcons[category] || 'ri-information-line';
      return `
        <button class="news-filter-btn ${category === 'All News' ? 'btn-primary' : ''}" 
                data-category="${category === 'All News' ? 'all' : category}">
          <i class="${icon} mr-1"></i> ${category}
        </button>
      `;
    }).join('');
    
    // Format date nicely
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric'
        });
      }
    };
    
    // Create news articles
    const newsArticles = newsItems.map(item => {
      const categoryIcon = categoryIcons[item.category] || 'ri-information-line';
      const formattedDate = formatDate(item.date);
      
      return `
        <div class="news-article card" data-category="${item.category}">
          <div class="news-image">
            <img src="${item.image}" alt="${item.title}" />
          </div>
          <div class="news-content">
            <h3 class="news-title">${item.title}</h3>
            <div class="news-meta">
              <span class="news-source">
                <i class="ri-user-line mr-1"></i> ${item.source}
              </span>
              <span class="news-date">
                <i class="ri-calendar-line mr-1"></i> ${formattedDate}
              </span>
            </div>
            <p class="news-text">${item.content}</p>
            <div class="news-footer">
              <div class="news-category-badge">
                <i class="${categoryIcon} mr-1"></i> ${item.category}
              </div>
              <a href="#" class="news-read-more">
                Read More <i class="ri-arrow-right-line ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    // Empty state if no news
    const emptyState = `
      <div class="empty-state">
        <i class="ri-inbox-line text-4xl mb-4"></i>
        <p class="text-center text-secondary">No news articles found.</p>
      </div>
    `;
    
    return `
      <div class="news-container">
        <div class="news-filters card mb-4">
          <div class="filter-buttons flex flex-wrap gap-2">
            ${filterButtons}
          </div>
        </div>
        
        <div class="news-grid">
          ${newsItems.length > 0 ? newsArticles : emptyState}
        </div>
        
        ${newsItems.length > 5 ? `
          <div class="load-more text-center mt-6">
            <button id="load-more-news" class="btn btn-outline">
              <i class="ri-more-line mr-1"></i> Load More News
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },
  
  // Loading spinner
  loadingSpinner() {
    return `
      <div class="loading-container flex items-center justify-center h-screen">
        <div class="loading-spinner"></div>
      </div>
    `;
  },
  
  // Not found page
  notFound() {
    return `
      <div class="not-found-page">
        <h1 class="text-3xl font-bold mb-4">Page Not Found</h1>
        <p class="text-secondary mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <a href="#dashboard" class="btn btn-primary">Back to Dashboard</a>
      </div>
    `;
  },
  
  // Modal component
  modal(content) {
    return `
      <div class="modal">
        <div class="modal-content card">
          ${content}
        </div>
      </div>
    `;
  }
};