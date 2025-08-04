const { app, BrowserWindow } = require('electron/main')
const { ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const migrations = require('./database/migration')
const { v4: uuidv4 } = require('uuid')

// Create window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    win.loadFile('views/index.html')

    const wc= win.webContents
    wc.openDevTools()
}

// Opens the index view
ipcMain.on('open-index-window', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('./views/index.html');
})

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
ipcMain.handle('create-borrower', async (event, args) => {
    // Get time in ISO format
    const timestamp = new Date().toISOString();
    // Add timestamp to args array for created_at
    args.push(timestamp);
    // Add timestamp to args array for updated_at
    args.push(timestamp);
    
    const sql = `INSERT INTO borrower (name, last_name, ine, created_at, updated_at) VALUES (?,?,?,?,?)`;
    console.log(args);
    
    return new Promise((resolve) => {
        database.run(sql, args, function(err) {
            if (err) {
                resolve({success: false, message: `Error: ${err.message}`});
            }
            resolve({success: true, message: `New borrower with id = ${this.lastID} created successful`});
        });
    });
});

// Delete Borrower
ipcMain.on('delete-borrower', (event, id) => {
    deleteBorrower(id);
})

// Update Borrower
ipcMain.handle('update-borrower', async (event, data) => {
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

    return new Promise((resolve) => {
        database.run(query, params, function(err) {
            if (err) {
                resolve({success: false, message: `Error: ${err.message}`});
            }
            if (this.changes > 0) {
                resolve({success: true, message: `Row(s) affected = ${this.changes}. Borrower with id = ${data.id} updated`});
            } else {
                resolve({success: false, message: `Borrower with id = ${data.id} not found`});
            }
        });
    });
});

// Get data from all borrowers
ipcMain.handle('get-all-borrowers', async (event) => {
    return new Promise((resolve) => {
        database.all("SELECT * FROM borrower", function(err, rows) {
            if (err) {
                resolve({success: false, message: `Error ${err.message}`, data: null});
            }
            resolve({success: true, message:`successfully retrived all borrowers`, data: rows})
        });
    });
});

ipcMain.handle('get-borrower-name', async (event, borrower_id) => {
    query = 
    `
    SELECT
        *
    FROM
        borrower
    WHERE
        id = ?
    `;
    return new Promise((resolve) => {
        database.get(query, borrower_id, function(err, row) {
            if (err) {
                resolve({success: false, message: `Error ${err.message}`, data: null});
            } else {
                resolve({success: true, message: `Query successful`, data: row});
            }
        });
    });
});

ipcMain.on('open-loan-window', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('./views/loans.html');
})

ipcMain.on('open-loan-form', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    win.loadFile('./views/loan-form.html');
})

ipcMain.handle('create-loan', async (event, data) => {
    console.log(data);
    // For development only
    const lenderId = '1'; 
    const args = [
        lenderId,
        data.borrower_id,
        data.initial_quantity,
        data.start_loan_date
    ];
    console.log(args);
    const query = `INSERT INTO loan (lender_id, borrower_id, initial_quantity, start_date) VALUES (?,?,?,?)`;

    return new Promise((resolve) => {
        database.run(query, args, function(err) {
            if (err) {
                resolve({success: false, message: `Error: ${err.message}`});
            } else {
                resolve({success: true, message: `New loan with id = ${this.lastID} created successful`});
            }
        });
    });
});

ipcMain.handle('get-loans', async (event, id) => {
    query = `SELECT * FROM loan WHERE borrower_id = ?`;
    return new Promise((resolve) => {
        database.all(query, id, function(err, rows) {
            if (err) {
                resolve({success: false, message: `Error: ${err.message}`, data: null});
            }
            resolve({success: true, message: `Loans for borrower_id = ${id} successfully retrived`, data: rows})
        });
    });
});

ipcMain.on('get-loan-details', (event, id) => {
    getLoanDetails(id)
})

