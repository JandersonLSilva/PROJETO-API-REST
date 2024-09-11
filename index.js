var app = require('./app');

app.use('/', require('./routes/router'));


const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_doc.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () =>{
    console.log("API REST - VIRTUAL STORE\nFuncionando na Porta 3000...");
});