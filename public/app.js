// Initial Values
let balance = 0;
let budget = 0;
let currencySymbol = "₹";
let transactions = [];
const password = "1234"; // Default password to unlock

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordField = document.getElementById("unlock-code");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
}

// Unlock wallet
function unlockWallet() {
    const unlockCode = document.getElementById("unlock-code").value;
    if (unlockCode === password) {
        document.getElementById("lock-slide").classList.add("hidden");
        document.getElementById("budget-slide").classList.remove("hidden");
    } else {
        document.getElementById("unlock-error").innerText = "Incorrect code. Try again.";
    }
}

// Set budget and currency
function setBudgetAndProceed() {
    budget = parseFloat(document.getElementById("budget").value);
    currencySymbol = document.getElementById("currency").value;
    if (budget > 0) {
        document.getElementById("budget-slide").classList.add("hidden");
        document.getElementById("wallet-slide").classList.remove("hidden");
        document.getElementById("currency-symbol").innerText = currencySymbol;
    } else {
        alert("Please enter a valid budget.");
    }
}

// Add cash in
function cashIn() {
    const amount = parseFloat(document.getElementById("amount").value);
    const transactionTime = new Date(document.getElementById("transaction-time").value);
    const icon = document.getElementById("icon-selection").value;

    if (amount > 0 && transactionTime) {
        balance += amount;
        transactions.push({ type: "Cash In", amount, date: transactionTime, icon });
        updateBalance();
        showTransactions();
        clearInputFields();
    } else {
        alert("Enter a valid amount and date.");
    }
}

// Add cash out
function cashOut() {
    const amount = parseFloat(document.getElementById("amount").value);
    const transactionTime = new Date(document.getElementById("transaction-time").value);
    const icon = document.getElementById("icon-selection").value;

    if (amount > 0 && amount <= balance && transactionTime) {
        balance -= amount;
        transactions.push({ type: "Cash Out", amount, date: transactionTime, icon });
        updateBalance();
        showTransactions();
        checkBudgetExceeded();
        clearInputFields();
    } else {
        alert("Enter a valid amount and date.");
    }
}

// Check if budget is exceeded
function checkBudgetExceeded() {
    const totalExpenditure = transactions.reduce((sum, t) => t.type === "Cash Out" ? sum + t.amount : sum, 0);
    const budgetAlert = document.getElementById("budget-alert");
    if (totalExpenditure > budget) {
        budgetAlert.classList.remove("hidden");
    } else {
        budgetAlert.classList.add("hidden");
    }
}

// Show transactions in order
function showTransactions() {
    const filter = document.getElementById("filter").value;
    const transactionHistory = document.getElementById("transaction-history");
    transactionHistory.innerHTML = '';

    const filteredTransactions = transactions.filter(t => {
        const now = new Date();
        if (filter === "currentMonth") {
            return t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear();
        } else if (filter === "lastMonth") {
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
            return t.date.getMonth() === lastMonth.getMonth() && t.date.getFullYear() === lastMonth.getFullYear();
        } else if (filter === "oneYear") {
            return t.date >= new Date(now.setFullYear(now.getFullYear() - 1));
        }
        return true;
    });

    // Group transactions by date
    const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
        const dateString = transaction.date.toDateString();
        if (!acc[dateString]) {
            acc[dateString] = [];
        }
        acc[dateString].push(transaction);
        return acc;
    }, {});

    // Display grouped transactions
    for (const date in groupedTransactions) {
        const li = document.createElement("li");
        const transactionsForDate = groupedTransactions[date];
        li.innerHTML = `<strong>${date}</strong>`;
        
        transactionsForDate.forEach(t => {
            const color = t.type === "Cash In" ? "green" : "red"; // Color based on type
            li.innerHTML += `<div style="color: ${color};">${t.icon} ${t.type}: ${currencySymbol}${t.amount.toFixed(2)}</div>`;
        });

        transactionHistory.appendChild(li);
    }
}

// Update balance display
function updateBalance() {
    document.getElementById("balance").innerText = balance.toFixed(2);
}

// Clear input fields after a transaction
function clearInputFields() {
    document.getElementById("amount").value = "";
    document.getElementById("transaction-time").value = "";
}

// Show graph of expenditures
function updateGraph() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const labels = transactions.filter(t => t.type === "Cash Out").map(t => t.icon);
    const data = transactions.filter(t => t.type === "Cash Out").map(t => t.amount);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Expenditure",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Navigate to graph slide
function goToGraphSlide() {
    document.getElementById("wallet-slide").classList.add("hidden");
    document.getElementById("graph-slide").classList.remove("hidden");
}

// Navigate back to wallet slide
function goToWalletSlide() {
    document.getElementById("graph-slide").classList.add("hidden");
    document.getElementById("wallet-slide").classList.remove("hidden");
}
