import { pool } from '../configure.js';

export async function aggregationQueries(){
    const aggregationArray= []
    const bankBalance= await pool.query(
        `
            select sum(balance) 
            from users
        `
    )
    aggregationArray.push(bankBalance.rows[0]['sum'])

    const totalAmountSent= await pool.query(
        `
        select sum(amount)
        from transactions
        where type = 'withdraw' or type= 'transfer'
    `
    )
    aggregationArray.push(totalAmountSent.rows[0]['sum'])

    const totalAmountReceived= await pool.query(
        `
        select sum(amount)
        from transactions
        where type = 'deposit' or type= 'transfer'
    `
    )
    aggregationArray.push(totalAmountReceived.rows[0]['sum'])

    const receivedLastHour= await pool.query(
        `
        select sum(amount)
        from transactions
        where (type = 'deposit' or type= 'transfer') and timestamp_column > (current_timestamp - interval '1 hour')
        `
    )
    aggregationArray.push(receivedLastHour.rows[0]['sum'])
    const sentLastHour= await pool.query(
        `
        select sum(amount)
        from transactions
        where (type = 'withdraw' or type= 'transfer') and timestamp_column > (current_timestamp - interval '1 hour')
        `
    )
    aggregationArray.push(sentLastHour.rows[0]['sum'])

    return aggregationArray
}

const result= await aggregationQueries()

console.log(result)



