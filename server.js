const e = require('express');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sqlite3 = require('sqlite3').verbose();
//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connects to db
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the election database.');
});

//begin routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Jungle'
    });
});

//returns all rows from selected table
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


//returns a single candidate from db
// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ error: res.message });
            return;
        }
        res.json({
            message: 'Candidate successfully deleted',
            changes: this.changes
        });
    });
});


// //Create a candidate
// const sql= `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 Values (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 to be able to use this!!
// db.run(sql, params, function(err,result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// });

//similar to the get'*'
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});