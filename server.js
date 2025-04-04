const express = require('express');
require('./config/database');
const PORT = process.env.PORT;
const donorRouter = require('./routes/donorRouter')
const transactionRouter = require('./routes/transactionRouter')
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));
app.use(morgan('dev'));


// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " LifeLink Blood Donor Documentation",
      version: "1.0.0",
      description: "API for managing blood donors",
      license: {
        name: "base:https://lifelink-7pau.onrender.com/api/v1",
      }
    },
    servers: [{ url: "https://lifelink-7pau.onrender.com/api/v1",
        description: 'production Server'
     },
        {url: `http://localhost:${PORT}/api/v1`, 
            description: 'Development server'
        }
    ],
  },
  apis: ["./routes/*.js"], // Load API documentation from route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use Routers
app.get('/', (req, res)=>{
    res.send('Welcome to LifeLink')
})
app.use('/api/v1', donorRouter);
app.use('/api/v1', transactionRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening to PORT: ${PORT}`);
    console.log(`Swagger docs available at https://lifelink-7pau.onrender.com/api-docs`);
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
