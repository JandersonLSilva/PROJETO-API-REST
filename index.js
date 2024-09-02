var app = require('app');

app.use('/install', require('./controllers/Install'));
app.use('/orders', require('./controllers/Order'));
app.use('/products', require('./controllers/Product'));
app.use('/users', require('./controllers/User'));

app.listen(3000, () =>{
    console.log("Working...");
});