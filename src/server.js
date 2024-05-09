import express from 'express';
import userRouter from './routers/userRouter.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/users', userRouter);
app.get('/', (req, res) => {
    res.send('하이');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
