const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-intro', async (req, res) => {
    const { script } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error('OpenAI API key is missing');
        return res.status(500).json({ error: 'OpenAI API key is missing' });
    }

    if (!script || typeof script !== 'string') {
        console.error('Invalid script input');
        return res.status(400).json({ error: 'Invalid script input' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-3.5-turbo', //'gpt-4',
            prompt: `Generate a catchy YouTube intro for the following script:\n\n${script}`,
            max_tokens: 50,
            temperature: 0.7,
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        const intro = response.data.choices[0].text.trim();
        res.json({ intro });
    } catch (error) {
        console.error('Error generating intro:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error generating intro' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});