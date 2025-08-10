// Payment Date input field
const paymentDate = document.querySelector('#payment-date');
// Payment amount input field
const paymentAmount = document.querySelector('#payment-amount');
// Form
const paymentUpdateForm = document.querySelector('#payment-update-form');
// "Cancel" button
const cancelBtn = document.querySelector('#cancel-payment-button');

/**
 * @typedef {object} PaymentDetails
 * @property {number} id - The unique ID of the payment
 * @property {number} loan_id - The unique ID of the loan
 * @property {number} quantity - The amount of the payment
 * @property {string} payment_date - The date when the payment was made
 */

/**
 * Recives the payment data.
 * This function take the payment data to populate the form used to update
 * @param {PaymentDetails} payment
 */
window.api.sendPaymentDetails((payment) => {
    paymentDate.value = payment.payment_date;
    paymentAmount.value = payment.quantity;
    
    paymentUpdateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const paymentData = {
            id: payment.id,
            loan_id: payment.loan_id,
            quantity: paymentAmount.value,
            payment_date: paymentDate.value
        }

        window.database.updatePayment(paymentData);
        window.api.getLoanDetails(payment.loan_id);
    })

    cancelBtn.addEventListener('click', () => {
        window.api.getLoanDetails(payment.loan_id);
    });
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