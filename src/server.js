import express from 'express';
import userRouter from './routers/userRouter.js';
import courseRouter from './routers/courseRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };

const app = express();
const PORT = 8080;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/api', userRouter, courseRouter);
app.get('/', (req, res) => {
    res.send('하이');
});
app.post('/test', (req, res) => {
    res.send('포스트 성공');
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
