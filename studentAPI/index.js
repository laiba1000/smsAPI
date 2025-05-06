const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(reg,res)=>{
    try{
        res.json('WELCOME TO STUDENT API');
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('gettotalstd',async(reg,res)=>{
    try{
        const result = await pool.query('select count(ID) from student');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/students',async(reg,res)=>{
    try{
        const result = await pool.query('select * from student');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

app.get('/job-history-details', async (req, res) => {
    try {
        const result = await pool.query(`
             jh.*, e.first_name, e.last_name, j.job_title, c.country_name
            from job_history jh
            join employees e on jh.employee_id = e.employee_id
            join jobs j on jh.job_id = j.job_id
            join departments d on jh.department_id = d.department_id
            join locations l on d.location_id = l.location_id
            join countries c on l.country_id = c.country_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/reg-count-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select r.region_name, c.country_name, l.city
            from regions r
            join countries c on r.region_id = c.region_id
            join locations l on c.country_id = l.country_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/count-reg-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select c.country_name, r.region_name, l.city
            from countries c
            join regions r ON c.region_id = r.region_id
            join locations l ON c.country_id = l.country_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/loc-count-reg', async (req, res) => {
    try {
        const result = await pool.query(`
            select l.city, c.country_name, r.region_name
            from locations l
            join countries c ON l.country_id = c.country_id
            join regions r ON c.region_id = r.region_id;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/dept-emp-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select d.department_name, e.first_name, e.last_name, l.city
            from departments d
            join employees e ON d.department_id = e.department_id
            join locations l ON d.location_id = l.location_id limit 5; `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-dept-location-count', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name, d.department_name, l.city, c.country_name
            from employees e
            join departments d ON e.department_id = d.department_id
            join locations l ON d.location_id = l.location_id
            join countries c ON l.country_id = c.country_id limit 5; `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-managers-dept-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name, m.first_name AS manag_firstN, m.last_name AS manag_lastN,
                   d.department_name, l.city
            from employees e
            join employees m ON e.manager_id = m.employee_id
            join departments d ON e.department_id = d.department_id
            join locations l ON d.location_id = l.location_id limit 5;
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-jobs-dept-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name, j.job_title, d.department_name, l.city
            from employees e
            join jobs j ON e.job_id = j.job_id
            join departments d ON e.department_id = d.department_id
            join locations l ON d.location_id = l.location_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-jobs-dept-managers', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name, j.job_title, d.department_name,
                   m.first_name AS manager_first, m.last_name AS manager_last
            from employees e
            join jobs j ON e.job_id = j.job_id
            join departments d ON e.department_id = d.department_id
            join employees m ON e.manager_id = m.employee_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-jobs-dept-managers-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name, j.job_title, d.department_name,
                   m.first_name AS manager_first, m.last_name AS manager_last, l.city
            from employees e
            join jobs j ON e.job_id = j.job_id
            join departments d ON e.department_id = d.department_id
            join employees m ON e.manager_id = m.employee_id
            join locations l ON d.location_id = l.location_id limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/cont-in-reg1', async (req, res) => {
    try {
        const result = await pool.query(`
            select country_name
            from countries
            where region_id = 1 limit 5; `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/dept-city-starts-with-n', async (req, res) => {
    try {
        const result = await pool.query(`
            select d.department_name
            from departments d
            join locations l ON d.location_id = l.location_id
            where lower(l.city) like 'n%'; `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/emp-managed-high-commission', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name
            from employees e
            where e.department_id IN (
                select d.department_id
                from departments d
                join employees m ON d.manager_id = m.employee_id
                where m.commission_pct > 0.15);`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

app.get('/manager-job-titles', async (req, res) => {
    try {
        const result = await pool.query(`
            select distinct j.job_title
            from employees e
            join jobs j on e.job_id = j.job_id
            where e.employee_id in (select distinct manager_id from employees where manager_id is not null);
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/post-code-reg-asia', async (req, res) => {
    try {
        const result = await pool.query(`
            select l.postal_code
            from locations l
            join countries c on l.country_id = c.country_id
            join regions r on c.region_id = r.region_id
            where lower(r.region_name) = 'asia';`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/dept-below-avg-commission', async (req, res) => {
    try {
        const result = await pool.query(`
            select distinct d.department_name
            from departments d
            join employees e on d.department_id = e.department_id
            where e.commission_pct < (select avg(commission_pct) from employees where commission_pct is not null);
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/job-titles-above-dept-avg', async (req, res) => {
    try {
        const result = await pool.query(`
            select distinct j.job_title
            from employees e
            join jobs j on e.job_id = j.job_id
            where e.salary > (
                select avg(e2.salary)
                from employees e2
                where e2.department_id = e.department_id);`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-no-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            select employee_id
            from employees
            where department_id is null;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-multiple-jobs', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name, e.last_name
            from employees e
            where e.employee_id in (
                select employee_id
                from job_history
                group by employee_id
                having count(job_id) > 1);`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-count-by-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            select department_id, count(*) as employee_count
            from employees
            group by department_id;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/total-salary-by-job', async (req, res) => {
    try {
        const result = await pool.query(`
            select j.job_title, sum(e.salary) as total_salary
            from employees e
            join jobs j on e.job_id = j.job_id
            group by j.job_title;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/avg-commission-by-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            select department_id, avg(commission_pct) as avg_commission
            from employees
            group by department_id;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/max-salary-by-cont', async (req, res) => {
    try {
        const result = await pool.query(`
            select c.country_name, max(e.salary) as max_salary
            from employees e
            join departments d on e.department_id = d.department_id
            join locations l on d.location_id = l.location_id
            join countries c on l.country_id = c.country_id
            group by c.country_name limit 5;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/jobs-between-1993-1997', async (req, res) => {
    try {
        const result = await pool.query(`
            select j.job_title, d.department_name, e.first_name || ' ' || e.last_name as full_name,
                   jh.start_date, jh.end_date
            from job_history jh
            join employees e on jh.employee_id = e.employee_id
            join jobs j on jh.job_id = j.job_id
            join departments d on jh.department_id = d.department_id
            where jh.start_date >= '1993-01-01' and jh.end_date <= '1997-08-31';`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/cont-cities-dept-count', async (req, res) => {
    try {
        const result = await pool.query(`
            select c.country_name, l.city, count(distinct d.department_id) as department_count
            from employees e
            join departments d on e.department_id = d.department_id
            join locations l on d.location_id = l.location_id
            join countries c on l.country_id = c.country_id
            group by c.country_name, l.city
            having count(e.employee_id) >= 2;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-no-commission-history', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name || ' ' || e.last_name as full_name, j.job_title, jh.start_date, jh.end_date
            from job_history jh
            join employees e on jh.employee_id = e.employee_id
            join jobs j on jh.job_id = j.job_id
            where e.commission_pct is null;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-cont-loc', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.employee_id, e.first_name || ' ' || e.last_name as full_name, c.country_name
            from employees e
            join departments d on e.department_id = d.department_id
            join locations l on d.location_id = l.location_id
            join countries c on l.country_id = c.country_id;`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-min-salary-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name || ' ' || e.last_name as full_name, e.salary, e.department_id
            from employees e
            where e.salary in (
                select min(salary)
                from employees
                group by department_id
            );
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-third-highest-salary', async (req, res) => {
    try {
        const result = await pool.query(`
            select *
            from employees
            where salary = (
                select distinct salary
                from employees
                order by salary desc
                offset 2 limit 1);`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/above-avg-salary-j-name-dept', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.employee_id, e.first_name || ' ' || e.last_name as full_name, e.salary
            from employees e
            where e.salary > (select avg(salary) from employees)
            and e.department_id in (
                select distinct e2.department_id
                from employees e2
                where lower(e2.first_name) like '%j%' or lower(e2.last_name) like '%j%');`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/emp-in-toronto', async (req, res) => {
    try {
        const result = await pool.query(`
            select e.first_name || ' ' || e.last_name as full_name, e.employee_id, j.job_title
            from employees e
            join jobs j on e.job_id = j.job_id
            join departments d on e.department_id = d.department_id
            join locations l on d.location_id = l.location_id
            where lower(l.city) = 'toronto';`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log('Connected Succesfully....Running on PORT ${PORT}');
});