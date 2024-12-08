// Open Create Account Modal
document.getElementById("createAccountButton")?.addEventListener("click", function () {
    document.getElementById("createAccountModal").style.display = "flex";
});

// Close Create Account Modal
document.getElementById("closeModal")?.addEventListener("click", function () {
    document.getElementById("createAccountModal").style.display = "none";
});

// Handle Create Account Form Submission
document.getElementById("createAccountForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const newUsername = document.getElementById("newUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    if (newUsername === "" || newPassword === "") {
        alert("Please fill in all fields.");
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Check if username already exists
    if (accounts.some(account => account.username === newUsername)) {
        alert("Username already exists. Please choose another.");
        return;
    }

    // Add new account
    accounts.push({ username: newUsername, password: newPassword });
    localStorage.setItem("accounts", JSON.stringify(accounts));

    alert("Account created successfully!");
    document.getElementById("createAccountModal").style.display = "none";
});

// Handle Login Form Submission
document.getElementById("loginForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Validate user credentials
    const account = accounts.find(account => account.username === username && account.password === password);

    if (account) {
        alert(`Welcome, ${username}!`);
        localStorage.setItem("currentUser", JSON.stringify(account)); // Save current user
        window.location.href = "transaction.html"; // Redirect to transactions page
    } else {
        alert("Invalid username or password.");
    }
});

// Function to switch between tabs (Withdraw and Deposit)
function showTab(tabName) {
    document.getElementById("withdraw").style.display = "none";
    document.getElementById("deposit").style.display = "none";

    document.querySelector('.tab-button.active').classList.remove('active');

    if (tabName === 'withdraw') {
        document.getElementById("withdraw").style.display = "block";
        document.querySelector('.tab-button:nth-child(1)').classList.add('active');
    } else if (tabName === 'deposit') {
        document.getElementById("deposit").style.display = "block";
        document.querySelector('.tab-button:nth-child(2)').classList.add('active');
    }
}

// Handle Withdraw Form Submission
document.getElementById("withdrawForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);

    if (withdrawAmount > 0) {
        alert(`You have withdrawn ${withdrawAmount} units.`);
        addTransaction(currentUser.username, "Withdraw", withdrawAmount);
        document.getElementById("withdrawAmount").value = ""; // Clear input field
    } else {
        alert("Enter a valid amount.");
    }
});

// Handle Deposit Form Submission
document.getElementById("depositForm")?.addEventListener("submit", function (event) {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    const depositAmount = parseFloat(document.getElementById("depositAmount").value);

    if (depositAmount > 0) {
        alert(`You have deposited ${depositAmount} units.`);
        addTransaction(currentUser.username, "Deposit", depositAmount);
        document.getElementById("depositAmount").value = ""; // Clear input field
    } else {
        alert("Enter a valid amount.");
    }
});

// Function to add a transaction to localStorage
function addTransaction(name, type, amount) {
    const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    const transaction = {
        name: name,
        type: type,
        amount: amount.toFixed(2),
        date: new Date().toLocaleString()
    };

    transactionHistory.push(transaction);
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
}

// Function to load transaction history into the table
function loadTransactionHistory() {
    const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];
    const historyTable = document.getElementById("transactionHistory").getElementsByTagName("tbody")[0];

    // Clear existing rows
    historyTable.innerHTML = "";

    // Populate the table
    transactionHistory.forEach(transaction => {
        const row = historyTable.insertRow();
        const nameCell = row.insertCell(0);
        const typeCell = row.insertCell(1);
        const amountCell = row.insertCell(2);
        const dateCell = row.insertCell(3);

        nameCell.textContent = transaction.name;
        typeCell.textContent = transaction.type;
        amountCell.textContent = transaction.amount;
        dateCell.textContent = transaction.date;
    });
}

// Function to clear transaction history
function clearTransactionHistory() {
    if (confirm("Are you sure you want to clear all transaction history?")) {
        localStorage.removeItem('transactionHistory'); // Remove transaction data from localStorage
        loadTransactionHistory(); // Reload the transaction table to show empty history
        alert("Transaction history cleared.");
    }
}

// Ensure transaction history loads and clear button works
if (window.location.pathname.includes("transaction-history.html")) {
    loadTransactionHistory();

    // Add event listener for Clear History button
    const clearButton = document.getElementById("clearHistoryButton");
    clearButton.addEventListener("click", clearTransactionHistory);
}
