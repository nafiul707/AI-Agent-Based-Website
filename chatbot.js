const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

chatToggle.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    if (chatMessages.children.length === 0) {
        addMessage("Hi! I'm ARIA 👋 NexAgent's AI Assistant. How can I help you today?", 'aria');
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    addMessage('ARIA is typing...', 'aria');

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: `You are ARIA, an AI assistant for NexAgent - an AI agency that builds custom AI agents for businesses.
                        NexAgent offers these services:
                        - Custom AI Chatbots
                        - Workflow Automation
                        - Data Analysis Agents
                        - E-commerce Agents
                        - Email & Marketing Agents
                        - Research Agents
                        Be helpful, friendly and professional. Keep answers concise.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        const data = await response.json();
        chatMessages.removeChild(chatMessages.lastChild);
        addMessage(data.choices[0].message.content, 'aria');

    } catch (error) {
        chatMessages.removeChild(chatMessages.lastChild);
        addMessage('Sorry, I am having trouble connecting. Please try again!', 'aria');
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});