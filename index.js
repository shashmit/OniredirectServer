import cors from 'cors';
import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import hipRoutes from './routes/hip.js';
import careContext from './routes/careContext.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/hip', hipRoutes);
app.use("/carecontext", careContext);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
