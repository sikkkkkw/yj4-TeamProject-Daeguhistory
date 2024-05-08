import express from 'express';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('하이');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
