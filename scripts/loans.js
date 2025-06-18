const container = document.querySelector('.container');
// "New Loan" button
const newLoan = document.createElement("button");
newLoan.textContent = 'New loan';
container.appendChild(newLoan);

// Loads all borrowers on page load
document.addEventListener('DOMContentLoaded', () => {
    window.api.getAllBorrowers();
    
})

// "New loan" button open the form to create a new loan
newLoan.addEventListener('click', () => {
    window.api.openLoanForm()
})

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

    // Receives a list with all the loans that belongs to certain borrower
    // Function is called usign window.api.getLoans(id)
    window.api.sendLoans((loans) => {
        loans.forEach(loan => {
            const loanDetails = document.createElement("p");
            const loanDiv = document.querySelector(`#borrower-${loan.borrower_id}`);
            const loanEditButton = document.createElement("button");
            loanEditButton.value = loan.id;
            loanEditButton.textContent = `Edit loan with id = ${loan.id}`;
            loanDetails.textContent = `initial quantity = ${loan.initial_quantity} 
            remaining quantity = ${loan.remaining_quantity} 
            start_date = ${loan.start_date}`;

            loanEditButton.addEventListener('click', () => {
                window.api.getLoanDetails(loan.id);
            })
            
            loanDiv.appendChild(loanDetails);
            loanDiv.appendChild(loanEditButton);
            
        });
    })
})