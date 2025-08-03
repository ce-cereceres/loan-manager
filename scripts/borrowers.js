// "New Borrower" button
const newBorrowerButton = document.querySelector('#new-borrower-button');
// Table with borrower
const borrowerTableBody = document.querySelector('#borrowers-table-body');

// When "New Borrower" button is clicked open borrower form to create new borrower
newBorrowerButton.addEventListener('click', () => {
    window.api.openBorrowerForm();
});

// Call to get all borrowers when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const status = await window.api.getAllBorrowers();
    console.log(status);
    if (!status.success) {
        appendAlert(status.message, 'danger')
    } else {
        const borrowersArray = status.data;
        console.log(borrowersArray);

        for (const borrower of borrowersArray) {
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
            tdName.textContent = borrower.name;
            tdLastName.textContent = borrower.last_name;
            tdIne.textContent = borrower.ine;
            // Delete button
            deleteButton.value = borrower.id;
            deleteButton.textContent = `Delete id = ${borrower.id}`;
            deleteButton.classList.add('btn', 'btn-danger')
            // Update button
            updateButton.value = borrower.id;
            updateButton.textContent = `Update id = ${borrower.id}`;
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
        }
    }
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