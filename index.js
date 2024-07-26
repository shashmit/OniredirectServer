import cors from 'cors';
import express from 'express';
import hipRoutes from './routes/hip.js';
import hiecmRoutes from './routes/hiecm.js';
import notiRoutes from './routes/noti.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.json());

app.use('/hip', hipRoutes);
app.use("/hiecm", hiecmRoutes);
app.use("/noti", notiRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
