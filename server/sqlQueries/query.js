// configure.js
import { pool } from '../configure.js';
// import {query} from "express";

export async function getUserByUsername(username) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    // console.log(result)
    return result.rows[0];
}

// export async checkUsernameEndpoint(username){
//     const result=
// }
const getTransactionByUsername= `
    select * from transactions
    where from_user= $1 or to_user= $1
    order by timestamp_column
`
export async function getTransactionsByUsername(username){
    const result= await pool.query(getTransactionByUsername,[username])
    return result.rows
}

export async function getTransactionsForEmail(records, username, user, afterDate, beforeDate){
    let whereClauses = [];
    let params = [];

    whereClauses.push(`(from_user = $${whereClauses.length + 1} OR to_user = $${whereClauses.length + 1})`);
    params.push(username);

    if (user) {
        whereClauses.push(`(from_user = $${whereClauses.length + 1} OR to_user = $${whereClauses.length + 1})`);
        params.push(user);
    }

    if (afterDate) {
        whereClauses.push(`timestamp_column >= $${whereClauses.length + 1}`);
        params.push(afterDate);
    }

    if (beforeDate) {
        whereClauses.push(`timestamp_column <= $${whereClauses.length + 1}`);
        params.push(beforeDate);
    }

    let whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    let limitClause = records ? `LIMIT $${whereClauses.length + 1}` : '';
    if (records) params.push(records);

    let query = `
        SELECT * FROM transactions
        ${whereClause}
        ORDER BY timestamp_column DESC
        ${limitClause}
    `;

    const result = await pool.query(query, params);

    return result.rows;
}



const deposit_query=
    `update users 
    set balance = balance + $1
    where username= $2`

const deposit_query_transactions= `
    insert into transactions
    values ('deposit',null,$1,$2)
`

const withdrawQuery= `
    update users
    set balance = balance - $1
    where username= $2
`

const withdrawQueryTransactions=`
    insert into transactions
    values('withdraw',$1,null,$2)
`
//
const transferQueryDoner= `
    update users
    set balance= balance - $2
    where username = $1
`

const transferQueryReciever= `
    update users
    set balance= balance + $2
    where username = $1
`

const transferQueryTransaction= `
    insert into transactions
    values('transfer',$1,$2,$3)
`
export async function fetchTransactions(){
    return await pool.query('SELECT * FROM transactions order by timestamp_column desc limit 10')
}
export async function deposit(username, amount){
    console.log(typeof amount)
    await pool.query(deposit_query_transactions,[username, amount])
}

export async function withdraw(username, amount){
    await pool.query(withdrawQueryTransactions, [username, amount])
}

export async function transfer(username1,username2,amount){
    await pool.query(transferQueryTransaction,[username1,username2,amount])
}
