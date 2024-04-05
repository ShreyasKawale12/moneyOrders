import {updateDatabase} from './configure.js'

setInterval(async () => {
    console.log("database updated")
    await updateDatabase()
}, 5000);


