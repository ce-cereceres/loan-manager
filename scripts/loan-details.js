import Chart from 'chart.js/auto';

/**
 * @typedef {object} Loan
 * @property {number} id - The unique identifier for the loan
 * @property {number} lender_id - The unique identifier for the lender
 * @property {number} borrower_id - The unique identifier for the borrower
 * @property {number} initial_quantity - The initial amount of the loan
 * @property {number} remaining_quantity - The remaining amount of the loan
 * @property {date} start_date - The date when the loan was created
 * @property {date} finish_date - The date when the loan was finished
 */

/**
 * @typedef {object} Transaction
 * @property {date} transaction_date - The date when the transaction was realized
 * @property {number} payment_final - The sum of the payment
 * @property {number} interest_final - The sum of the interest
 * @property {number} difference - The diference between payment and interest
 * @property {number} current_loan_amount - The current loan amount in the specified time
 */

/**
 * Load loan details
 * @param {Loan} loan
 */
window.api.sendLoanDetails((loan) => {
    // "Payment Table Body" selector
    const paymentTableBody = document.querySelector('#payment-table-body');
    // "Interest Table Body" selector
    const interestTableBody = document.querySelector('#interest-table-body');
    // "New Payment" Button
    const newPaymentButton = document.querySelector('#new-payment');
    // "New Interest" Button
    const newInterestButton = document.querySelector('#new-interest');
    // "Payment" Dialog
    const paymentDialog = document.querySelector('#payment-dialog');
    // "Cancel Payment" Dialog Button
    const paymentCancelButton = document.querySelector('#cancel-payment-button');
    // "Payment" Form
    const paymentForm = document.querySelector('#payment-form');
    // "Interest" dialog
    const interestDialog = document.querySelector('#interest-dialog');
    // "Interest" Form
    const interestForm = document.querySelector('#interest-form');
    // "Cancel Interest" Dialog Button
    const interestCancelButton = document.querySelector('#cancel-interest-button');


    async function getLoanDetails() {
        // Get the borrower name
        const borrowerName = await window.api.getBorrowerName(loan.borrower_id);
        if (!borrowerName.success) {
            appendAlert(borrowerName.message, 'danger');
        }
        // Get the loan total amount after adding the interest and subtracting payments
        const loanAmountData = await window.api.getLoanTotalAmount(loan.id);
        if (!loanAmountData.success) {
            appendAlert(loanAmountData.message, 'danger');
        }
        // "Loan" id label DEBUG
        const loanId = document.querySelector('#loan-id');
        loanId.textContent = loan.id;
        // Borrower name
        const borrowerNameLabel = document.querySelector('#borrower-name');
        borrowerNameLabel.textContent = `Name: ${borrowerName.data.name} ${borrowerName.data.last_name}`;
        console.log(borrowerName.data);
        // Loan initial amount
        const loanInitialAmount = document.querySelector('#loan-initial-amount');
        loanInitialAmount.textContent = `Initial amount: ${loan.initial_quantity}`
        // "Loan" amount label
        const loanAmount = document.querySelector('#loan-amount');
        loanAmount.textContent = `Remaining amount: ${loanAmountData.data.total_loan}`;
        console.log(loanAmountData.data);
        
        // "Loan" start date label
        const loanStartDate = document.querySelector('#loan-start-date');
        loanStartDate.textContent = `Loan start date: ${loan.start_date}`;
    }getLoanDetails();

    /**
     * Documents.
     * Logic to hande display and creation of documents that belongs to the loan
     */
    // Populate documents table
    async function loanDocument() {
        const loanDocumentTable = document.querySelector('#loan-document-table');
        /**
         * @typedef {object} LoanDocument
         * @property {number} id - The document id
         * @property {number} loan_id - The loan id
         * @property {string} title - The document title
         * @property {string} type - The document extension
         * @property {string} uuid - The document name
         */

        /**
         * @type {LoanDocument} data
         */
        const data = await window.api.getLoanDocuments(loan.id);

        data.forEach(documentFile => {
            console.log(documentFile);
            // Row
            const tr = document.createElement('tr');
            // title row
            const title = document.createElement('td');
            // Link
            const linkToDocument = document.createElement('a');
            // Appends the link to the title td
            title.appendChild(linkToDocument);
            // Type row
            const type = document.createElement('td');
            // Button to delete document
            const deleteButton = document.createElement('button');

            linkToDocument.textContent = documentFile.title;
            linkToDocument.href = '#';
            type.textContent = documentFile.type;
            deleteButton.textContent = `Delete with id = ${documentFile.id}`;
            deleteButton.value = documentFile.id;
            deleteButton.classList.add('btn', 'btn-danger');

            // Delete button action
            deleteButton.addEventListener('click', async () => {
                const userConfirmed = confirm('Are you sure you want to delete the document');
                if (userConfirmed) {
                    // Calls to database to delete the document
                    const locationDeletionStatus = await window.database.deleteDocumentLocation(documentFile.uuid);
                    console.log(locationDeletionStatus);
                    
                    

                    if (locationDeletionStatus.success) {
                        const databaseDeletionStatus = await window.database.deleteDocument(documentFile.id);
                        if (databaseDeletionStatus.success) {
                            // After the document is deleted, refresh the view
                            window.api.getLoanDetails(loan.id);
                        } else {
                            // TODO
                            // Error deleting file from database
                            // Display alert
                        }

                    } else {
                        // TODO
                        // Error deleting file from location
                        // Display alert
                        const userConfirmedDeletion = confirm('The file was already deleted. Are you sure you want to delete from table?');
                        if (userConfirmedDeletion) {
                            const databaseDeletionStatus = await window.database.deleteDocument(documentFile.id);
                            if (databaseDeletionStatus.success) {
                                // After the document is deleted, refresh the view
                                window.api.getLoanDetails(loan.id);
                            } else {
                                // TODO
                                // Error deleting file from database
                                // Display alert
                            }
                        }
                    }
                    
                }
            })

            linkToDocument.addEventListener('click', (event) => {
                event.preventDefault()
                // Calls to create a new window sending the file
                // THIS FUNCTION AFFECTS SECURITY OF THE APP
                // ANYONE CAN OPENS FILES IF THE UUID IS KNOW
                window.api.openLoanDocument(documentFile.uuid)
                    .then(data => {
                        if (!data.success) {
                            // Display alert for file not found
                            console.log('FILE NOT FOUND');
                            alert('FILE NOT FOUND');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
                
                
            })

            tr.appendChild(title);
            tr.appendChild(type);
            tr.appendChild(deleteButton);
            loanDocumentTable.appendChild(tr);
            
            
        });
    }loanDocument();

    // Dialog logic to create new documents
    const documentDialog = document.querySelector('#document-creation');
    const newDocumentButton = document.querySelector('#new-document');
    const closeDocumentButton = document.querySelector('#cancel-document-button');
    newDocumentButton.addEventListener('click', () => {
        documentDialog.showModal();
    });
    closeDocumentButton.addEventListener('click', () => {
        documentDialog.close();
    });

    // Open file
    const openFileButton = document.querySelector('#open-file-button');
    /** Show the file location in the document creation dialog */
    const filePathText = document.querySelector('#file-path-text');
    /** Location of the file */
    const filePath = document.querySelector('#file-path');
    const fileTitle = document.querySelector('#document-title');
    /** Event when "Select File" clicked */
    openFileButton.addEventListener('click', async () => {
        /**
         * @typedef {object} DocumentPath
         * @property {boolean} success - Status of file selection
         * @property {string} message - Show in detail the status of the file selection
         * @property {string} path - Location of the file in user computer
         */
        /**
         * @returns {DocumentPath} documentPath 
         */
        const documentPath = await window.api.getDocumentPath();
        
        if (documentPath.path === '') {
            filePathText.textContent = 'File not selected';
        }

        filePathText.textContent = documentPath.path;
        filePath.value = documentPath.path;
        
    })
    // Form
    const documentForm = document.querySelector('#document-form');
    documentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Logic to handle creation of documents
        if (filePath.value === '') {
            // File not selected. DISPLAY ERROR TO USER
            console.log('ERROR. submit file null');
        } else {
            // File Selected
            // Logic to handle document creation
            const data = {title: fileTitle.value, path: filePath.value, loan_id: loan.id};
            console.log(data);

            // Returns success and message from operation in main process
            const status = await window.database.createDocument(data);

            if (status.success) {
                // After the document is uploaded, refresh the view
                window.api.getLoanDetails(loan.id);
            } else {
                // TODO
                // Display alert showing the error
            }
        }
    })


    async function combinedChart() {
        /**
         * @type {Array<Transaction>} chartData
         */
        const chartData = await window.api.getChartData(loan.id);
        const chartCanvas = document.querySelector('#combined-chart');
        // Chart config
        new Chart(
            chartCanvas,
            {
                type: 'bar',
                data: {
                    labels: chartData.map(row => row.transaction_date),
                    datasets: [
                        {
                            label: 'Interest',
                            data: chartData.map(row => row.interest_final),
                            borderColor: '#3F8B5A',
                            backgroundColor: '#1BE060'
                        },
                        {
                            label: 'Payment',
                            data: chartData.map(row => row.payment_final),
                            borderColor: '#A13F3B',
                            backgroundColor: '#E0201A'
                        },
                        // {
                        //     label: 'Difference',
                        //     data: chartData.map(row => row.difference),
                        //     type: 'line',
                        //     borderColor: '#1B88E0',
                        //     backgroundColor: '#3C5061'
                        // },
                        {
                            label: 'Loan Amount',
                            data: chartData.map(row => row.current_loan_amount),
                            type: 'line',
                            borderColor: '#1B88E0',
                            backgroundColor: '#3C5061'
                        }
                    ]
                },
                options: {
                    interaction: {
                        intersect: false
                    }
                }
            }
        )
    }combinedChart();

    

    // Get all payments to selected loan and populate payment table
    window.api.getLoanPayment(loan.id);
    window.api.sendPayment((payments) => {
        payments.forEach(payment => {
            const tr = document.createElement("tr");
            const tdDate = document.createElement("td");
            tdDate.textContent = payment.payment_date;
            const tdAmount = document.createElement("td");
            tdAmount.textContent = payment.quantity;
            const tdAction = document.createElement("td");
            // Buttons
            const deleteButton = document.createElement("button");
            const updateButton = document.createElement("button");
            // Buttons wrapper
            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.classList.add('btn-group');

            // Delete button
            deleteButton.value = payment.id;
            deleteButton.textContent = `Delete id = ${payment.id}`;
            deleteButton.classList.add('btn', 'btn-danger')
            // Delete button action
            deleteButton.addEventListener('click', () => {
                // Confirm action when delete button pressed
                const userConfirmed = confirm('Are you sure you want to delete the payment');
                if (userConfirmed) {
                    // Delete payment
                    window.database.deletePayment(payment.id);
                    // Refresh the page
                    window.api.getLoanDetails(loan.id);
                } 
            });
            // Update button
            updateButton.value = payment.id;
            updateButton.textContent = `Update id = ${payment.id}`;
            updateButton.classList.add('btn', 'btn-info')
            // Update button action
            updateButton.addEventListener('click', () => {
                console.log(`clicked update button with id = ${payment.id}`);
                window.api.openPaymentDetails(payment.id);
            });

            // Appends to payment table
            paymentTableBody.appendChild(tr);
            tr.appendChild(tdDate);
            tr.appendChild(tdAmount);
            tr.appendChild(tdAction);

            // Appends buttons
            buttonsWrapper.appendChild(updateButton);
            buttonsWrapper.appendChild(deleteButton);
            tdAction.appendChild(buttonsWrapper);

        });
    })

    // Get all interest to selected loan and populate interest table
    window.api.getLoanInterest(loan.id);
    window.api.sendInterest((interests) => {
        interests.forEach(interest => {
            const tr = document.createElement("tr");
            const tdDate = document.createElement("td");
            tdDate.textContent = interest.renewal;
            const tdAmount = document.createElement("td");
            tdAmount.textContent = interest.quantity;
            const tdAction = document.createElement("td");
            // Buttons
            const deleteButton = document.createElement("button");
            const updateButton = document.createElement("button");
            // Buttons wrapper
            const buttonsWrapper = document.createElement('div');
            buttonsWrapper.classList.add('btn-group');

            // Delete button
            deleteButton.value = interest.id;
            deleteButton.textContent = `Delete id = ${interest.id}`;
            deleteButton.classList.add('btn', 'btn-danger')
            // Delete button action
            deleteButton.addEventListener('click', () => {
                const userConfirmed = confirm('Are you sure you want to delete the interest');
                if (userConfirmed) {
                    // Delete interest
                    window.database.deleteInterest(interest.id);
                    // Refresh page
                    window.api.getLoanDetails(loan.id);
                }
            });
            // Update button
            updateButton.value = interest.id;
            updateButton.textContent = `Update id = ${interest.id}`;
            updateButton.classList.add('btn', 'btn-info')
            // Update button action
            updateButton.addEventListener('click', () => {
                console.log(`clicked update button with id = ${interest.id}`);
                window.api.openInterestDetails(interest.id);
            });

            // Appends to interest table
            interestTableBody.appendChild(tr);
            tr.appendChild(tdDate);
            tr.appendChild(tdAmount);
            tr.appendChild(tdAction);

            // Appends buttons
            buttonsWrapper.appendChild(updateButton);
            buttonsWrapper.appendChild(deleteButton);
            tdAction.appendChild(buttonsWrapper);
        });
    })

    newPaymentButton.addEventListener('click', () => {
        paymentDialog.showModal();
        
    });

    newInterestButton.addEventListener('click', () => {
        interestDialog.showModal();
    });

    paymentCancelButton.addEventListener('click', () => {
        paymentDialog.close();
        
    });

    interestCancelButton.addEventListener('click', () => {
        interestDialog.close();
        
    });

    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const paymentDate = document.querySelector('#payment-date');
        const paymentAmount = document.querySelector('#payment-amount');
        const paymentData = {
            loan_id: loan.id,
            payment_amount: paymentAmount.value,
            payment_date: paymentDate.value
        }
        console.log(paymentData);
        window.database.createPayment(paymentData);
        // After the info is updated, redirect to loans-details view
        window.api.getLoanDetails(loan.id);
    })

    interestForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const interestDate = document.querySelector('#interest-date');
        const interestAmount = document.querySelector('#interest-amount');
        const interestData = {
            loan_id: loan.id,
            interest_amount: interestAmount.value,
            interest_date: interestDate.value
        }
        console.log(interestData);
        window.database.createInterest(interestData);
        // After the info is updated, redirect to loans-details view
        window.api.getLoanDetails(loan.id);
    })
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