const loanForm = document.querySelector('#loan-form');
const borrowerSelect = document.querySelector('#borrower');
const loanInitialQuantity = document.querySelector('#initial-quantity');
const startLoanDate = document.querySelector('#start-date');

document.addEventListener('DOMContentLoaded', async () => {
    const borrowers = await window.api.getAllBorrowers();
    if (!borrowers.success) {
        appendAlert(borrowers.message, 'danger');
    } else {
        borrowersArray = borrowers.data;
        for (const borrower of borrowersArray) {
            const options = document.createElement('option');
            options.textContent = `${borrower.name} ${borrower.last_name}`;
            options.value = borrower.id;
            borrowerSelect.appendChild(options);
        }
    }
})

document.addEventListener('submit', async (event) => {
    event.preventDefault();

    const loanDetails = {
        borrower_id: borrowerSelect.value,
        initial_quantity: loanInitialQuantity.value,
        start_loan_date: startLoanDate.value
    }

    const status = await window.database.createLoan(loanDetails);
    console.log(status);
    
    if (!status.success) {
        appendAlert(status.message, 'danger')
    } else {
        // Redirects to loans
        window.api.openLoanWindow();
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