const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

app.all('*', (req, res) => {
    const data = req.body;
    const path = req.path;

    console.log(`Received request on path: ${path}`);

    // Check if the request contains the expected structure
    if (!data || !data.type) {
        return res.status(400).json({ status: "error", message: "Invalid request format" });
    }

    const eventType = data.type;
    console.log(`Received event: ${eventType}`);

    // Process the event
    processEvent(eventType, data);

    res.status(200).json({ status: "success", message: "Event processed" });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});