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
    // "Loan" id label
    const loanId = document.querySelector('#loan-id');
    loanId.textContent = loan.id;
    // "Loan" amount label
    const loanAmount = document.querySelector('#loan-amount');
    // "Loan" start date label
    const loanStartDate = document.querySelector('#loan-start-date');
    loanStartDate.textContent = loan.start_date;


    async function combinedChart() {
        /**
         * @type {Array<Transaction>} chartData
         */
        const chartData = await window.api.getChartData(loan.id);
        console.log(chartData);
        
        
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
                }
            }
        )
    }combinedChart();
    // USES SEND ON IPCRENDERER
    // window.api.getChartData(loan.id);

    // Get the loan total amount after adding the interest and subtracting payments
    window.api.getLoanTotalAmount(loan.id);
    window.api.sendLoanTotalAmount((loanTotalAmount) => {
        loanAmount.textContent = loanTotalAmount.total_loan;
    })

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

            // Delete button
            deleteButton.value = payment.id;
            deleteButton.textContent = `Delete id = ${payment.id}`;
            // Delete button action
            deleteButton.addEventListener('click', () => {
                console.log(`clicked delete button with id = ${payment.id}`);
                window.database.deletePayment(payment.id);
                window.api.getLoanDetails(loan.id);
            });
            // Update button
            updateButton.value = payment.id;
            updateButton.textContent = `Update id = ${payment.id}`;
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
            tdAction.appendChild(deleteButton);
            tdAction.appendChild(updateButton);

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

            // Delete button
            deleteButton.value = interest.id;
            deleteButton.textContent = `Delete id = ${interest.id}`;
            // Delete button action
            deleteButton.addEventListener('click', () => {
                console.log(`clicked delete button with id = ${interest.id}`);
                window.database.deleteInterest(interest.id);
                window.api.getLoanDetails(loan.id);
                
            });
            // Update button
            updateButton.value = interest.id;
            updateButton.textContent = `Update id = ${interest.id}`;
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
            tdAction.appendChild(deleteButton);
            tdAction.appendChild(updateButton);

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