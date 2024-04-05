import path from "path";
import router from "./dashboardRoutes.js";
import { dirname } from 'path';
import {fileURLToPath} from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/admin', (req, res) => {
    // res.status(200).send()
    res.status(200).sendFile(path.join(__dirname, '../../client/adminPage.html'));
});

export default router