import {pool} from "./configure.js";

async function getUserByUsername(username) {
    const user = await pool.query(`
        SELECT * FROM users
        WHERE username = $1
    `, [username]);
    return user.rows[0];
}

async function updateTransactionStatus(id, status) {
    await pool.query(`
        UPDATE transactions
        SET status = $1
        WHERE id = $2
    `, [status, id]);
}

async function updateBalanceByUsername(username, amount) {
    await pool.query(`
        UPDATE users
        SET balance = balance + $1
        WHERE username = $2
    `, [amount, username]);
}

export async function processWithdrawTransaction(transaction) {
    const user = await getUserByUsername(transaction.from_user);
    if (transaction.amount > user.balance) {
        await updateTransactionStatus(transaction.id, 'failed');
    } else {
        await updateTransactionStatus(transaction.id, 'success');
        await updateBalanceByUsername(transaction.from_user, -transaction.amount);
    }
}

export async function processDepositTransaction(transaction) {
    const user = await getUserByUsername(transaction.to_user);
    if (transaction.amount > 10000 || user.balance > 50000) {
        await updateTransactionStatus(transaction.id, 'failed');
    } else {
        await updateTransactionStatus(transaction.id, 'success');
        await updateBalanceByUsername(transaction.to_user, transaction.amount);
    }
}

export async function processTransferTransaction(transaction) {
    const fromUser = await getUserByUsername(transaction.from_user);
    const toUser = await getUserByUsername(transaction.to_user);

    if (transaction.amount > 10000 || fromUser.balance < transaction.amount || toUser.balance + transaction.amount > 50000) {
        await updateTransactionStatus(transaction.id, 'failed');
    } else {
        await updateTransactionStatus(transaction.id, 'success');
        await updateBalanceByUsername(transaction.from_user, -transaction.amount);
        await updateBalanceByUsername(transaction.to_user, transaction.amount);
    }
}