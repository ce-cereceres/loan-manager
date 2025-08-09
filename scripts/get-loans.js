// "New Loan" button
const newLoan = document.querySelector('#new-loan-button');
// "New loan" button open the form to create a new loan
newLoan.addEventListener('click', () => {
    window.api.openLoanForm();
});

document.addEventListener('DOMContentLoaded', async () => {
    /**
     * @typedef {object} Query
     * @property {string} success - Indicate the status of the database query
     * @property {string} message - The database message
     * @property {object} data - A list of all borrowers
     */

    /**
     * Object with the query result
     * @type {Query}
     */
    const loans = await window.api.getAllLoanDetails();
    loansJson = loans.data;
    
    let loanTable = new DataTable('#loans-table', {
        data: loansJson,
        columns: [
            {data: 'full_name'},
            {data: 'ine'},
            {
                data: 'initial_quantity',
                render: function(data, type) {
                    return `$${data}`;
                }
            },
            {
                data: 'total_loan',
                render: function(data, type) {
                    return `$${data}`;
                }
            },
            {
                data: 'start_date',
            },
            {
                data: 'finish_date',
                render: function(data, type) {
                    if (data === null) {
                        return 'Not finished';
                    }
                    return data;
                }
            },
            {
                data: null,
                title: 'Actions',
                orderable: false,
                searchable: false,
                render: function (data, type) {
                    return '<button class="view-btn btn btn-success">View</button> <button class="edit-btn btn btn-info">Edit</button> <button class="delete-btn btn btn-danger">Delete</button>';
                }
            }
        ],
        columnControl: [
            ['orderAsc', 'orderDesc', 'search']
        ],
        responsive: true
    })
    // View Button Action
    $('#loans-table tbody').on('click', '.view-btn', function() {
        let table = $('#loans-table').DataTable();
        let rowData = table.row($(this).closest('tr')).data();
        window.api.getLoanDetails(rowData.id);
    });

    // Edit button action
    $('#loans-table tbody').on('click', '.edit-btn', function() {
        let table = $('#loans-table').DataTable();
        let rowData = table.row($(this).closest('tr')).data();
        window.api.openLoanEdit(rowData.id);
        
    });

    // Delete Button Action
    $('#loans-table tbody').on('click', '.delete-btn', async function() {
        let table = $('#loans-table').DataTable();
        let rowData = table.row($(this).closest('tr')).data();
        const userConfirm = confirm('Are you sure you want to delete the loan. All payments and interest will be lost');
        if (userConfirm) {
            const status = await window.database.deleteLoan(rowData.id);
            if (!status.success) {
                appendAlert(status.message, 'danger');
            } else {
                appendAlert(`Loan deleted successfuly`, 'success');
                window.api.openLoanWindow();
            }
        }
    });
});


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