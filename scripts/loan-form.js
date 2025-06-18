const loanForm = document.querySelector('#loan-form');
const borrowerSelect = document.querySelector('#borrower');
const loanInitialQuantity = document.querySelector('#initial-quantity');
const startLoanDate = document.querySelector('#start-date');

document.addEventListener('DOMContentLoaded', () => {
    window.api.getAllBorrowers();
})

document.addEventListener('submit', (event) => {
    event.preventDefault();

    // const loanDetails = [borrowerSelect.value, loanInitialQuantity.value, startLoanDate.value];
    const loanDetails = {
        borrower_id: borrowerSelect.value,
        initial_quantity: loanInitialQuantity.value,
        start_loan_date: startLoanDate.value
    }

    window.database.createLoan(loanDetails);
})

window.api.sendAllBorrowers((borrowers) => {
    borrowers.forEach(borrower => {
        const options = document.createElement("option");
        options.textContent = `${borrower.name} ${borrower.last_name}`;
        options.value = borrower.id;

        borrowerSelect.appendChild(options);
    });
})
