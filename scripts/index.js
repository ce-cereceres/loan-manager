import Chart from 'chart.js/auto';
// Get "View Clients" button element
const viewClientsButton = document.querySelector('#view-clients-button');
// Get "View Loans" button element
const viewLoansButton = document.querySelector('#view-loans-button');

// Add event to open clients.html view
viewClientsButton.addEventListener('click', () => {
    window.api.openBorrowerWindow();
})

viewLoansButton.addEventListener('click', () => {
    window.api.openLoanWindow();
})

async function getTotalProfits() {
    const profitAmount = document.querySelector('#total-amount')
    const profit = await window.api.getAllProfits();
    
    profitAmount.textContent = `$${profit.total_interest}`;
}getTotalProfits();

async function getProfitsByBorrower() {
    /**
     * @typedef {object} Borrower
     * @property {number} id - The unique id from borrower
     * @property {string} full_name - The full name from the borrower
     * @property {number} profit - The SUM of interest from the borrower
     */
    /**
     * Get a list with full names and total interest from borrowers
     * @type {array<Borrower>} profitByBorrower
     */
    const profitsByBorrower = await window.api.getProfitByBorrower();

    const profitByBorrowerTable = document.querySelector('#profit-by-borrower-tbody');
    
    // Populate profits by borrower table
    profitsByBorrower.forEach(borrower => {
        const tr = document.createElement('tr');
        const name = document.createElement('td');
        const profit = document.createElement('td');
        name.textContent = borrower.full_name;
        profit.textContent = `$${borrower.profit}`;
        tr.appendChild(name);
        tr.appendChild(profit);
        profitByBorrowerTable.appendChild(tr);
    });

    
    // Pie chart to display profit by borrower
    // const chartCanvas = document.createElement('canvas');
    // chartCanvas.id = 'profitByBorrower';
    // chartCanvas.className = 'profit-by-borrower';
    // new Chart(
    //     chartCanvas,
    //     {
    //         type: 'pie',
    //         data: {
    //             labels: profitsByBorrower.map(row => row.full_name),
    //             datasets: [
    //                 {
    //                     label: 'Profits',
    //                     data: profitsByBorrower.map(row => row.profit)
    //                 }
    //             ]
    //         },
    //         options: {
    //             responsive: true,
    //             plugins: {
    //                 legend: {
    //                     position: 'top',
    //                     // onClick: null
    //                 },
    //                 title: {
    //                     display: true,
    //                     text: 'Profits by borrower'
    //                 }
    //             }
    //         }
    //     }
    // )
    // totalProfitDiv.appendChild(chartCanvas);

    
}getProfitsByBorrower();

/**
 * Custom Profit
 */
const customProfitForm = document.querySelector('#custom-profit-form');
const customStartDate = document.querySelector('#start-date');
const customEndDate = document.querySelector('#end-date');
customProfitForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const dates = {
        start_date: customStartDate.value,
        end_date: customEndDate.value
    };

    if (dates.start_date < dates.end_date) {
        const customProfitAmount = await window.api.getCustomProfit(dates);
        const customAmountLabel = document.querySelector('#custom-amount');
        customAmountLabel.textContent = `$${customProfitAmount.data.total_custom_interest}`;
        console.log(customProfitAmount);

        const customTableData = await window.api.getProfitByBorrowerCustom(dates);
        const customTable = document.querySelector('#profit-by-borrower-tbody-custom');
        customTable.innerHTML = '';

        for (const borrower of customTableData.data) {
            const tr = document.createElement('tr');
            const name = document.createElement('td');
            const amount = document.createElement('td');
            name.textContent = borrower.full_name;
            amount.textContent = `$${borrower.profit}`;
            tr.appendChild(name);
            tr.appendChild(amount);
            customTable.appendChild(tr);
        }
        
        
    } else if (dates.start_date === dates.end_date) {
        appendAlert('The dates are equals', 'danger');
    } else if (dates.start_date > dates.end_date) {
        appendAlert('The start date is bigger to the end date', 'danger');
    }    
})

// Alerts
const alertPlaceholder = document.querySelector('#alert-placeholder');
const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    alertPlaceholder.append(wrapper);
};

// Navbar
const navbarHome = document.querySelector('#index-navbar-link');
const navbarBorrowers = document.querySelector('#borrowers-navbar-link');
const navbarLoans = document.querySelector('#loans-navbar-link');
const navbarBrand = document.querySelector('#navbar-brand');
navbarBrand.addEventListener('click', (event) => {
    event.preventDefault();
    window.api.openIndexWindow();
})
navbarHome.addEventListener('click', (event) => {
    event.preventDefault();
    window.api.openIndexWindow()
})
navbarBorrowers.addEventListener('click', (event) => {
    event.preventDefault();
    window.api.openBorrowerWindow();
})
navbarLoans.addEventListener('click', (event) => {
    event.preventDefault();
    window.api.openLoanWindow();
})