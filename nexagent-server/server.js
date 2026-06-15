const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message, history } = req.body;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{
                        text: `You are ARIA, an AI assistant for NexAgent - an AI agency that builds custom AI agents for businesses.
                        NexAgent offers these services:
                        - Custom AI Chatbots
                        - Workflow Automation
                        - Data Analysis Agents
                        - E-commerce Agents
                        - Email & Marketing Agents
                        - Research Agents
                        Be helpful, friendly and professional. Keep answers concise.`
                    }]
                },
                contents: history.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }))
            })
        });

        const data = await response.json();
        console.log(JSON.stringify(data));

        if (data.candidates && data.candidates[0]) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.json({ reply: 'Sorry I could not process that!' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(3001, () => {
    console.log('ARIA server running on port 3001');
});