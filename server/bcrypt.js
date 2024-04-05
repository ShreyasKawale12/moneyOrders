import bcrypt from 'bcrypt';

async function runBcrypt() {
    const password = '123';

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Hashed password:', hashedPassword);

}

runBcrypt().catch(console.error);
