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
        
    // Crate array object
    let profitByBorrowerArray = [];
    for (const row of profitsByBorrower) {
        const borrowerArray = [
            row.full_name,
            `$${row.profit}`
        ]
        
        profitByBorrowerArray.push(borrowerArray);        
    }
    
    new DataTable('#total-profit-table', {
        data: profitByBorrowerArray,
        layout: {
            topStart: {
                buttons: [
                    'copy', 'excel', 'csv'
                ]
            }
        }
    })
    
    
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

        const customTableData = await window.api.getProfitByBorrowerCustom(dates);
        // const customTable = document.querySelector('#profit-by-borrower-tbody-custom');
        // customTable.innerHTML = '';

        let customTableArray = [];
        for (const borrower of customTableData.data) {
            // const tr = document.createElement('tr');
            // const name = document.createElement('td');
            // const amount = document.createElement('td');
            // name.textContent = borrower.full_name;
            // amount.textContent = `$${borrower.profit}`;
            // tr.appendChild(name);
            // tr.appendChild(amount);
            // customTable.appendChild(tr);
            const borrowerArray = [
                borrower.full_name,
                `$${borrower.profit}`
            ]
            customTableArray.push(borrowerArray)
        }

        // If the table exists, delete it
        const customProfitTableCheck = $('#custom-profit-table').DataTable();
        if (customProfitTableCheck){
            customProfitTableCheck.destroy(true);
        }

        const customProfitTable = document.createElement('table');
        customProfitTable.id = 'custom-profit-table'
        customProfitTable.classList.add('table', 'table-hover');
        customProfitTable.innerHTML = [
            '<thead>',
            '   <tr>',
            '       <th scope="col">Name</th>',
            '       <th scope="col">Amount</th>',
            '   </tr>',
            '</thead>',
            '<tbody>',
            '</tbody>'
        ].join('');

        const tableDiv = document.querySelector('#custom-profit-div');
        tableDiv.appendChild(customProfitTable);

        new DataTable(customProfitTable, {
            data: customTableArray,
            layout: {
                topStart: {
                    buttons: [
                        'copy', 'excel', 'csv'
                    ]
                }
            }
        })
        
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