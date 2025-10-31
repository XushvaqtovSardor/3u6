import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { dbConnect } from './config/index.js';
import { transporter } from './helpers/sendEmail.js';
import MainRouter from './routes/index.js';
import errorHandler from './helpers/errorHandler.js';

const app = express();
const PORT = 4000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Water Delivery API',
      version: '1.0.0',
      description: 'Water',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

await dbConnect();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/', MainRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    path: req.path,
  });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`API Docs: http://localhost:${PORT}/api-docs`);

  try {
    const info = await transporter.sendMail({
      from: `"Xushvaqtov Sardor" <${process.env.email_user}>`,
      to: process.env.email_user,
      subject: 'Server Started',
      html: '<b>Server started.</b>',
    });
    console.log('Message sent:', info.messageId);
  } catch (error) {
    console.error('Email error:', error.message);
  }
});
