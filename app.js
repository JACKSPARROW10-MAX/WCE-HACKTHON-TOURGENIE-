// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
    // Add event listeners
    const sendButton = document.getElementById("sendButton");
    const userInput = document.getElementById("userInput");
    const chatWindow = document.getElementById("chatWindow");
    const loadingSpinner = document.getElementById("loadingSpinner");
  
    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  
    function sendMessage() {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
  
      // Add user message to chat
      appendMessage(userMessage, "user");
  
      // Clear input and show loading spinner
      userInput.value = "";
      toggleLoading(true);
  
      // Fetch bot response
      fetchBotResponse(userMessage)
        .then((botResponse) => {
          appendMessage(botResponse, "bot");
        })
        .catch(() => {
          appendMessage(
            "🌍 Sorry, there was an issue fetching the travel info. Please try again later.",
            "bot"
          );
        })
        .finally(() => {
          toggleLoading(false);
        });
    }
  
    function appendMessage(message, sender) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("chat-message", sender);
      messageElement.innerHTML = `<p>${message}</p>`;
      chatWindow.appendChild(messageElement);
      chatWindow.scrollTop = chatWindow.scrollHeight;
  
      // Animation effect
      setTimeout(() => {
        messageElement.style.opacity = "1";
        messageElement.style.transform = "translateY(0)";
      }, 100);
    }
  
    function toggleLoading(show) {
      loadingSpinner.style.display = show ? "block" : "none";
    }
  
    async function fetchBotResponse(question) {
      const endpoint =
        "https://tripal.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=TripPal&api-version=2021-10-01&deploymentName=production";
      const apiKey =
        "1RvETB8QmoVXBz9KA1RjyF9SigNqt0Pym9xybIpriPhk1WvBA6KWJQQJ99BAACYeBjFXJ3w3AAAaACOGqm6L";
  
      try {
        const response = await axios.post(
          endpoint,
          { question },
          {
            headers: {
              "Ocp-Apim-Subscription-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
  
        return (
          response.data.answers?.[0]?.answer ||
          "🌍 Sorry, I couldn't find an answer to that. Try asking about popular destinations or travel tips!"
        );
      } catch (error) {
        console.error("Error communicating with the API:", error);
        throw new Error("API request failed");
      }
    }
  
    // Initial animation
    const chatbotContainer = document.querySelector(".chatbot-container");
    chatbotContainer.style.opacity = "0";
    chatbotContainer.style.transform = "translateY(20px)";
    setTimeout(() => {
      chatbotContainer.style.opacity = "1";
      chatbotContainer.style.transform = "translateY(0)";
    }, 200);
  });
  