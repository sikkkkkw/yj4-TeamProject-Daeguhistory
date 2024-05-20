import express from 'express';
import userRouter from './routers/userRouter.js';
import courseRouter from './routers/courseRouter.js';
import tokenRouter from './routers/tokenRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: 'json' };

const app = express();
const PORT = 8080;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/course', courseRouter);
app.use('/api/oauth', tokenRouter);

app.get('/', (req, res) => {
    res.send('하이');
});


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