ipcMain.handle('get-loan-total-amount', (event, id) => {
    query = `WITH CTE_interest AS (
                SELECT
                    i.loan_id,
                    SUM(i.quantity) AS total_interest
                FROM
                    interest i 
                GROUP BY
                    i.loan_id
            ),
            CTE_payment AS (
                SELECT
                    p.loan_id,
                    SUM(p.quantity) AS total_payment
                FROM
                    payment p 
                GROUP BY
                    p.loan_id
            )
            SELECT
                l.id,
                l.initial_quantity
                + COALESCE(ci.total_interest, 0)
                - COALESCE(cp.total_payment, 0) AS total_loan
            FROM
                loan l 
            LEFT JOIN
                CTE_interest AS ci ON l.id = ci.loan_id
            LEFT JOIN
                CTE_payment AS cp ON l.id = cp.loan_id
            WHERE
                l.id = ?`;
    return new Promise((resolve) => {
        database.get(query, id, function(err, row) {
            if (err) {
                resolve({success: false, message: `Error: ${err.message}`, data: null});
                console.error(err.message);
            } else {
                resolve({success: true, message: `Query to get total amount successfully`, data: row});
            }
        });
    });
    
})

ipcMain.on('create-payment', (event, data) => {
    createPayment(data);
})

ipcMain.on('open-payment-details', (event, id) => {
    getPaymentDetails(id);
})

ipcMain.on('delete-payment', (event, id) => {
    deletePayment(id);
})

ipcMain.on('update-payment', (event, data) => {
    updatePayment(data);
})

ipcMain.on('create-interest', (event, data) => {
    createInterest(data);
})

ipcMain.on('open-interest-details', (event, id) => {
    getInterestDetails(id);
})

ipcMain.on('update-interest', (event, data) => {
    updateInterest(data);
})

ipcMain.on('delete-interest', (event, id) => {
    deleteInterest(id);
})

ipcMain.on('get-loan-payment', (event, id) => {
    getLoanPayment(id);
})

ipcMain.on('get-loan-interest', (event, id) => {
    getLoanInterest(id);
})

/**
 * @typedef {object} DocumentPath
 * @property {string} title - Title of the file
 * @property {string} path - Path to file location
 * @property {number} loan_id - The unique loan id
 */

/**
 * @param {DocumentPath} data
 */
ipcMain.handle('create-document', async (event, data) => {
    // Logic to create document
    console.log(data);

    // Ensures the path is not empty
    if (data.path === '') {
        return {success: false, message: 'The path is empty'};
    }

    // Get user-specific documents directory
    const userDocumentPath = app.getPath('documents');
    const appSpecificFolder = path.join(userDocumentPath, 'Loan Manager');
    const appFilesFilder = path.join(appSpecificFolder, 'Loan Documents');
    // Get the file name of the path
    const fileName = path.basename(data.path);
    
    try {
        // Ensures the app directory exists
        if (!fs.existsSync(appSpecificFolder)) {
            fs.mkdirSync(appSpecificFolder, { recursive: true });
        }
        if (!fs.existsSync(appFilesFilder)) {
            fs.mkdirSync(appFilesFilder);
        }

        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === 0) {
            return {success: false, message: `Error. File ${fileName} not valid`};
        }

        const fileExtension = fileName.slice(lastDotIndex + 1);
        const fileUuid = uuidv4();
        const destinationFileName = `${fileUuid}.${fileExtension}`;


        const destinationFilePath = path.join(appFilesFilder, destinationFileName);

        // Copy the file
        fs.copyFileSync(data.path, destinationFilePath);

        // Register the file in the database
        query = 
        `
        INSERT INTO kyc (loan_id, title, type, uuid) VALUES (?,?,?,?);
        `;
        args = [data.loan_id, data.title, fileExtension, destinationFileName];
        database.run(query, args, function(err) {
            if (err) {
                return {success: false, message: `Error: ${err.message}`};
            }
        });
        return {success: true, message: `File saved to: ${destinationFilePath}`};
        
    } catch (error) {
        return {success: false, message: `Error saving file: ${error.message}`}
    }

    
});

ipcMain.handle('get-loan-documents', async (event, loan_id) => {
    return new Promise((resolve, reject) => {
        query = 
        `
        SELECT 
        *
        FROM 
            kyc k
        WHERE 
            k.loan_id  = ?;
        `;
        database.all(query, loan_id, function (err, rows) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })
    })
    
});

