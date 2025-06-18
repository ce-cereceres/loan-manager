// Get "View Clients" button element
const viewClientsButton = document.querySelector('#view-clients-button');
// Get "View Loans" button element
const viewLoansButton = document.querySelector('#view-loans-button');

// Add event to open clients.html view
viewClientsButton.addEventListener('click', () => {
    window.api.openBorrowerWindow();
})

viewLoansButton.addEventListener('click', () => {
    window.api.openLoanWindow();
})