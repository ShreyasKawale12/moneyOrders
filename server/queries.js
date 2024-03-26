import {pool} from './configure.js'

(async ()=>{
    const client = await pool.connect()
    const {rows}= await client.query('select * from customers where id=1')
    console.table(rows)
})();