ipcMain.handle('delete-document', async (event, id) => {
    return new Promise((resolve, reject) => {
        query = 
        `
        DELETE
        FROM
            kyc
        WHERE
            id = ?;
        `;
        database.run(query, id, function(err) {
            if (err) {
                resolve({success: false, message: err.message});
            }
            if (this.changes > 0) {
                resolve({success: true, message: `Row(s) affected ${this.changes}. Borrower id = ${id} deleted successfuly`});
            } else {
                resolve({success: false, message: `Borrower with id = ${id} not found`});
            }
        });
    });
});

ipcMain.handle('delete-document-location', async (event, uuid) => {
    // Get user-specific documents directory
    const userDocumentPath = app.getPath('documents');
    const appSpecificFolder = path.join(userDocumentPath, 'Loan Manager');
    const appFilesFilder = path.join(appSpecificFolder, 'Loan Documents');

    // File location
    const fileLocation = path.join(appFilesFilder, uuid);

    return new Promise((resolve, reject) => {
        // Delete file using its uuid
        fs.unlink(fileLocation, (err) => {
            if (err) {
                resolve({success: false, message: `Failed to delete file ${fileLocation}`});
            }
            resolve({success: true, message: `File ${fileLocation} deleted successfuly`});
        })
    });
});

ipcMain.handle('open-loan-document', async (event, uuid) => {
    const visualizerWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'Document',
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Get user-specific documents directory
    const userDocumentPath = app.getPath('documents');
    const appSpecificFolder = path.join(userDocumentPath, 'Loan Manager');
    const appFilesFilder = path.join(appSpecificFolder, 'Loan Documents');
    const file = path.join(appFilesFilder, uuid)

    console.log(file);

    return new Promise ((resolve, reject) => {
        // Opens the file
        visualizerWindow.loadFile(file)
            .then(() => {
                resolve({success: true, message: `Window opened successfully`});
            })
            .catch(err => {
                console.log(err);
                visualizerWindow.close();
                resolve({success: false, message: `File not found`});
            })

    })
    
    

    
});

ipcMain.handle('get-chart-data', async (event, loan_id) => {
    console.log(`using invoke ${loan_id}`);
    return new Promise((resolve, reject) => {
        query = 
        `
        WITH interest_CTE AS (
            SELECT 
                renewal,
                COALESCE(SUM(quantity), 0) AS total_interest,
                loan_id 
            FROM 
                interest
            WHERE
                loan_id = ?
            GROUP BY
                renewal
        ),
        payment_CTE AS (
            SELECT
                payment_date,
                COALESCE(SUM(quantity), 0) AS total_payment,
                loan_id
            FROM
                payment
            WHERE 
                loan_id = ?
            GROUP BY 
                payment_date
        ),
        transaction_summary AS (
            SELECT 
                COALESCE(p.payment_date, i.renewal) AS transaction_date,
                -- Get the loan_id for the final join
                COALESCE(p.loan_id, i.loan_id) AS loan_id,
                COALESCE(p.total_payment, 0) AS payment_final,
                COALESCE(i.total_interest, 0) AS interest_final,
                COALESCE(i.total_interest, 0) 
                - COALESCE(p.total_payment, 0) AS difference
            FROM 
                payment_CTE AS p
            FULL OUTER JOIN 
                interest_CTE AS i ON p.payment_date = i.renewal
        )
        SELECT 
            l.id,
            s.transaction_date,
            s.payment_final,
            s.interest_final,
            s.difference,
            l.initial_quantity
            + SUM(s.difference)
            OVER (ORDER BY s.transaction_date) AS current_loan_amount,
            SUM(s.interest_final) OVER (ORDER BY s.transaction_date) AS profit
        FROM 
            transaction_summary s
        JOIN 
            loan l ON s.loan_id = l.id
        ORDER BY
            s.transaction_date;
        `;
        
        database.all(query, [loan_id, loan_id], function(err, rows) {
            if (err) {
                reject(err)
            }
            resolve(rows)
        })
    })
});

ipcMain.handle('get-all-profits', async (event) => {
    return new Promise((resolve, reject) => {
        query = 
        `SELECT 
            SUM(i.quantity) AS total_interest
        FROM 
            interest i;`;
        database.get(query, function(err, row) {
            if (err) {
                reject(err);
            }
            resolve(row);
        })
    })
});

