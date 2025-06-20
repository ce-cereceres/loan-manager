// Payment Date input field
const paymentDate = document.querySelector('#payment-date');
// Payment amount input field
const paymentAmount = document.querySelector('#payment-amount');
// Form
const paymentUpdateForm = document.querySelector('#payment-update-form');



// Recieves clicked payment details
window.api.sendPaymentDetails((payment) => {
    console.log(payment);
    paymentDate.value = payment.payment_date;
    paymentAmount.value = payment.quantity;
    
    paymentUpdateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const paymentDetails = {
            id: payment.id,
            loan_id: payment.loan_id,
            quantity: paymentAmount.value,
            payment_date: paymentDate.value
        }

        window.database.updatePayment(paymentDetails);
    })
})