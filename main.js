const { app, BrowserWindow } = require('electron/main')
const { ipcMain } = require('electron')
const path = require('node:path')
const sqlite3 = require('sqlite3').verbose()
const migrations = require('./database/migration')

// Create window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('views/index.html')

    const wc= win.webContents
    wc.openDevTools()
}

// Loads borrowers view into the actual window
ipcMain.on('open-borrower-window', (event) => {
    const win = BrowserWindow.getFocusedWindow()
    win.loadFile('./views/borrowers.html')
})

// Loads borrower-form to handle borrower creation into the actual window
ipcMain.on('open-borrower-form', (event) => {
    const win = BrowserWindow.getFocusedWindow()
    win.loadFile('./views/borrower-form.html')
})

// Shows details for selected borrower
ipcMain.on('open-borrower-details', (event, id) => {
    getBorrower(id);
})

// Create Borrower
ipcMain.on('create-borrower', (event, args) => {
    createBorrower(args);
})

// Delete Borrower
ipcMain.on('delete-borrower', (event, id) => {
    deleteBorrower(id);
})

// Update Borrower
ipcMain.on('update-borrower', (event, data) => {
    updateBorrower(data);
})

// Get data from all borrowers
ipcMain.on('get-all-borrowers', (event) => {
    getAllBorrowers();
})

ipcMain.on('open-loan-window', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('./views/loans.html');
})

ipcMain.on('open-loan-form', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('./views/loan-form.html');
})

ipcMain.on('create-loan', (event, data) => {
    createLoan(data);
})

ipcMain.on('get-loans', (event, id) => {
    getLoans(id)
})

ipcMain.on('get-loan-details', (event, id) => {
    getLoanDetails(id)
})

ipcMain.on('create-payment', (event, data) => {
    createPayment(data);
})

ipcMain.on('create-interest', (event, data) => {
    createInterest(data)
})

ipcMain.on('get-loan-payment', (event, id) => {
    getLoanPayment(id);
})

ipcMain.on('get-loan-interest', (event, id) => {
    getLoanInterest(id);
})

// Create database connection
const database = new sqlite3.Database('./test.sqlite3', (err) => {
    if (err) {
        console.error('Database opening error: ', err);
    }
    console.log('Connected to SQLite3 database');
    database.serialize(() => {
        database.run(migrations.lender);
        console.log('lender table created successful');

        database.run(migrations.borrower);
        console.log('borrower table created successful');

        database.run(migrations.loan);
        console.log('loan table created successful');

        database.run(migrations.payment);
        console.log('payment table created successful');

        database.run(migrations.interest);
        console.log('interest table created successful');
    })
    // database.close((err) => {
    //     if (err == null) {
    //         console.log(`Database closed successfuly`);
            
    //     } else {
    //         console.log(`Error ${err.message}`);
            
    //     }
    // })
})

const createBorrower = (args) => {
    // Get time in ISO format
    const timestamp = new Date().toISOString();
    // Add timestamp to args array for created_at
    args.push(timestamp);
    // Add timestamp to args array for updated_at
    args.push(timestamp);
    
    const sql = `INSERT INTO borrower (name, last_name, ine, created_at, updated_at) VALUES (?,?,?,?,?)`;
    console.log(args);
    
    database.run(sql, args, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`New borrower with id = ${this.lastID} created successful`);
    })
}

const deleteBorrower = (id) => {
    const query = `DELETE FROM borrower WHERE id = ?`;
    database.run(query, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected ${this.changes}`);
            console.log(`borrower id = ${id} deleted successfuly`);
        } else {
            console.log(`Borrower with id = ${id} not found`);
        }
    })
}

const updateBorrower = (data) => {
    // updated_at timestamp 
    const timestamp = new Date().toISOString();
    // Add timestamp to data object
    data.updated_at = timestamp;    
    
    const query = `UPDATE borrower SET name = ?, last_name = ?, ine = ?, updated_at = ? WHERE id = ?`;
    // Create array with object "data"
    const params = [
        data.name,
        data.last_name,
        data.ine,
        data.updated_at,
        data.id
    ]
    
    database.run(query, params, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected = ${this.changes}`);
            console.log(`Borrower with id = ${data.id} updated`);
        } else {
            console.log(`Borrower with id = ${data.id} not found`);
        }

    })
    
}

