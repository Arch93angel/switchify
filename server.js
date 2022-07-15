import express from "express";
const app = express();
import dotenv from "dotenv";

dotenv.config();

import "express-async-errors";
import morgan from "morgan";

//db and authenticateUser
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";


//middleware
import notFoundMiddleware from "./middleware/not_found.js";
import errorHandlerMiddleware from "./middleware/error_handler.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.get('/', (request, response) => {

    response.send('Welcome to server side');
});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT;


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => { console.log(`Server is listening on http://localhost:${port}`) });
    } catch (error) {
        console.log(error);
    }
}
start();