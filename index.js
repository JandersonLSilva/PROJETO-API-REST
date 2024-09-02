var app = require('app');

app.use('/', require('./routes/router'));

app.listen(3000, () =>{
    console.log("API REST - VIRTUAL STORE\nFuncionando na Porta 3000...");
});