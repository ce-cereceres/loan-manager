const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    openIndexWindow: () => ipcRenderer.send('open-index-window'),
    openBorrowerWindow: () => ipcRenderer.send('open-borrower-window'),
    openBorrowerForm: () => ipcRenderer.send('open-borrower-form'),
    openBorrowerDetails: (id) => ipcRenderer.send('open-borrower-details', id),
    openLoanWindow: () => ipcRenderer.send('open-loan-window'),
    openLoanForm: () => ipcRenderer.send('open-loan-form'),
    getLoans: (id) => ipcRenderer.invoke('get-loans', id),
    getLoanDetails: (id) => ipcRenderer.send('get-loan-details', id),
    getLoanPayment: (id) => ipcRenderer.send('get-loan-payment', id),
    getLoanTotalAmount: (id) => ipcRenderer.send('get-loan-total-amount', id),
    openPaymentDetails: (id) => ipcRenderer.send('open-payment-details', id),
    getLoanInterest: (id) => ipcRenderer.send('get-loan-interest', id),
    openInterestDetails: (id) => ipcRenderer.send('open-interest-details', id),
    getAllBorrowers: () => ipcRenderer.invoke('get-all-borrowers'),
    getChartData: (loan_id) => ipcRenderer.invoke('get-chart-data', loan_id),
    getAllProfits: () => ipcRenderer.invoke('get-all-profits'),
    getProfitByBorrower: () => ipcRenderer.invoke('get-profit-by-borrower'),
    getDocumentPath: () => ipcRenderer.invoke('get-document-path'),
    getLoanDocuments: (loan_id) => ipcRenderer.invoke('get-loan-documents', loan_id),
    openLoanDocument: (uuid) => ipcRenderer.invoke('open-loan-document', uuid),
    sendAllBorrowers: (callback) => ipcRenderer.on('send-all-borrowers', (event, args) => {
        callback(args);
    }),
    sendBorrowerDetails: (callback) => ipcRenderer.on('send-borrower-details', (event, borrower) => {
        callback(borrower);
    }),
    sendLoans: (callback) => ipcRenderer.on('send-loans', (event, loans) => {
        callback(loans);
    }),
    sendLoanTotalAmount: (callback) => ipcRenderer.on('send-loan-total-amount', (event, totalLoanAmount) => {
        callback(totalLoanAmount);
    }),
    sendLoanDetails: (callback) => ipcRenderer.on('send-loan-details', (event, loan) => {
        callback(loan);
    }),
    sendPayment: (callback) => ipcRenderer.on('send-payment', (event, payments) => {
        callback(payments);
    }),
    sendPaymentDetails: (callback) => ipcRenderer.on('send-payment-details', (event, payment) => {
        callback(payment);
    }),
    sendInterest: (callback) => ipcRenderer.on('send-interest', (event, interests) => {
        callback(interests);
    }),
    sendInterestDetails: (callback) => ipcRenderer.on('send-interest-details', (event, interest) => {
        callback(interest);
    })
    

})

contextBridge.exposeInMainWorld('database', {
    // Borrower
    createBorrower: (args) => ipcRenderer.invoke('create-borrower', args),
    deleteBorrower: (id) => ipcRenderer.send('delete-borrower', id),
    updateBorrower: (data) => ipcRenderer.invoke('update-borrower', data),
    // Loan
    createLoan: (data) => ipcRenderer.send('create-loan', data),
    // Payment
    createPayment: (data) => ipcRenderer.send('create-payment', data),
    deletePayment: (id) => ipcRenderer.send('delete-payment', id),
    updatePayment: (data) => ipcRenderer.send('update-payment', data),
    // Interest
    createInterest: (data) => ipcRenderer.send('create-interest', data),
    deleteInterest: (id) => ipcRenderer.send('delete-interest', id),
    updateInterest: (data) => ipcRenderer.send('update-interest', data),
    // Loan Document
    createDocument: (data) => ipcRenderer.invoke('create-document', data),
    deleteDocument: (id) => ipcRenderer.invoke('delete-document', id),
    deleteDocumentLocation: (uuid) => ipcRenderer.invoke('delete-document-location', uuid)
})