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
    
    // p.textContent = data;
    console.log(borrowers);

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
        // Update button
        updateButton.value = element.id;
        updateButton.textContent = `Update id = ${element.id}`;
        // Appends table data to table row
        tr.appendChild(tdName);
        tr.appendChild(tdLastName);
        tr.appendChild(tdIne);
        tr.appendChild(tdAction);
        // Appends buttons to table data "Action"
        tdAction.appendChild(deleteButton);
        tdAction.appendChild(updateButton);

        // Action on clicked "Delete" button
        deleteButton.addEventListener('click', () => {
            console.log(`Test for delete button. ID = ${deleteButton.value}`);
            window.database.deleteBorrower(deleteButton.value);
            location.reload();
        });
        // Action on clicked "Update" button
        updateButton.addEventListener('click', () => {
            console.log(`Test for update button. ID = ${updateButton.value}`);
            window.api.openBorrowerDetails(updateButton.value)
        });
        
    });
})