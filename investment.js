// Investment page functionality
function loadInvestmentPage() {
  const contentArea = document.getElementById('content-area');
  
  // Load necessary data
  const transactions = storageService.getTransactions();
  
  // Build page HTML
  let pageHTML = `
    <div id="investment" class="page">
      <header>
        <h1 class="text-2xl font-semibold">Investment & Earning</h1>
        <p class="text-secondary text-sm">Track your portfolio performance</p>
      </header>
  `;
  
  // Add investment components
  pageHTML += UI.investmentCharts();
  pageHTML += UI.transactionLog(transactions);
  
  pageHTML += `</div>`;
  
  // Set page content
  contentArea.innerHTML = pageHTML;
  
  // Initialize charts
  initInvestmentCharts();
  
  // Set up event listeners
  setupInvestmentEvents();
}

// Set up investment page event handlers
function setupInvestmentEvents() {
  // Add transaction button
  const addTransactionBtn = document.getElementById('add-transaction');
  const transactionModal = document.getElementById('transaction-modal');
  const cancelTransactionBtn = document.getElementById('cancel-transaction');
  const transactionForm = document.getElementById('transaction-form');
  
  // Show modal on add button click
  addTransactionBtn.addEventListener('click', () => {
    transactionModal.style.display = 'block';
  });
  
  // Hide modal on cancel
  cancelTransactionBtn.addEventListener('click', () => {
    transactionModal.style.display = 'none';
  });
  
  // Handle form submission
  transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const type = document.getElementById('tx-type').value;
    const project = document.getElementById('tx-project').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    
    // Validate
    if (!project || isNaN(amount) || amount <= 0) {
      alert('Please enter valid project name and amount.');
      return;
    }
    
    // Create new transaction
    const newTransaction = {
      id: Date.now().toString(),
      type,
      project,
      amount,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    // Add to storage
    storageService.addTransaction(newTransaction);
    
    // Close modal and reload page
    transactionModal.style.display = 'none';
    loadInvestmentPage();
  });
}

// Initialize investment charts
function initInvestmentCharts() {
  // Clear any existing charts first
  Chart.getChart('portfolioChart')?.destroy();
  Chart.getChart('roiChart')?.destroy();
  Chart.getChart('earningsChart')?.destroy();
  
  // Get real user data
  const transactions = storageService.getTransactions();
  const user = storageService.getUser();
  
  // Calculate actual data for charts based on real transactions
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get last 6 months for labels 
  const labels = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = currentMonth - i;
    const adjustedMonthIndex = monthIndex >= 0 ? monthIndex : monthIndex + 12;
    labels.push(months[adjustedMonthIndex]);
  }
  
  // Initialize data arrays for charts
  const portfolioValues = Array(6).fill(0);
  const roiValues = Array(6).fill(0);
  const earningsValues = Array(6).fill(0);
  
  // Track monthly investments and earnings for ROI calculation
  const monthlyInvestments = Array(6).fill(0);
  const monthlyEarnings = Array(6).fill(0);
  
  // Calculate starting portfolio value (what was there before our 6-month window)
  let initialPortfolioValue = 0;
  let monthlyRunningTotal = 0;
  
  // Pre-process transactions to calculate initial portfolio value
  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    const txMonth = txDate.getMonth();
    const txYear = txDate.getFullYear();
    
    // Check if this transaction is before our 6-month window
    const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
    if (txDate < sixMonthsAgo) {
      if (tx.type === 'investment') {
        initialPortfolioValue += tx.amount;
      } else {
        // This is an earning, which doesn't change portfolio value
        // but we could track cumulative earnings if needed
      }
    }
  });
  
  // Set initial portfolio value
  portfolioValues[0] = initialPortfolioValue;
  monthlyRunningTotal = initialPortfolioValue;
  
  // Process each transaction within our 6-month window
  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    const txMonth = txDate.getMonth();
    const txYear = txDate.getFullYear();
    
    // Find which of the last 6 months this transaction belongs to
    for (let i = 0; i < 6; i++) {
      const monthIndex = currentMonth - 5 + i;
      const adjustedMonthIndex = monthIndex >= 0 ? monthIndex : monthIndex + 12;
      const yearOffset = monthIndex < 0 ? -1 : 0;
      const targetYear = currentYear + yearOffset;
      
      if (txMonth === adjustedMonthIndex && txYear === targetYear) {
        // For earnings, add to monthly earnings
        if (tx.type === 'earning') {
          monthlyEarnings[i] += tx.amount;
          earningsValues[i] += tx.amount;
        } else {
          // For investments, add to monthly investments and update portfolio
          monthlyInvestments[i] += tx.amount;
          monthlyRunningTotal += tx.amount;
        }
        
        // Update portfolio running total for this month and future months
        for (let j = i; j < 6; j++) {
          portfolioValues[j] = monthlyRunningTotal;
        }
        
        break;
      }
    }
  });
  
  // Calculate ROI for each month (earnings / investments * 100)
  for (let i = 0; i < 6; i++) {
    // If there were investments this month
    if (monthlyInvestments[i] > 0) {
      roiValues[i] = Math.round((monthlyEarnings[i] / monthlyInvestments[i]) * 100);
    } 
    // If no investments this month but there's portfolio value
    else if (portfolioValues[i] > 0 && monthlyEarnings[i] > 0) {
      // Calculate ROI as percentage of portfolio value
      roiValues[i] = Math.round((monthlyEarnings[i] / portfolioValues[i]) * 100);
    }
    // Otherwise ROI stays 0
  }
  
  // Portfolio chart with real data
  const portfolioChartCtx = document.getElementById('portfolioChart').getContext('2d');
  const portfolioData = {
    labels: labels,
    datasets: [{
      label: 'Portfolio Value',
      data: portfolioValues,
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };
  
  new Chart(portfolioChartCtx, {
    type: 'line',
    data: portfolioData,
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
  
  // ROI chart with real data
  const roiChartCtx = document.getElementById('roiChart').getContext('2d');
  const roiData = {
    labels: labels,
    datasets: [{
      label: 'Monthly ROI',
      data: roiValues,
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0.2
    }]
  };
  
  new Chart(roiChartCtx, {
    type: 'line',
    data: roiData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `ROI: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + '%';
            }
          }
        }
      }
    }
  });
  
  // Earnings chart with real data
  const earningsChartCtx = document.getElementById('earningsChart').getContext('2d');
  const earningsData = {
    labels: labels,
    datasets: [{
      label: 'Monthly Earnings',
      data: earningsValues,
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderRadius: 4
    }]
  };
  
  new Chart(earningsChartCtx, {
    type: 'bar',
    data: earningsData,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Earnings: $${context.parsed.y.toLocaleString()}`;
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
}