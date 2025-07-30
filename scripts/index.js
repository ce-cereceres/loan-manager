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
    console.log(profit);
    
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