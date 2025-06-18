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
    // "Loan" id
    const loanId = document.querySelector('#loan-id');
    loanId.textContent = loan.id;
    // "Loan" amount
    const loanAmount = document.querySelector('#loan-amount');
    loanAmount.textContent = loan.remaining_quantity;
    // "Loan" start date
    const loanStartDate = document.querySelector('#loan-start-date');
    loanStartDate.textContent = loan.start_date;

    // Get all payments to selected loan
    window.api.getLoanPayment(loan.id);

    window.api.sendPayment((payments) => {
        payments.forEach(payment => {
            console.log(payment);
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
            // Update button
            updateButton.value = payment.id;
            updateButton.textContent = `Update id = ${payment.id}`;

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

    // Get all interest to selected loan
    window.api.getLoanInterest(loan.id);

    window.api.sendInterest((interests) => {
        interests.forEach(interest => {
            console.log(interest);
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
            // Update button
            updateButton.value = interest.id;
            updateButton.textContent = `Update id = ${interest.id}`;

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
    })
})