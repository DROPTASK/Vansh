// Storage Service for local storage operations
const storageService = {
  // Save data to local storage
  saveItem(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  // Load data from local storage
  loadItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },
  
  // Remove item from local storage
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  // Initialize storage with default data
  initializeStorage() {
    // Load initial data from data.js
    if (!this.loadItem('initialized')) {
      this.saveItem('theme', 'light');
      this.saveItem('user', initialUser);
      this.saveItem('myProjects', []);
      this.saveItem('allProjects', initialProjects);
      this.saveItem('tasks', initialTasks);
      this.saveItem('news', initialNews);
      this.saveItem('transactions', initialTransactions);
      this.saveItem('initialized', true);
      this.saveItem('lastTaskReset', new Date().toDateString());
    }
  },
  
  // Get theme preference
  getTheme() {
    return this.loadItem('theme', 'light');
  },
  
  // Set theme preference
  setTheme(theme) {
    this.saveItem('theme', theme);
  },
  
  // Get user data
  getUser() {
    return this.loadItem('user', initialUser);
  },
  
  // Update user data
  updateUser(userData) {
    const currentUser = this.getUser();
    const updatedUser = { ...currentUser, ...userData };
    this.saveItem('user', updatedUser);
    return updatedUser;
  },
  
  // Get all projects
  getAllProjects() {
    return this.loadItem('allProjects', []);
  },
  
  // Get my projects
  getMyProjects() {
    return this.loadItem('myProjects', []);
  },
  
  // Add project to my projects
  addToMyProjects(project) {
    const myProjects = this.getMyProjects();
    // Check if project is already in my projects
    if (!myProjects.some(p => p.id === project.id)) {
      const updatedProjects = [...myProjects, { ...project, isAdded: true }];
      this.saveItem('myProjects', updatedProjects);
      
      // Update user stats
      const user = this.getUser();
      this.updateUser({
        projectsAdded: user.projectsAdded + 1
      });
      
      return updatedProjects;
    }
    return myProjects;
  },
  
  // Remove project from my projects
  removeFromMyProjects(projectId) {
    const myProjects = this.getMyProjects();
    const updatedProjects = myProjects.filter(p => p.id !== projectId);
    this.saveItem('myProjects', updatedProjects);
    
    // Update user stats
    const user = this.getUser();
    this.updateUser({
      projectsAdded: Math.max(0, user.projectsAdded - 1)
    });
    
    return updatedProjects;
  },
  
  // Update project data
  updateProject(updatedProject) {
    // Update in all projects
    const allProjects = this.getAllProjects();
    const updatedAllProjects = allProjects.map(p => 
      p.id === updatedProject.id ? { ...p, ...updatedProject } : p
    );
    this.saveItem('allProjects', updatedAllProjects);
    
    // Update in my projects if exists
    const myProjects = this.getMyProjects();
    if (myProjects.some(p => p.id === updatedProject.id)) {
      const updatedMyProjects = myProjects.map(p => 
        p.id === updatedProject.id ? { ...p, ...updatedProject } : p
      );
      this.saveItem('myProjects', updatedMyProjects);
    }
    
    return updatedProject;
  },
  
  // Get all tasks
  getTasks() {
    return this.loadItem('tasks', []);
  },
  
  // Add new task
  addTask(task) {
    const tasks = this.getTasks();
    const updatedTasks = [...tasks, task];
    this.saveItem('tasks', updatedTasks);
    
    // Update user stats
    const user = this.getUser();
    this.updateUser({
      totalTasks: user.totalTasks + 1
    });
    
    return updatedTasks;
  },
  
  // Update existing task
  updateTask(updatedTask) {
    const tasks = this.getTasks();
    
    // Check if task was completed
    const task = tasks.find(t => t.id === updatedTask.id);
    const wasCompleted = task ? task.completed : false;
    const isNowCompleted = updatedTask.completed;
    
    // Update task
    const updatedTasks = tasks.map(t => 
      t.id === updatedTask.id ? updatedTask : t
    );
    this.saveItem('tasks', updatedTasks);
    
    // Update user stats if completion status changed
    if (wasCompleted !== isNowCompleted) {
      const user = this.getUser();
      const tasksCompleted = isNowCompleted 
        ? user.tasksCompleted + 1 
        : Math.max(0, user.tasksCompleted - 1);
      
      this.updateUser({ tasksCompleted });
    }
    
    return updatedTasks;
  },
  
  // Delete task
  deleteTask(taskId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    // Remove task
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    this.saveItem('tasks', updatedTasks);
    
    // Update user stats
    const user = this.getUser();
    const tasksCompleted = task && task.completed 
      ? Math.max(0, user.tasksCompleted - 1) 
      : user.tasksCompleted;
    
    this.updateUser({
      totalTasks: Math.max(0, user.totalTasks - 1),
      tasksCompleted
    });
    
    return updatedTasks;
  },
  
  // Get news items
  getNews() {
    return this.loadItem('news', []);
  },
  
  // Get transactions
  getTransactions() {
    return this.loadItem('transactions', []);
  },
  
  // Add new transaction
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    const updatedTransactions = [...transactions, transaction];
    this.saveItem('transactions', updatedTransactions);
    
    // Update user stats based on transaction type
    const user = this.getUser();
    
    if (transaction.type === 'investment') {
      this.updateUser({
        totalInvestment: user.totalInvestment + transaction.amount,
        investmentChange: transaction.amount
      });
    } else if (transaction.type === 'earning') {
      this.updateUser({
        totalEarnings: user.totalEarnings + transaction.amount,
        earningsChange: transaction.amount
      });
    }
    
    return updatedTransactions;
  },
  
  // Check if daily tasks need to be reset
  checkDailyTasksReset() {
    const lastReset = this.loadItem('lastTaskReset');
    const currentDate = new Date().toDateString();
    
    if (lastReset !== currentDate) {
      this.resetDailyTasks();
      this.saveItem('lastTaskReset', currentDate);
      return true;
    }
    
    return false;
  },
  
  // Reset daily tasks
  resetDailyTasks() {
    const tasks = this.getTasks();
    
    // Find completed daily tasks and reset them
    const updatedTasks = tasks.map(task => {
      if (task.type === 'daily' && task.completed) {
        return { ...task, completed: false };
      }
      return task;
    });
    
    this.saveItem('tasks', updatedTasks);
    
    // Update user stats
    const completedTasks = updatedTasks.filter(t => t.completed).length;
    const user = this.getUser();
    this.updateUser({
      tasksCompleted: completedTasks
    });
    
    return updatedTasks;
  }
};