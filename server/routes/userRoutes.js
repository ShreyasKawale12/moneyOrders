import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import * as q from "../sqlQueries/query.js";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const router = express.Router()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/:username',(req, res)=>{
    const username = req.params.username
    res.sendFile(path.join(__dirname, '../../client/userPage.html'))
})

router.get('/:username/transactions', async (req, res)=>{
    const username= req.params.username
    try{
        const result= await q.getTransactionsByUsername(username)
        res.json(result)
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred.' });
    }
})

router.post('/:username/email-transactions', async (req, res) => {
    const { records, username, user, afterDate, beforeDate } = req.body;
    console.log(afterDate)
    const transactions= await q.getTransactionsForEmail(records, username, user, afterDate, beforeDate)
    let emailContent = 'Here are your transactions:\n\n';
    transactions.forEach((transaction, index) => {
        emailContent += `Transaction ${index + 1}:\n`;
        emailContent += `From: ${transaction.from_user}\n`;
        emailContent += `To: ${transaction.to_user}\n`;
        emailContent += `Amount: ${transaction.amount}\n\n`;
    });

    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true
    });

    let info = await transporter.sendMail({
        from: 'shreyaskawale7t@gmail.com',
        to: 'kawaleshreyas33@gmail.com',
        subject: 'Your Transaction History',
        text: emailContent,
    });

    console.log('Message sent: %s', info.messageId);

    res.status(200).send('Email sent successfully.');
});

export default router
