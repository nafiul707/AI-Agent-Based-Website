const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

const conversationHistory = [];

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.innerText = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatToggle.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    if (chatMessages.children.length === 0) {
        addMessage("Hi! I'm ARIA 👋 NexAgent's AI Assistant. How can I help you today?", 'aria');
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    conversationHistory.push({ role: 'user', content: message });

    addMessage('ARIA is typing...', 'aria');

    try {
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: conversationHistory
            })
        });

        const data = await response.json();
        chatMessages.removeChild(chatMessages.lastChild);

        if (data.reply) {
            conversationHistory.push({
                role: 'assistant',
                content: data.reply
            });
            addMessage(data.reply, 'aria');
        } else {
            addMessage('Sorry I could not understand. Please try again!', 'aria');
        }

    } catch (error) {
        chatMessages.removeChild(chatMessages.lastChild);
        addMessage('Sorry, I am having trouble connecting. Please try again!', 'aria');
    }

    sendBtn.disabled = false;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});