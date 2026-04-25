if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const usageRoutes = require('./routes/usageRoutes');
const billingRoutes = require('./routes/billingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);
app.use('/gateway', gatewayRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'MeterFlow' });
});

app.use(errorHandler);

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://meterflowUser:Meterflow2024@ac-uoeyouu-shard-00-00.qla2yaw.mongodb.net:27017,ac-uoeyouu-shard-00-01.qla2yaw.mongodb.net:27017,ac-uoeyouu-shard-00-02.qla2yaw.mongodb.net:27017/meterflow?ssl=true&replicaSet=atlas-13e8be-shard-0&authSource=admin&appName=meterflow';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log('MeterFlow running on port ' + process.env.PORT)
    );
  })
  .catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });