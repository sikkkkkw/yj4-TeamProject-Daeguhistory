import express from 'express';
import path from 'path'
import userRouter from './routers/userRouter.js';
import courseRouter from './routers/courseRouter.js';
import tokenRouter from './routers/tokenRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 8080;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/oauth', tokenRouter);

app.get('/', (req, res) => {
    res.send('하이');
});

console.log("깃헙액션스 테스트 ")


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
