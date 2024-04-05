import express from "express";
import path from "path";
import {pool} from "../configure.js";
import * as q from "../sqlQueries/query.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {verifyTokenManager} from "./middleware.js";
import {io} from '../server.js'
import {aggregationQueries} from "../sqlQueries/aggregationQueries.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router= express.Router()

router.get('/dashboard', (req, res) => {
    // res.status(200).send()
    res.status(200).sendFile(path.join(__dirname, '../../client/dashboard.html'));
});

router.get('/dashboard/verify',verifyTokenManager,(req, res)=>{
    res.status(200).send()
})
// router.use

router.get('/dashboard/transactions',verifyTokenManager, async (req, res) => {
    try {
        const result = await q.fetchTransactions()
        res.status(200).send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching transactions' });
    }
});

router.post('/dashboard/deposit', async (req, res)=>{
    const {username, amount}= req.body;
    console.log(req.body)
    try{
        await q.deposit(username, amount)
        const result = await aggregationQueries();
        io.emit('message', result);
        res.status(200).send()

    }
    catch (err){
        console.log(err);
        res.status(500).send()
    }
})

router.post('/dashboard/withdraw', async (req, res)=>{
    const {username, amount}= req.body;
    console.log(req.body)
    try{
        await q.withdraw(username, amount)
        const result = await aggregationQueries();
        io.emit('message', result);
        res.status(200).send()
    }
    catch (err){
        console.log(err);
        res.status(500)
    }
})

router.post('/dashboard/transfer', async (req, res)=>{
    const {username1,username2,amount}= req.body
    console.log(req.body)
    try{
        await q.transfer(username1, username2, amount)
        const result = await aggregationQueries();
        io.emit('message', result);
        res.redirect('/dashboard')
    }
    catch (err){
        console.log(err)
        res.status(500)
    }
})

export default router