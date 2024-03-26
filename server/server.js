import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import {pool} from './configure.js'
import * as q from "./query.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/login.html'))
});

app.get('/dashboard',(req, res)=>{
    res.sendFile(path.join(__dirname, '../client/dashboard.html'))
})

app.get('/dashboard/transactions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM transactions');
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
});

    app.post('/', async (req, res) => {
        const { username, password } = req.body;

        console.log(req.body);
        console.log(password)
        try {
            const user = await q.getUserByUsername(username);
            console.log(user)
            if (!user) {
                return res.status(400).send('Invalid username or password.');
            }
            const pass= await bcrypt.compare(password, user.password)
            if(pass) console.log("hashed passwords match")
            if (pass) {
                console.log("matched")
                res.redirect('/dashboard');
            } else {
                res.status(400).send('Invalid username or password.');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred.');
        }
    });

app.post('/dashboard/deposit', async (req, res)=>{
    const {username, amount}= req.body;
    console.log(req.body)
    try{
        await q.deposit(username, amount)
        res.redirect('/dashboard')
    }
    catch (err){
        console.log(err);
        res.status(500)
    }
})

app.post('/dashboard/withdraw', async (req, res)=>{
    const {username, amount}= req.body;
    console.log(req.body)
    try{
        await q.withdraw(username, amount)
        res.redirect('/dashboard')
    }
    catch (err){
        console.log(err);
        res.status(500)
    }
})

app.post('/dashboard/transfer', async (req, res)=>{
    const {username1,username2,amount}= req.body
    console.log(req.body)
    try{
            await q.transfer(username1, username2, amount)
            res.redirect('/dashboard')
    }
    catch (err){
        console.log(err)
        res.status(500)
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});