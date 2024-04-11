import bcrypt from 'bcrypt';

export async function runBcrypt(password) {
    const saltRounds = 10;
    // console.log('Hashed password:', hashedPassword);
    return await bcrypt.hash(password, saltRounds)
}


