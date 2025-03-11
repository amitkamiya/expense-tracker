document.addEventListener('DOMContentLoaded', () => {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (result.success) {
                window.location.href = '/calculator.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(feedbackForm);
            const data = Object.fromEntries(formData);

            const response = await fetch('/submit-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            alert(result.message);
            // Optionally redirect to view feedback
            // window.location.href = '/html/view-feedback.html';
        });
    }

    // Expense Tracker Calculator
    const expenseForm = document.getElementById('expense-form');
    const expenseHistory = document.getElementById('expense-history');
    let expenses = [];

    if (expenseForm) {
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const expenseName = document.getElementById('expense-name').value;
            const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
            const expenseDate = document.getElementById('expense-date').value;

            if (expenseName && !isNaN(expenseAmount) && expenseDate) {
                expenses.push({ name: expenseName, amount: expenseAmount, date: expenseDate });
                displayExpenses();
                expenseForm.reset();
            }
        });
    }

    function displayExpenses() {
        if (expenseHistory) {
            expenseHistory.innerHTML = '';
            expenses.forEach((expense, index) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${expense.name}</strong> - $${expense.amount.toFixed(2)} (${expense.date})
                    <button onclick="deleteExpense(${index})">Delete</button>`;
                expenseHistory.appendChild(li);
            });
        }
    }

    window.deleteExpense = (index) => {
        expenses.splice(index, 1);
        displayExpenses();
    };

    // Fetch and display feedback
    const feedbackContainer = document.getElementById('feedback-container');
    if (feedbackContainer) {
        fetch('/get-feedback')
            .then(response => response.json())
            .then(data => {
                const table = document.createElement('table');
                table.className = 'feedback-table';
                table.innerHTML = `
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Gender</th>
                        <th>Email</th>
                        <th>Comment</th>
                    </tr>
                `;
                data.forEach(feedback => {
                    const row = table.insertRow();
                    row.innerHTML = `
                        <td>${feedback.firstname}</td>
                        <td>${feedback.secondname}</td>
                        <td>${feedback.gender}</td>
                        <td>${feedback.mail}</td>
                        <td>${feedback.commentfield}</td>
                    `;
                });
                feedbackContainer.appendChild(table);
            });
    }
});