// Statistics page functionality
function loadStatisticsPage() {
  const contentArea = document.getElementById('content-area');
  
  // Build page HTML
  let pageHTML = `
    <div id="statistics" class="page">
      <header>
        <h1 class="text-2xl font-semibold">Statistics</h1>
        <p class="text-secondary text-sm">Analyze your crypto performance</p>
      </header>
  `;
  
  // Add statistics components
  pageHTML += UI.statisticsCharts();
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Initialize charts
  initStatisticsCharts();
  
  // Set up event listeners
  setupStatisticsEvents();
}

// Set up statistics page event handlers
function setupStatisticsEvents() {
  // Time period buttons
  const timePeriodBtns = document.querySelectorAll('.time-period-btn');
  
  timePeriodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      timePeriodBtns.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      
      // Re-initialize charts with new time period
      const period = btn.getAttribute('data-period');
      initStatisticsCharts(period);
    });
  });
}

// Initialize statistics charts
function initStatisticsCharts(period = 'week') {
  // Clear any existing charts first
  Chart.getChart('portfolioGrowthChart')?.destroy();
  Chart.getChart('successRateChart')?.destroy();
  Chart.getChart('taskCompletionChart')?.destroy();
  Chart.getChart('projectDistributionChart')?.destroy();
  
  // Get real user data
  const transactions = storageService.getTransactions();
  const user = storageService.getUser();
  const projects = storageService.getMyProjects();
  const allProjects = storageService.getAllProjects();
  const tasks = storageService.getTasks();
  
  // Portfolio Growth Chart
  const portfolioGrowthChartCtx = document.getElementById('portfolioGrowthChart').getContext('2d');
  
  // Prepare data based on selected time period
  let labels = [];
  let portfolioData = [];
  const currentDate = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate portfolio growth over time
  const calculateGrowth = () => {
    // Define different time periods
    switch(period) {
      case 'week': {
        // Last 7 days
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = currentDate.getDay();
        labels = Array(7).fill().map((_, i) => {
          const day = (today - 6 + i + 7) % 7;
          return dayNames[day];
        });
        
        // Calculate daily portfolio values for the week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        
        // Initial portfolio value (investments before the last week)
        let portfolioValue = 0;
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate < oneWeekAgo && tx.type === 'investment') {
            portfolioValue += tx.amount;
          }
        });
        
        // Daily portfolio values
        portfolioData = Array(7).fill(portfolioValue);
        
        // Update daily values based on transactions
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate >= oneWeekAgo) {
            const dayDiff = Math.floor((txDate - oneWeekAgo) / (24 * 60 * 60 * 1000));
            if (dayDiff >= 0 && dayDiff < 7) {
              if (tx.type === 'investment') {
                for (let i = dayDiff; i < 7; i++) {
                  portfolioData[i] += tx.amount;
                }
              }
            }
          }
        });
        break;
      }
      case 'month': {
        // Last 30 days
        labels = Array.from({length: 30}, (_, i) => (i + 1).toString());
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        
        // Initial portfolio value
        let portfolioValue = 0;
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate < thirtyDaysAgo && tx.type === 'investment') {
            portfolioValue += tx.amount;
          }
        });
        
        // Daily portfolio values
        portfolioData = Array(30).fill(portfolioValue);
        
        // Update daily values based on transactions
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate >= thirtyDaysAgo) {
            const dayDiff = Math.floor((txDate - thirtyDaysAgo) / (24 * 60 * 60 * 1000));
            if (dayDiff >= 0 && dayDiff < 30) {
              if (tx.type === 'investment') {
                for (let i = dayDiff; i < 30; i++) {
                  portfolioData[i] += tx.amount;
                }
              }
            }
          }
        });
        break;
      }
      case 'quarter': {
        // Last 3 months
        const currentMonth = currentDate.getMonth();
        labels = Array(3).fill().map((_, i) => {
          const monthIndex = (currentMonth - 2 + i + 12) % 12;
          return months[monthIndex];
        });
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
        threeMonthsAgo.setDate(1);
        
        // Initial portfolio value
        let portfolioValue = 0;
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate < threeMonthsAgo && tx.type === 'investment') {
            portfolioValue += tx.amount;
          }
        });
        
        // Monthly portfolio values
        portfolioData = Array(3).fill(portfolioValue);
        
        // Update monthly values based on transactions
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate >= threeMonthsAgo) {
            const monthDiff = (txDate.getMonth() - threeMonthsAgo.getMonth() + 12) % 12;
            if (monthDiff >= 0 && monthDiff < 3) {
              if (tx.type === 'investment') {
                for (let i = monthDiff; i < 3; i++) {
                  portfolioData[i] += tx.amount;
                }
              }
            }
          }
        });
        break;
      }
      case 'year': {
        // Last 12 months
        const currentMonth = currentDate.getMonth();
        labels = Array(12).fill().map((_, i) => {
          const monthIndex = (currentMonth - 11 + i + 12) % 12;
          return months[monthIndex];
        });
        
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        oneYearAgo.setDate(1);
        
        // Initial portfolio value
        let portfolioValue = 0;
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate < oneYearAgo && tx.type === 'investment') {
            portfolioValue += tx.amount;
          }
        });
        
        // Monthly portfolio values
        portfolioData = Array(12).fill(portfolioValue);
        
        // Update monthly values based on transactions
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate >= oneYearAgo) {
            const monthDiff = (txDate.getMonth() - oneYearAgo.getMonth() + 12) % 12;
            if (monthDiff >= 0 && monthDiff < 12) {
              if (tx.type === 'investment') {
                for (let i = monthDiff; i < 12; i++) {
                  portfolioData[i] += tx.amount;
                }
              }
            }
          }
        });
        break;
      }
      case 'all': {
        // Last 3 years
        const currentYear = currentDate.getFullYear();
        labels = [
          (currentYear - 2).toString(),
          (currentYear - 1).toString(),
          currentYear.toString()
        ];
        
        // Initial portfolio value
        let portfolioValue = 0;
        
        // Yearly portfolio values
        portfolioData = Array(3).fill(0);
        
        // Calculate portfolio value for each year
        sortedTransactions.forEach(tx => {
          const txDate = new Date(tx.date);
          const txYear = txDate.getFullYear();
          
          if (tx.type === 'investment') {
            if (txYear <= currentYear - 3) {
              // Before our 3-year window, add to base value for all years
              portfolioValue += tx.amount;
            } else if (txYear >= currentYear - 2) {
              // Within our 3-year window, add to appropriate years
              const yearIndex = txYear - (currentYear - 2);
              if (yearIndex >= 0 && yearIndex < 3) {
                for (let i = yearIndex; i < 3; i++) {
                  portfolioData[i] += tx.amount;
                }
              }
            }
          }
        });
        
        // Add base value to all years
        for (let i = 0; i < 3; i++) {
          portfolioData[i] += portfolioValue;
        }
        break;
      }
    }
  };
  
  calculateGrowth();
  
  const portfolioGrowthData = {
    labels: labels,
    datasets: [{
      label: 'Portfolio Value',
      data: portfolioData,
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  
  new Chart(portfolioGrowthChartCtx, {
    type: 'line',
    data: portfolioGrowthData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Portfolio Value: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
  
  // Success Rate Chart - Calculate airdrops success rate
  const successRateChartCtx = document.getElementById('successRateChart').getContext('2d');
  
  // Count projects with earnings vs total projects
  const projectsWithEarnings = new Set();
  transactions.forEach(tx => {
    if (tx.type === 'earning') {
      projectsWithEarnings.add(tx.project);
    }
  });
  
  const successCount = projectsWithEarnings.size;
  const failCount = Math.max(projects.length - successCount, 0);
  
  // If no projects yet, use a placeholder ratio
  const successPercentage = projects.length > 0 ? 
    Math.round((successCount / projects.length) * 100) : 
    0;
  
  const successRateData = {
    labels: ['Success', 'Fail'],
    datasets: [{
      data: [successPercentage, 100 - successPercentage],
      backgroundColor: ['#10B981', '#F3F4F6'],
      borderWidth: 0
    }]
  };
  
  new Chart(successRateChartCtx, {
    type: 'doughnut',
    data: successRateData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      cutout: '80%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
  
  // Task Completion Chart - Based on real task data
  const taskCompletionChartCtx = document.getElementById('taskCompletionChart').getContext('2d');
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const completionPercentage = tasks.length > 0 ? 
    Math.round((completedTasks / tasks.length) * 100) : 
    0;
  
  const taskCompletionData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [completionPercentage, 100 - completionPercentage],
      backgroundColor: ['#6366F1', '#F3F4F6'],
      borderWidth: 0
    }]
  };
  
  new Chart(taskCompletionChartCtx, {
    type: 'doughnut',
    data: taskCompletionData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      cutout: '80%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
  
  // Project Distribution Chart - Based on real project categories
  const projectDistributionChartCtx = document.getElementById('projectDistributionChart').getContext('2d');
  
  // Count projects by category
  const categoryCount = {};
  projects.forEach(project => {
    if (!categoryCount[project.category]) {
      categoryCount[project.category] = 0;
    }
    categoryCount[project.category]++;
  });
  
  // Prepare data for chart
  const categories = Object.keys(categoryCount);
  const categoryCounts = Object.values(categoryCount);
  
  // Only when there are projects to show
  let projectDistributionData;
  
  if (categories.length > 0) {
    // Use distinct colors for each category
    const colors = [
      '#6366F1', // Primary
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#10B981', // Green
      '#F59E0B', // Orange
      '#06B6D4', // Cyan
      '#EF4444', // Red
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#8B5CF6'  // Purple (repeat if needed)
    ];
    
    projectDistributionData = {
      labels: categories,
      datasets: [{
        data: categoryCounts,
        backgroundColor: colors.slice(0, categories.length),
        borderWidth: 0
      }]
    };
  } else {
    // Empty state with "No Projects" message
    projectDistributionData = {
      labels: ['No Projects'],
      datasets: [{
        data: [1],
        backgroundColor: ['#F3F4F6'],
        borderWidth: 0
      }]
    };
  }
  
  new Chart(projectDistributionChartCtx, {
    type: 'pie',
    data: projectDistributionData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              if (categories.length > 0) {
                const percentage = Math.round((context.parsed / projects.length) * 100);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              } else {
                return 'No projects added yet';
              }
            }
          }
        }
      }
    }
  });
  
  // Update the success rate value in the center of the doughnut
  const successRateElement = document.querySelector('#success-rate-value');
  if (successRateElement) {
    successRateElement.textContent = `${successPercentage}%`;
  }
  
  // Update the task completion value in the center of the doughnut
  const taskCompletionElement = document.querySelector('#task-completion-value');
  if (taskCompletionElement) {
    taskCompletionElement.textContent = `${completionPercentage}%`;
  }
}