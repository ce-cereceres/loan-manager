// Form selector
const nameBorrower = document.querySelector('#name');
const lastName = document.querySelector('#last-name');
const ine = document.querySelector('#ine');
const form = document.querySelector('#borrower-details-form');
let borrowerId = "";

window.api.sendBorrowerDetails((borrower) => {
    nameBorrower.value = borrower.name;
    lastName.value = borrower.last_name;
    ine.value = borrower.ine;
    borrowerId = borrower.id;
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // const borrowerDetails = [borrowerId, nameBorrower.value, lastName.value, ine.value];
    const borrowerDetails = {
        id: borrowerId,
        name: nameBorrower.value,
        last_name: lastName.value,
        ine: ine.value
    }
    console.log(borrowerDetails);

    const status = await window.database.updateBorrower(borrowerDetails);

    if (!status.success) {
        // Alert
        appendAlert(status.message, 'danger')
    } else {
        window.api.openBorrowerWindow();
    }
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