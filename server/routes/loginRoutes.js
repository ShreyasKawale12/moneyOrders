import express from "express";
import path from "path";
import * as q from "../sqlQueries/query.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dirname } from'path';
import { fileURLToPath } from 'url';
import {runBcrypt} from '../bcrypt.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/login.html'))
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username)
    try {
        const user = await q.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }
        const pass = await bcrypt.compare(password, user.password);
        if (pass) {
            console.log('credentials matched')
            const token= jwt.sign({username: user.username}, 'shrimps')
            res.status(200).json({username:user.username, designation: user.designation, token: token})
        } else {
            res.status(400).json({ message: 'Invalid username or password.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred.' });
    }
});

router.get('/dashboard/signup',async (req,res)=>{
    console.log('on the signup page')
    res.sendFile(path.join(__dirname, '../../client/signup.html'))
})

router.post('/dashboard/signup', async (req, res)=>{
    let {username, password}= req.body
    console.log(username)
    const hashedPassword = await runBcrypt(password)
    await q.createNewUser(username, hashedPassword)
    res.status(200).send()
})
export default router