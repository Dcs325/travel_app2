import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5001;
const AVIATIONSTACK_KEY = '2e0fe3c943d19a28d53f2628ea78b3dc';

app.use(cors());

app.get('/aviationstack', async (req, res) => {
    const { dep_iata, arr_iata, limit = 5 } = req.query;
    if (!dep_iata || !arr_iata) {
        return res.status(400).json({ error: 'Missing dep_iata or arr_iata' });
    }
    const url = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&dep_iata=${dep_iata}&arr_iata=${arr_iata}&limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
        console.log(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
}); 