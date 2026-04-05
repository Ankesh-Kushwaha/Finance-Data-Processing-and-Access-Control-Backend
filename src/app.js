import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import cors from 'cors';
import { connectToDB } from './config/db.js';
import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import financeRouter from './routes/finance.route.js'
import dashBoardRouter from './routes/dashboard.route.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());



app.use('/health',async (req,res) => {
  res.status(200).json("server is running healthy");
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/finance', financeRouter);
app.use('/api/dashboard', dashBoardRouter);


app.listen(PORT, () => {
  connectToDB();
  console.log('server is running on 3000');
});