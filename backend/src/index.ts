import express from 'express';

const app = express();
const port = 3000; // You can choose your port

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => {
    console.log(`Server running at port http://localhost:${port}`);
});