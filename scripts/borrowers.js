// "New Borrower" button
const newBorrowerButton = document.querySelector('#new-borrower-button');

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

        let borrowerTable = new DataTable('#borrowers-table', {
            data: borrowersArray,
            columns: [
                {data: 'name'},
                {data: 'last_name'},
                {data: 'ine'},
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    render: function (data, type, row) {
                        return `<button class="edit-btn btn btn-info" value="${data.id}">Edit</button> <button class="delete-btn btn btn-danger" value="${data.id}">Delete</button>`;
                    }
                }
            ],
            layout: {
                topStart: {
                    buttons: [
                        {
                            extend: 'copy',
                            exportOptions: {
                                columns: ['.export-col']
                            }
                        },
                        {
                            extend: 'excel',
                            exportOptions: {
                                columns: ['.export-col']
                            }
                        },
                        {
                            extend: 'csv',
                            exportOptions: {
                                columns: ['.export-col']
                            }
                        }
                    ]
                }
            }
        });

        // Edit button action
        $('#borrowers-table tbody').on('click', '.edit-btn', function() {
            let table = $('#borrowers-table').DataTable();
            let rowData = table.row($(this).closest('tr')).data();
            window.api.openBorrowerDetails(rowData.id);
        });

        // Delete Button Action
        $('#borrowers-table tbody').on('click', '.delete-btn', function() {
            let table = $('#borrowers-table').DataTable();
            let rowData = table.row($(this).closest('tr')).data();
            const userConfirmed = confirm(`Are you sure you want to delete '${rowData.name} ${rowData.last_name}'?`);
            if (userConfirmed) {
                const doubleUserConfirmed = confirm('All loans from this borrower will be lost. Are you sure you want to continue?');
                if (doubleUserConfirmed) {
                    // Delete the borrower
                    window.database.deleteBorrower(rowData.id);
                    // Reloads the page
                    location.reload();
                }
            }
        });
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