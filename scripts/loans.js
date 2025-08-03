// Selects the container in the main body of the html document
// const container = document.querySelector('#loans-content');

// "New Loan" button
// const newLoan = document.createElement("button");
const newLoan = document.querySelector('#new-loan-button');
// "New loan" button open the form to create a new loan
newLoan.addEventListener('click', () => {
    window.api.openLoanForm();
});

// Loads all borrowers on page load
document.addEventListener('DOMContentLoaded', async () => {
    /**
     * @typedef {object} Query
     * @property {string} success - Indicate the status of the database query
     * @property {string} message - The database message
     * @property {object} data - A list of all borrowers
     */

    /**
     * Object with the query result
     * @type {Query}
     */
    const borrowers = await window.api.getAllBorrowers();
    if (!borrowers.success) {
        // If the query fails
        appendAlert(borrowers.message, 'danger');
    } else {
        /**
         * @typedef {object} Borrower
         * @property {number} id - The borrower id
         * @property {string} name - The borrower name
         * @property {string} last_name - The borrower last name
         * @property {string} ine - The borrower INE
         * @property {string} created_at - The date when the borrower was created
         * @property {string} updated_at - The date when the borrower was updated
         */

        /**
         * Array of borrowers objects
         * @type {Borrower[]}
         */
        const borrowerArray = borrowers.data;
        // Container for borrowers
        const borrowersContainer = document.querySelector('#borrowers-container');

        for (const borrower of borrowerArray) {
            // Wrapper for each individual borrower
            const borrowerWrapper = document.createElement('div');
            borrowerWrapper.classList.add('row')
            // Wrapper for Loan Details
            const loanDetailsWrapper = document.createElement('div');
            loanDetailsWrapper.classList.add('col-4');
            // Appends loanDetailsWrapper to borrowerWrapper
            borrowerWrapper.appendChild(loanDetailsWrapper);
            // Borrower name
            const borrowerName = document.createElement('h1');
            borrowerName.textContent = `${borrower.name} ${borrower.last_name}`;
            // Append name to loanDetails
            loanDetailsWrapper.appendChild(borrowerName);
            // Append to main document
            borrowersContainer.appendChild(borrowerWrapper);

            /**
             * List of all loans for specified borrower
             * @type {Query}
             */
            const borrowerLoan = await window.api.getLoans(borrower.id);
            if (!borrowerLoan.success) {
                appendAlert(borrowerLoan.message, 'danger');
            } else {
                /**
                 * @typedef {object} Loan
                 * @property {number} id - The loan id
                 * @property {number} borrower_id The borrower id
                 * @property {number} lender_id The lender id
                 * @property {number} initial_quantity - The initial amount of the loan
                 * @property {string} start_date - The date when the loan was created
                 * @property {string} finish_date - The date when the loan was finished
                 */

                /**
                 * Array of loans that belongs to borrower
                 * @type {Loan[]}
                 */
                const loansArray = borrowerLoan.data;
                for (const loan of loansArray) {
                    // Labels
                    const loanAmount = document.createElement('p');
                    const loanStartDate = document.createElement('p');
                    loanAmount.textContent = `Loan initial amount: ${loan.initial_quantity}`;
                    loanStartDate.textContent = `Loan start date: ${loan.start_date}`;

                    // Loan remaining amount
                    const loanRemainingAmount = await window.api.getLoanTotalAmount(loan.id);
                    if (!loanRemainingAmount.success) {
                        appendAlert(loanRemainingAmount.message, 'danger');
                    } else {
                        // Create label with the remaining amount
                        const loanRemainingAmountLabel = document.createElement('p');
                        loanRemainingAmountLabel.textContent = `Loan Remaining Amount: ${loanRemainingAmount.data.total_loan}`
                        loanDetailsWrapper.appendChild(loanRemainingAmountLabel);
                    }
                    

                    // "View Loan Details" Button
                    const loanViewButton = document.createElement("button");
                    loanViewButton.value = loan.id;
                    loanViewButton.textContent = `View Loan Details with id = ${loan.id}`;
                    loanViewButton.classList.add('btn', 'btn-primary')
                    loanViewButton.addEventListener('click', () => {
                        window.api.getLoanDetails(loan.id);
                    });

                    loanDetailsWrapper.appendChild(loanAmount);
                    loanDetailsWrapper.appendChild(loanStartDate);
                    loanDetailsWrapper.appendChild(loanViewButton);
                }
            }
        }        
    }
});



// TODO
// window.api.getLoanTotalAmount(loan.id); 


window.api.sendLoanTotalAmount((amount) => {
    console.log(amount);
    const loanDetailsDiv = document.querySelector(`#loan-details-${amount.id}`);
    // Loan remaining amount
    const loanRemainingAmount = document.createElement('p');
    loanRemainingAmount.innerText = `Loan Remainig Amount: ${amount.total_loan}`;
    loanDetailsDiv.appendChild(loanRemainingAmount);
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