const nameBorrower = document.querySelector('#name');
const lastName = document.querySelector('#last-name');
const ine = document.querySelector('#ine');
const form = document.querySelector('#borrower-details-form');
let borrowerId = "";

window.api.sendBorrowerDetails((borrower) => {
    console.log(borrower);
    nameBorrower.value = borrower.name;
    lastName.value = borrower.last_name;
    ine.value = borrower.ine;
    borrowerId = borrower.id;
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    // const borrowerDetails = [borrowerId, nameBorrower.value, lastName.value, ine.value];
    const borrowerDetails = {
        id: borrowerId,
        name: nameBorrower.value,
        last_name: lastName.value,
        ine: ine.value
    }
    console.log(borrowerDetails);

    window.database.updateBorrower(borrowerDetails);
    
    window.api.openBorrowerWindow();
});
