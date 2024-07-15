const express = require('express');
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

app.post('*', (req, res) => {
    try {
        // Retrieve the callback data from the request
        const callbackData = req.body;

        // Validate the callback data
        if (!callbackData || !callbackData.callbackUrl || !callbackData.data) {
            return res.status(400).send({ error: 'Invalid callback data' });
        }

        // Process the callback data
        const callbackUrl = callbackData.callbackUrl;
        const callbackDataContent = callbackData.data;

        // Perform any necessary processing or storage of the callback data
        console.log(`Received callback from ABDM: ${callbackUrl}`);
        console.log(`Callback data: ${callbackDataContent}`);

        // Return a success response
        res.status(200).send({ message: 'Callback received successfully' });

    } catch (error) {
        // Handle any errors that occur during the processing
        console.error(error);
        res.status(500).send({ error: 'Error processing callback' });
    }
});

app.listen(PORT, () => {
    console.log('Server listening on port 4000');
});