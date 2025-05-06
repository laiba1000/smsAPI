const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async(reg,res)=>{
    try{
        res.json('WELCOME TO STUDENT API')
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});
app.get('/students',async(reg,res)=>{
    try{
        const result = await pool.query('select * from student')
        res.json(result.rows);
    } catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('gettotalstd',async(reg,res)=>{
    try{
        const result = await pool.query('select count(ID) from student')
        res.json(result.rows);
    } catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/employeesintoronto', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, j.job_title
            FROM employees e
            JOIN jobs j ON e.job_id = j.job_id
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            WHERE l.city = 'Toronto'
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});



const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log('Connected Successfully.....Running on Port ${PORT}')
});
