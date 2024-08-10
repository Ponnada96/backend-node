require('dotenv').config();

const exppress = require('express');
const app = exppress();
const port = process.env.PORT || 3005;

app.get('/', (req, res) => {
    res.send('Hello Home Page')
});

app.get('/twitter', (req, res) => {
    res.send('<h1>Twitter page</h1>')
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            joke: "joke 1",
            content: "content 1"
        },
        {
            id: 2,
            joke: "joke 2",
            content: "content 2"
        },
        {
            id: 3,
            joke: "joke 3",
            content: "content 3"
        },
        {
            id: 4,
            joke: "joke 4",
            content: "content 4"
        },
        {
            id: 5,
            joke: "joke 5",
            content: "content 5"
        }
    ];
    res.json(jokes)
});

app.listen(port, () => {
    console.log(`App Listening on ${port}`);
});