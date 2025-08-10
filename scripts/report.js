/**
 * @typedef {object} Loan
 * @property {number} id - The unique identifier for the loan
 * @property {number} lender_id - The unique identifier for the lender
 * @property {number} borrower_id - The unique identifier for the borrower
 * @property {number} initial_quantity - The initial amount of the loan
 * @property {date} start_date - The date when the loan was created
 * @property {date} finish_date - The date when the loan was finished
 */

window.api.sendPrintDetails((loan) => {
    // HTML Document elements
    const name = document.querySelector('#name');
    const ine = document.querySelector('#ine');
    const startLoanDate = document.querySelector('#start-loan-date');
    const startDate = new Date(loan.start_date);
    const startDateString = startDate.toDateString();
    startLoanDate.innerHTML = [
        '<strong>Fecha de inicio del prestamo:</strong>',
        `<div>${startDateString}</div>`
    ].join('');
    // The date when the report is being generated
    const generateLoanDate = document.querySelector('#generate-loan-date');
    // Get time in ISO format
    const timestamp = new Date();
    const timestampString = timestamp.toDateString();
    generateLoanDate.innerHTML = [
        '<strong>Fecha de generacion del reporte:</strong>',
        `<div>${timestampString}</div>`
    ].join('');
    const initialAmount = document.querySelector('#initial-amount');
    initialAmount.innerHTML = [
        '<strong>Cantidad Inicial</strong> ',
        `$${loan.initial_quantity}`
    ].join('');
    const remainingAmount = document.querySelector('#remaining-amount');

    // Get borrower info
    async function getBorrowerDetails() {
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
        // Borrower name
        name.innerHTML = [
            '<strong>Nombre:</strong> ',
            `${borrowerName.data.name} ${borrowerName.data.last_name}`
        ].join('');
        // Borrower INE
        if (borrowerName.data.ine === null) {
            ine.innerHTML = [
                '<strong>INE:</strong> ',
                `No registrada`
            ].join('');
        } else {
            ine.innerHTML = [
                '<strong>INE:</strong> ',
                `${borrowerName.data.ine}`
            ].join('');
        }
        
        // "Loan" amount label
        remainingAmount.innerHTML = [
            '<strong>Cantidad Restante:</strong> ',
            `$${loanAmountData.data.total_loan}`
        ].join('');
    }getBorrowerDetails();

    // Get all payments to selected loan and populate payment table
    const paymentTableBody = document.querySelector('#payment-table-body');
    window.api.getLoanPayment(loan.id);
    window.api.sendPayment((payments) => {
        const totalPaymentAmountLabel = document.querySelector('#total-payment-amount');
        let totalPaymentAmount = 0;
        payments.forEach(payment => {
            const tr = document.createElement("tr");
            const tdDate = document.createElement("td");
            tdDate.textContent = payment.payment_date;
            const tdAmount = document.createElement("td");
            tdAmount.textContent = `$${payment.quantity}`;

            // Sum
            totalPaymentAmount += payment.quantity;

            // Appends to payment table
            paymentTableBody.appendChild(tr);
            tr.appendChild(tdDate);
            tr.appendChild(tdAmount);
        });
        totalPaymentAmountLabel.innerHTML = [
            '<strong>Total:</strong> ',
            `$${totalPaymentAmount}`
        ].join('');
    })

    // Get all interest to selected loan and populate interest table
    const interestTableBody = document.querySelector('#interest-table-body');
    window.api.getLoanInterest(loan.id);
    window.api.sendInterest((interests) => {
        const totalInterestAmountLabel = document.querySelector('#total-interest-amount');
        let totalInterestAmount = 0;
        interests.forEach(interest => {
            const tr = document.createElement("tr");
            const tdDate = document.createElement("td");
            tdDate.textContent = interest.renewal;
            const tdAmount = document.createElement("td");
            tdAmount.textContent = `$${interest.quantity}`;

            // Sum
            totalInterestAmount += interest.quantity;

            // Appends to interest table
            interestTableBody.appendChild(tr);
            tr.appendChild(tdDate);
            tr.appendChild(tdAmount);
        });
        totalInterestAmountLabel.innerHTML = [
            '<strong>Total:</strong> ',
            `$${totalInterestAmount}`
        ].join('');
    })

    // Print button
    const printButton = document.querySelector('#print-button');
    printButton.addEventListener('click', () => {
        window.api.finishedLoadingToPrint();
    })
    console.log(printButton);
    
})