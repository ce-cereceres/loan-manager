// Selects the container in the main body of the html document
const container = document.querySelector('.container');

// "New Loan" button
const newLoan = document.createElement("button");
newLoan.textContent = 'New loan';
container.appendChild(newLoan);
// "New loan" button open the form to create a new loan
newLoan.addEventListener('click', () => {
    window.api.openLoanForm()
});

// Loads all borrowers on page load
document.addEventListener('DOMContentLoaded', () => {
    window.api.getAllBorrowers();
});

// Receives a list with all the borrowers registered to the lender
window.api.sendAllBorrowers((borrowers) => {
    borrowers.forEach(borrower => {
        // Create div to display borrower and the loans it have
        const borrowerDiv = document.createElement("div");
        const borrowerName = document.createElement("h1");

        // Asign id to the div
        borrowerDiv.id = `borrower-${borrower.id}`;
        borrowerName.textContent = `${borrower.name} ${borrower.last_name}`;

        // Get the loans that belongs to the borrower
        window.api.getLoans(borrower.id);
        
        // Appends to the DOM
        container.appendChild(borrowerDiv);
        borrowerDiv.appendChild(borrowerName);
    });
});

// Receives a list with all the loans that belongs to certain borrower
// Function is called usign window.api.getLoans(id)
window.api.sendLoans((loans) => {
    loans.forEach(loan => {
        // Selects the borrower div that correspond to the respective loan
        const loanDiv = document.querySelector(`#borrower-${loan.borrower_id}`);

        // Creates a div used to display data from the loan
        const loanDetailsDiv = document.createElement("div");
        loanDetailsDiv.id = `loan-details-${loan.id}`;
        loanDiv.appendChild(loanDetailsDiv);

        // Loan initial amount label
        const loanInitialAmount = document.createElement("p");
        loanInitialAmount.innerText = `Loan Initial Amount: ${loan.initial_quantity}`;
        loanDetailsDiv.appendChild(loanInitialAmount);

        // Loan start date label
        const loanDate = document.createElement("p");
        loanDate.innerText = `Loan Start Date: ${loan.start_date}`;
        loanDetailsDiv.appendChild(loanDate);

        // "Edit Loan" Button
        const loanEditButton = document.createElement("button");
        loanEditButton.value = loan.id;
        loanEditButton.textContent = `Edit loan with id = ${loan.id}`;
        loanEditButton.addEventListener('click', () => {
            window.api.getLoanDetails(loan.id);
        });
        loanDiv.appendChild(loanEditButton);

        // Calls the total of the loan
        window.api.getLoanTotalAmount(loan.id);        
    });        
});


window.api.sendLoanTotalAmount((amount) => {
    console.log(amount);
    const loanDetailsDiv = document.querySelector(`#loan-details-${amount.id}`);
    // Loan remaining amount
    const loanRemainingAmount = document.createElement('p');
    loanRemainingAmount.innerText = `Loan Remainig Amount: ${amount.total_loan}`;
    loanDetailsDiv.appendChild(loanRemainingAmount);
});