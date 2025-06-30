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