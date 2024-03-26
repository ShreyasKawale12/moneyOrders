// queries.js
import { pool } from './configure.js';
import {query} from "express";

export async function getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log(result)
    return result.rows[0];
}
const deposit_query=
    `update users 
    set amount = amount + $1
    where username= $2`

const deposit_query_transactions= `
    insert into transactions
    values ('deposit',$1,null,$2)
`

const withdrawQuery= `
    update users
    set amount = amount - $1
    where username= $2
`

const withdrawQueryTransactions=`
    insert into transactions
    values('withdraw',$1,null,$2)
`
//
const transferQueryDoner= `
    update users
    set amount= amount - $2
    where username = $1
`

const transferQueryReciever= `
    update users
    set amount= amount + $2
    where username = $1
`

const transferQueryTransaction= `
    insert into transactions
    values('transfer',$1,$2,$3)
`
export async function deposit(username, amount){
    await pool.query(deposit_query, [amount, username])
    await pool.query(deposit_query_transactions,[username, amount])
}

export async function withdraw(username, amount){
    await pool.query(withdrawQuery,[amount, username])
    await pool.query(withdrawQueryTransactions, [username, amount])
}

export async function transfer(username1,username2,amount){
    await pool.query(transferQueryDoner,[username1,amount])
    await pool.query(transferQueryReciever,[username2,amount])
    await pool.query(transferQueryTransaction,[username1,username2,amount])
}
