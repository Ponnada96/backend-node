require('dotenv').config();

const exppress = require('express');
const app = exppress();

app.get('/', (req, res) => {
    res.send('Hello Home Page')
});

app.get('/twitter', (req, res) => {
    res.send('<h1>Twitter page</h1>')
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});
console.log(process.env.PORT);
app.listen(process.env.PORT, () => {
    console.log(`App Listening on ${process.env.PORT}`);
})