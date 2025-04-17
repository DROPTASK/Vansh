// Tasks page functionality
function loadTasksPage() {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const user = storageService.getUser();
  const tasks = storageService.getTasks();
  const allProjects = storageService.getAllProjects();
  
  // Build page HTML
  let pageHTML = `
    <div id="tasks" class="page">
      <header>
        <h1 class="text-2xl font-semibold">Tasks</h1>
        <p class="text-secondary text-sm">Manage your project tasks</p>
      </header>
  `;
  
  // Add tasks components
  pageHTML += UI.tasksOverview(user);
  pageHTML += UI.taskList(tasks, allProjects);
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Set up event listeners
  setupTasksEvents();
}

// Set up tasks page event handlers
function setupTasksEvents() {
  // Add task buttons
  const addTaskBtn = document.getElementById('add-task-btn');
  const addCustomTaskBtn = document.getElementById('add-custom-task-btn');
  const taskModal = document.getElementById('task-modal');
  const cancelTaskBtn = document.getElementById('cancel-task');
  const taskForm = document.getElementById('task-form');
  
  // Show modal on button click
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      taskModal.style.display = 'block';
    });
  }
  
  if (addCustomTaskBtn) {
    addCustomTaskBtn.addEventListener('click', () => {
      // Pre-select custom task type
      document.getElementById('task-type').value = 'custom';
      taskModal.style.display = 'block';
    });
  }
  
  // Hide modal on cancel
  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener('click', () => {
      taskModal.style.display = 'none';
    });
  }
  
  // Handle form submission
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById('task-title').value;
      const project = document.getElementById('task-project').value;
      const dueDate = document.getElementById('task-due-date').value;
      const type = document.getElementById('task-type').value;
      
      // Validate
      if (!title) {
        alert('Please enter a task title.');
        return;
      }
      
      // Find project color if a project is selected
      const allProjects = storageService.getAllProjects();
      const projectColor = project 
        ? allProjects.find(p => p.name === project)?.borderColor || '#94A3B8'
        : '#94A3B8';
      
      // Create new task
      const task = {
        id: Date.now().toString(),
        title,
        project: project || null,
        projectColor,
        dueDate: new Date(dueDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        completed: false,
        type
      };
      
      // Add to storage
      storageService.addTask(task);
      
      // Close modal and reload page
      taskModal.style.display = 'none';
      loadTasksPage();
    });
  }
  
  // Task checkbox toggle
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');
  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const taskItem = checkbox.closest('.task-item');
      const taskId = taskItem.getAttribute('data-id');
      
      // Get task from storage
      const tasks = storageService.getTasks();
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        // Update task completed status
        task.completed = checkbox.checked;
        storageService.updateTask(task);
        
        // Update UI
        if (checkbox.checked) {
          taskItem.querySelector('h4').classList.add('task-complete');
        } else {
          taskItem.querySelector('h4').classList.remove('task-complete');
        }
      }
    });
  });
  
  // Delete task buttons
  const deleteTaskBtns = document.querySelectorAll('.delete-task');
  deleteTaskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const taskItem = btn.closest('.task-item');
      const taskId = taskItem.getAttribute('data-id');
      
      // Confirm deletion
      if (confirm('Are you sure you want to delete this task?')) {
        // Delete task from storage
        storageService.deleteTask(taskId);
        
        // Reload page
        loadTasksPage();
      }
    });
  });
  
  // Task filter buttons
  const taskFilterBtns = document.querySelectorAll('.task-filter-btn');
  taskFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      taskFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Apply filter
      const filter = btn.getAttribute('data-filter');
      filterTasks(filter);
    });
  });
}

// Filter tasks based on filter value
function filterTasks(filter) {
  // Get all task items
  const projectTasksList = document.getElementById('project-tasks-list');
  const customTasksList = document.getElementById('custom-tasks-list');
  
  if (!projectTasksList || !customTasksList) return;
  
  const projectTasks = projectTasksList.querySelectorAll('.task-item');
  const customTasks = customTasksList.querySelectorAll('.task-item');
  
  // First get real data to calculate metrics
  const tasks = storageService.getTasks();
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.length - completedTasksCount;
  
  // Update the stats in real-time
  const completedElement = document.querySelector('.stat-item:nth-child(3) .stat-value');
  const pendingElement = document.querySelector('.stat-item:nth-child(4) .stat-value');
  
  if (completedElement) {
    completedElement.textContent = completedTasksCount;
  }
  
  if (pendingElement) {
    pendingElement.textContent = pendingTasksCount;
  }
  
  // Update progress bar
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;
  
  const progressBar = document.querySelector('.progress-bar');
  const completionRateElement = document.querySelector('.stat-item:first-child .stat-value');
  
  if (progressBar) {
    progressBar.style.width = `${completionRate}%`;
  }
  
  if (completionRateElement) {
    completionRateElement.textContent = `${completionRate}%`;
  }
  
  // Filter tasks based on completed status
  const filterTask = (task) => {
    const completed = task.getAttribute('data-completed') === 'true';
    
    switch (filter) {
      case 'completed':
        task.style.display = completed ? 'flex' : 'none';
        break;
      case 'pending':
        task.style.display = !completed ? 'flex' : 'none';
        break;
      default: // 'all'
        task.style.display = 'flex';
        break;
    }
  };
  
  // Apply filters
  projectTasks.forEach(filterTask);
  customTasks.forEach(filterTask);
  
  // Show empty state for sections with no visible tasks
  const projectTasksVisible = Array.from(projectTasks).some(task => task.style.display !== 'none');
  const customTasksVisible = Array.from(customTasks).some(task => task.style.display !== 'none');
  
  // Get or create empty state elements
  let projectEmptyState = projectTasksList.querySelector('.empty-state');
  let customEmptyState = customTasksList.querySelector('.empty-state');
  
  if (!projectEmptyState && !projectTasksVisible) {
    projectEmptyState = document.createElement('div');
    projectEmptyState.className = 'empty-state';
    projectEmptyState.innerHTML = `<p class="text-center text-secondary">No ${filter === 'all' ? '' : filter + ' '}project tasks found.</p>`;
    projectTasksList.appendChild(projectEmptyState);
  } else if (projectEmptyState && projectTasksVisible) {
    projectEmptyState.remove();
  }
  
  if (!customEmptyState && !customTasksVisible) {
    customEmptyState = document.createElement('div');
    customEmptyState.className = 'empty-state';
    customEmptyState.innerHTML = `<p class="text-center text-secondary">No ${filter === 'all' ? '' : filter + ' '}custom tasks found.</p>`;
    customTasksList.appendChild(customEmptyState);
  } else if (customEmptyState && customTasksVisible) {
    customEmptyState.remove();
  }
}