import pkg from 'pg';
const { Pool } = pkg;
import { processWithdrawTransaction, processDepositTransaction, processTransferTransaction } from './queries.js';

export const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'money_orders',
    port: 5432,
});

export async function updateDatabase() {
    try {
        await pool.query('BEGIN');

        const res = await pool.query(`
            SELECT * FROM transactions
            WHERE status = 'processing'
            ORDER BY timestamp_column DESC
            LIMIT 10
        `);

        for (const transaction of res.rows) {
            if (transaction.type === 'withdraw') {
                await processWithdrawTransaction(transaction);
            } else if (transaction.type === 'deposit') {
                await processDepositTransaction(transaction);
            } else if (transaction.type === 'transfer') {
                await processTransferTransaction(transaction);
            }
        }

        await pool.query('COMMIT');
    } catch (err) {
        console.error(err);
    }
}
// export async function updateDatabase() {
//     try {
//         await pool.query('BEGIN');
//
//         const res = await pool.query(`
//             SELECT * FROM transactions
//             WHERE status = 'processing'
//             ORDER BY timestamp_column DESC
//                 LIMIT 10
//         `);
//
//         for (let i = 0; i < res.rows.length; i++) {
//             const transaction = res.rows[i];
//
//             if (transaction.type === 'withdraw') {
//                 const user = await pool.query(`
//                     SELECT * FROM users
//                     WHERE username = $1
//                 `, [transaction.from_user]);
//
//                 if (transaction.amount > user.rows[0].balance) {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'failed'
//                         WHERE id = $1
//                     `, [transaction.id]);
//                 } else {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'success'
//                         WHERE id = $1
//                     `, [transaction.id]);
//
//                     await pool.query(`
//                         UPDATE users
//                         SET balance = balance - $1
//                         WHERE username = $2
//                     `, [transaction.amount, transaction.from_user]);
//                 }
//             } else if (transaction.type === 'deposit') {
//                 const user = await pool.query(`
//                     SELECT * FROM users
//                     WHERE username = $1
//                 `, [transaction.to_user]);
//
//                 if (transaction.amount > 10000 || user.rows[0].balance > 50000) {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'failed'
//                         WHERE id = $1
//                     `, [transaction.id]);
//                 } else {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'success'
//                         WHERE id = $1
//                     `, [transaction.id]);
//
//                     await pool.query(`
//                         UPDATE users
//                         SET balance = balance + $1
//                         WHERE username = $2
//                     `, [transaction.amount, transaction.to_user]);
//                 }
//             } else if (transaction.type === 'transfer') {
//                 const fromUser = await pool.query(`
//                     SELECT * FROM users
//                     WHERE username = $1
//                 `, [transaction.from_user]);
//
//                 const toUser = await pool.query(`
//                     SELECT * FROM users
//                     WHERE username = $1
//                 `, [transaction.to_user]);
//
//                 if (transaction.amount > 10000 || fromUser.rows[0].balance < transaction.amount || toUser.rows[0].balance + transaction.amount > 50000) {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'failed'
//                         WHERE id = $1
//                     `, [transaction.id]);
//                 } else {
//                     await pool.query(`
//                         UPDATE transactions
//                         SET status = 'success'
//                         WHERE id = $1
//                     `, [transaction.id]);
//
//                     await pool.query(`
//                         UPDATE users
//                         SET balance = balance - $1
//                         WHERE username = $2
//                     `, [transaction.amount, transaction.from_user]);
//
//                     await pool.query(`
//                         UPDATE users
//                         SET balance = balance + $1
//                         WHERE username = $2
//                     `, [transaction.amount, transaction.to_user]);
//                 }
//             }
//         }
//
//         await pool.query('COMMIT');
//
//     } catch (err) {
//         console.error(err);
//     }
// }
