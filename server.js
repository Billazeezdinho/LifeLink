const express = require('express');
require('./config/database');
const PORT = process.env.PORT;
const userRouter = require('./routes/userRouter')
const transactionRouter = require('./routes/transactionRouter')
const cors = require('cors');
const morgan = require('morgan');

// DATABASE_URI = mongodb+srv://billazeezdinho:RpgIDtMbHzKpK7nr@dinhocloud.q3ahc.mongodb.net/lifelinktesting
// PORT = 2115
// key = secret_key
// korapay_secret_key = sk_test_4XnbqqTxrfDzmHgz26o1wGovmZQjfLjq8hyvurWh
// userEmail= kristenhosh@gmail.com
// passEmail= ekqqvrmhufzmcuit


const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));
app.use(morgan('dev'));
app.use('/api/v1', userRouter);
app.use('/api/v1', transactionRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`)
})



// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const donorRoutes = require('./routes/donorRoutes');
// const hospitalRoutes = require('./routes/hospitalRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/donor', donorRoutes);
// app.use('/api/hospital', hospitalRoutes);
// app.use('/api/admin', adminRoutes);

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error(err));

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });
