// Payment Date input field
const interestDate = document.querySelector('#interest-date');
// Payment amount input field
const interestAmount = document.querySelector('#interest-amount');
// Form
const interestUpdateForm = document.querySelector('#interest-update-form');


window.api.sendInterestDetails((interest) => {
    console.log(interest);
    
    interestDate.value = interest.renewal;
    interestAmount.value = interest.quantity;
    
    interestUpdateForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const interestDetails = {
            id: interest.id,
            loan_id: interest.loan_id,
            quantity: interestAmount.value,
            renewal: interestDate.value
        }

        console.log(interestDetails);
        
        window.database.updateInterest(interestDetails);
    })
})