ipcMain.handle('get-profit-by-borrower', async (event) => {
    return new Promise((resolve, reject) => {
        query = 
        `SELECT 
            l.borrower_id,
            b.name || ' ' || b.last_name AS full_name,
            COALESCE(SUM(i.quantity), 0) AS profit
        FROM 
            interest i 
        LEFT JOIN 
            loan l ON l.id = i.loan_id
        LEFT JOIN 
            borrower b on l.borrower_id = b.id
        GROUP BY 
            l.borrower_id;`;
        database.all(query, function(err, rows) {
            if (err) {
                reject(err);
            }
            resolve(rows);
        })
    })
});

ipcMain.handle('get-document-path', async (event) => {
    const win = BrowserWindow.getFocusedWindow();
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [
            { name: 'File', extensions: ['png', 'jpg', 'jpeg', 'pdf']}
        ]
    })

    if (canceled || filePaths.length === 0) {
        return {success: false, message: 'file selection canceled', path: ''};
    }

    const documentPath = filePaths[0];
    
    return {success: true, message: `File selected at location ${documentPath}`, path: documentPath};
    
    
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

        database.run(migrations.kyc);
        console.log('KYC table created successfully');

        database.run(`INSERT INTO lender (name) VALUES ('Carlos')`)
    })
    // database.close((err) => {
    //     if (err == null) {
    //         console.log(`Database closed successfuly`);
            
    //     } else {
    //         console.log(`Error ${err.message}`);
            
    //     }
    // })
})

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

const getPaymentDetails = (id) => {
    const win = BrowserWindow.getFocusedWindow();
    query = `SELECT * FROM payment WHERE id = ?`;
    database.get(query, id, function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Query to get payment with id = ${row.id} successfully`);
        
        // Load borrowers-detail view and send selected borrower details
        win.loadFile('./views/payment-details.html').then(() => {
            win.webContents.send('send-payment-details', row);
        })
    })
}

const deletePayment = (id) => {
    console.log(id);
    
    const query = `DELETE FROM payment WHERE id = ?`;
    database.run(query, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected ${this.changes}`);
            console.log(`Payment id = ${id} deleted successfuly`);
        } else {
            console.log(`Payment with id = ${id} not found`);
        }
    })
}

const updatePayment = (data) => {
    console.log(data);
    const query = `UPDATE payment SET quantity = ?, payment_date = ? WHERE id = ?`;
    // Create array with object "data"
    const params = [
        data.quantity,
        data.payment_date,
        data.id,
    ]
    
    database.run(query, params, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected = ${this.changes}`);
            console.log(`Payment with id = ${data.id} updated`);
        } else {
            console.log(`Payment with id = ${data.id} not found`);
        }

    })
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

const getInterestDetails = (id) => {
    const win = BrowserWindow.getFocusedWindow();
    query = `SELECT * FROM interest WHERE id = ?`;
    database.get(query, id, function(err, row) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Query to get interest with id = ${row.id} successfully`);
        
        // Load borrowers-detail view and send selected borrower details
        win.loadFile('./views/interest-details.html').then(() => {
            win.webContents.send('send-interest-details', row);
        })
    })
}

const updateInterest = (data) => {
    console.log(data);
    
    const query = `UPDATE interest SET quantity = ?, renewal = ? WHERE id = ?`;
    // Create array with object "data"
    const params = [
        data.quantity,
        data.renewal,
        data.id,
    ]
    
    database.run(query, params, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected = ${this.changes}`);
            console.log(`Interest with id = ${data.id} updated`);
        } else {
            console.log(`Interest with id = ${data.id} not found`);
        }

    })
}

const deleteInterest = (id) => {
    console.log(id);
    
    const query = `DELETE FROM interest WHERE id = ?`;
    database.run(query, id, function(err) {
        if (err) {
            return console.error(err.message);
        }
        if (this.changes > 0) {
            console.log(`Row(s) affected ${this.changes}`);
            console.log(`Interest id = ${id} deleted successfuly`);
        } else {
            console.log(`Interest with id = ${id} not found`);
        }
    })
}

const getLoanPayment = (id) => {
    const win = BrowserWindow.getFocusedWindow();
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
    const win = BrowserWindow.getFocusedWindow();
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