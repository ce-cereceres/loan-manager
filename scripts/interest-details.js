// Payment Date input field
const interestDate = document.querySelector('#interest-date');
// Payment amount input field
const interestAmount = document.querySelector('#interest-amount');
// Form
const interestUpdateForm = document.querySelector('#interest-update-form');
// "Cancel" button
const cancelBtn = document.querySelector('#cancel-interest-button');

/**
 * @typedef {object} InterestDetails
 * @property {number} id - The unique ID of the interest
 * @property {number} loan_id - The unique ID of the loan
 * @property {number} quantity - The amount of the interest
 * @property {string} renewal - The date when the interest was made
 */

/**
 * Recives the interest data.
 * This function take the interest data to populate the form used to update
 * @param {InterestDetails} interest
 */
window.api.sendInterestDetails((interest) => {
    interestDate.value = interest.renewal;
    interestAmount.value = interest.quantity;
    
    interestUpdateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const interestData = {
            id: interest.id,
            loan_id: interest.loan_id,
            quantity: interestAmount.value,
            renewal: interestDate.value
        }
        window.database.updateInterest(interestData);
        window.api.getLoanDetails(interest.loan_id);
    });

    cancelBtn.addEventListener('click', () => {
        window.api.getLoanDetails(interest.loan_id);
    })
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