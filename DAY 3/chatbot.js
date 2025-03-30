const GEMINI_API_KEY = "AIzaSyA6206mZepQktTDaSI_x6-Y1LNvy9cqKHs"; // Replace with your actual API key

function toggleChatbot() {
    var chatbot = document.getElementById("chatbot");
    chatbot.style.display = (chatbot.style.display === "none" || chatbot.style.display === "") ? "block" : "none";
}

async function sendMessage() {
    var userInputElement = document.getElementById("userInput");
    var userInput = userInputElement.value.trim();
    if (!userInput) return;

    var chatbox = document.querySelector(".chatbot-messages");

    // Add user message
    var userMessage = document.createElement("p");
    userMessage.textContent = userInput;
    userMessage.className = "user-message";
    chatbox.appendChild(userMessage);
    chatbox.scrollTop = chatbox.scrollHeight;

    userInputElement.value = "";

    // Show bot is typing
    var botTyping = document.createElement("p");
    botTyping.textContent = "Bot is typing...";
    botTyping.className = "bot-message";
    chatbox.appendChild(botTyping);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Get AI response
    try {
        const botResponse = await getBotResponse(userInput);
        chatbox.removeChild(botTyping);

        var botMessage = document.createElement("p");
        botMessage.textContent = botResponse;
        botMessage.className = "bot-message";
        chatbox.appendChild(botMessage);
        chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        chatbox.removeChild(botTyping);
        var errorMessage = document.createElement("p");
        errorMessage.textContent = "Sorry, an error occurred. Please try again later.";
        errorMessage.className = "bot-message";
        chatbox.appendChild(errorMessage);
    }
}

async function getBotResponse(userInput) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: { text: userInput },
                temperature: 0.7,
                maxOutputTokens: 100
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.output || "Sorry, I couldn't understand that.";
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Error communicating with the AI.";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