const getBorrower = (id) =>{
    const win = BrowserWindow.getFocusedWindow();
    query = `SELECT * FROM borrower WHERE id = ?`;
    database.get(query, id, function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Query to get borrower with id = ${row.id} successfully`);
        
        // Load borrowers-detail view and send selected borrower details
        win.loadFile('./views/borrower-details.html').then(() => {
            win.webContents.send('send-borrower-details', row);
        })
    })
    
}

const getAllBorrowers = () => {
    const win = BrowserWindow.getFocusedWindow();

    database.all("SELECT * FROM borrower", function(err, row) {
        // console.log(row);
        if (err) {
            return console.error(err.message);
        }
        // Send all borrowers details
        win.webContents.send('send-all-borrowers', row);
    })
    
}

const createLoan = (data) => {
    console.log(data);
    // For development only
    const lenderId = '1'; 
    const args = [
        lenderId,
        data.borrower_id,
        data.initial_quantity,
        data.initial_quantity,
        data.start_loan_date
    ];

    console.log(args);
    
    const query = `INSERT INTO loan (lender_id, borrower_id, initial_quantity, remaining_quantity, start_date) VALUES (?,?,?,?,?)`;

    database.run(query, args, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`New loan with id = ${this.lastID} created successful`);
    })

}

const getLoans = (id) => {
    query = `SELECT * FROM loan WHERE borrower_id = ?`;
    win = BrowserWindow.getFocusedWindow();
    database.all(query, id, function(err, rows) {
        if (err) {
            return console.error(err.message);
        }
        // Send all loans details
        win.webContents.send('send-loans', rows);
    })
}

const getLoanDetails = (id) => {
    const win = BrowserWindow.getFocusedWindow();
    query = `SELECT * FROM loan WHERE id = ?`;
    database.get(query, id, function(err, row) {
        if (err) {
            console.error(err.message);
        }
        console.log(row);
        
        win.loadFile('./views/loan-details.html').then(() => {
            win.webContents.send('send-loan-details', row);
        })
    });
}

const createPayment = (data) => {
    console.log(data)
    const args = [
        data.loan_id,
        data.payment_amount,
        data.payment_date
    ];
    query = `INSERT INTO payment (loan_id, quantity, payment_date) VALUES (?,?,?)`;
    database.run(query, args, function(err) {
        if (err) {
            console.error(err.message);
        }
        console.log(`Payment successful with id = ${this.lastID}`)
    });
}

const createInterest = (data) => {
    console.log(data);
    const args = [
        data.loan_id,
        data.interest_amount,
        data.interest_date
    ];
    query = `INSERT INTO interest (loan_id, quantity, renewal) VALUES (?,?,?)`;
    database.run(query, args, function(err) {
        if (err) {
            console.error(err.message);
        }
        console.log(`Interest successful with id = ${this.lastID}`)
    });
}

const getLoanPayment = (id) => {
    query = `SELECT * FROM payment where loan_id = ? ORDER BY payment_date ASC`;
    database.all(query, id, function(err, rows) {
        if (err) {
            return console.error(err.message);
        }
        // Send all loans details
        win.webContents.send('send-payment', rows);
    })
}

const getLoanInterest = (id) => {
    query = `SELECT * FROM interest where loan_id = ? ORDER BY renewal ASC`;
    database.all(query, id, function(err, rows) {
        if (err) {
            return console.error(err.message);
        }
        // Send all loans details
        win.webContents.send('send-interest', rows);
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})