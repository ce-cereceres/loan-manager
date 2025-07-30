// "New Borrower" button
const newBorrowerButton = document.querySelector('#new-borrower-button');
// Table with borrower
const borrowerTableBody = document.querySelector('#borrowers-table-body');

// When "New Borrower" button is clicked open borrower form to create new borrower
newBorrowerButton.addEventListener('click', () => {
    window.api.openBorrowerForm();
});

// Call to get all borrowers when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.api.getAllBorrowers();
    
})

window.api.sendAllBorrowers((borrowers) => {
    borrowers.forEach(element => {
        // Create table body
        // Table row
        const tr = document.createElement("tr");
        // Table data
        const tdName = document.createElement("td");
        const tdLastName = document.createElement("td");
        const tdIne = document.createElement("td");
        const tdAction = document.createElement("td");
        // Buttons
        const deleteButton = document.createElement("button");
        const updateButton = document.createElement("button");
        
        // Appends table row to borrower table
        borrowerTableBody.appendChild(tr);
        // Set values to table data
        tdName.textContent = element.name;
        tdLastName.textContent = element.last_name;
        tdIne.textContent = element.ine;
        // Delete button
        deleteButton.value = element.id;
        deleteButton.textContent = `Delete id = ${element.id}`;
        deleteButton.classList.add('btn', 'btn-danger')
        // Update button
        updateButton.value = element.id;
        updateButton.textContent = `Update id = ${element.id}`;
        updateButton.classList.add('btn', 'btn-primary')
        // Appends table data to table row
        tr.appendChild(tdName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdIne);
        tr.appendChild(tdAction);
        // Appends buttons to table data "Action"
        tdAction.appendChild(updateButton);
        tdAction.appendChild(deleteButton);
        // Action on clicked "Delete" button
        deleteButton.addEventListener('click', () => {
            const userConfirmed = confirm('Are you sure you want to delete this borrower?');
            if (userConfirmed) {
                const doubleUserConfirmed = confirm('All loans from this borrower will be lost. Are you sure you want to continue?');
                if (doubleUserConfirmed) {
                    // Delete the borrower
                    window.database.deleteBorrower(deleteButton.value);
                    // Reloads the page
                    location.reload();
                }
            }
        });
        // Action on clicked "Update" button
        updateButton.addEventListener('click', () => {
            // Opens form to update borrower
            window.api.openBorrowerDetails(updateButton.value)
        });
        
    });
})

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