const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for frontend integration
app.use(cors());
// Enable parsing of JSON request bodies
app.use(express.json());

// Database connection configuration configuration pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Default Laragon MySQL password is empty
    database: 'utm_employee_db', // Ensure this matches your database schema name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. READ ALL WITH SEARCH & SORT: Fetch records with server-side filters
app.get('/employees', async (req, res) => {
    try {
        const { q, sortBy, order } = req.query;
        let sql = 'SELECT * FROM employees WHERE 1=1';
        let params = [];

        // Dynamic Server-side Search using SQL LIKE keyword syntax across 3 columns
        if (q) {
            sql += ' AND (name LIKE ? OR empId LIKE ? OR email LIKE ?)';
            const searchStr = `%${q}%`;
            params.push(searchStr, searchStr, searchStr);
        }

        // Security Sorting Column whitelist verification array setup matrix
        const allowedColumns = ['name', 'hireDate', 'salary'];
        const allowedOrder = ['ASC', 'DESC'];

        if (sortBy && allowedColumns.includes(sortBy)) {
            const sortOrder = (order && allowedOrder.includes(order.toUpperCase())) ? order.toUpperCase() : 'ASC';
            sql += ` ORDER BY ${sortBy} ${sortOrder}`; 
        }

        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: Insert and record a new employee into database
app.post('/employees', async (req, res) => {
    const { empId, name, email, department, position, hireDate, salary, active } = req.body;
    try {
        const sql = 'INSERT INTO employees (empId, name, email, department, position, hireDate, salary, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(sql, [empId, name, email, department, position, hireDate, salary, active ? 1 : 0]);
        res.status(201).json({ message: 'Employee added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE: Remove an employee record safely by primary key ID
app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM employees WHERE id = ?';
        await pool.query(sql, [id]);
        res.json({ message: 'Employee deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 💡 Centralized Server listening port declaration
const PORT = 3001; 

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});