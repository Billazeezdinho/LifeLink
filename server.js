const express = require('express');
require('./config/database');
const PORT = process.env.PORT;
const userRouter = require('./routes/userRouter')
const transactionRouter = require('./routes/transactionRouter')
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));
app.use(morgan('dev'));
app.use('/api/v1', userRouter);
app.use('/api/v1', transactionRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`)
})