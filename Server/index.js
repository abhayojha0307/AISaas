const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const { clerkMiddleware, requireAuth } = require('@clerk/express');

const aiRouter = require('./routes/aiRoutes');
const { connectCloudinary } = require('./configs/cloudinary');
const userRouter = require('./routes/userRoutes');


async function startServer(){const app = express();
const PORT = process.env.PORT || 3000;

await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// app.use();

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});}
startServer()