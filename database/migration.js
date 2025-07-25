// This file is used to generate the database structure

// LENDER
const lender = 
`
CREATE TABLE IF NOT EXISTS lender (
    id integer NOT NULL PRIMARY KEY,
    name varchar(500) NOT NULL
);
`;

// PAYMENT
const payment = 
`
CREATE TABLE IF NOT EXISTS payment (
    id integer NOT NULL PRIMARY KEY,
    loan_id integer NOT NULL,
    quantity decimal(10,2) NOT NULL,
    payment_date date NOT NULL,
    FOREIGN KEY (loan_id)
        REFERENCES loan (id)
);
`;

// BORROWER
const borrower = 
`
CREATE TABLE IF NOT EXISTS borrower (
    id integer NOT NULL PRIMARY KEY,
    name varchar(500) NOT NULL,
    last_name varchar(500),
    ine varchar(500) UNIQUE,
    created_at date NOT NULL,
    updated_at date NOT NULL
);
`;

// INTEREST
const interest = 
`
CREATE TABLE IF NOT EXISTS interest (
    id integer NOT NULL PRIMARY KEY,
    loan_id integer NOT NULL,
    quantity decimal(10,2) NOT NULL,
    renewal date NOT NULL,
    FOREIGN KEY (loan_id)
        REFERENCES loan (id)
);
`;

// LOAN
const loan = 
`
CREATE TABLE IF NOT EXISTS loan (
    id integer NOT NULL PRIMARY KEY,
    lender_id integer NOT NULL,
    borrower_id integer NOT NULL,
    initial_quantity decimal(10,2) NOT NULL,
    start_date date NOT NULL,
    finish_date date,
    FOREIGN KEY (lender_id)
        REFERENCES lender (id),
    FOREIGN KEY (borrower_id)
        REFERENCES borrower (id)
);
`;

const kyc = 
`
CREATE TABLE IF NOT EXISTS kyc (
    id integer NOT NULL PRIMARY KEY,
    loan_id integer NOT NULL,
    title varchar(500),
    type varchar(30),
    uuid varchar(50),
    file_location varchat(255),
    FOREIGN KEY (loan_id)
        REFERENCES loan (id)
);
`;

// Exports the variables necesaries to create the database structure to main proccess
module.exports = { lender, payment, borrower, interest, loan, kyc }