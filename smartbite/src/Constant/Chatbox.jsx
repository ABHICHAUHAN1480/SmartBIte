import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null); // Ref to the end of the messages container

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    

  }, [messages]);


  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Hi there! I'm your Food bot. Ask me anything about nutrition, recipes, or ingredients!" },
      ]);setLoading(false)
    }, 2000);
    
  }, []); 
  
  

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: "user", text: userInput }]);
    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:3001/api/converse", {
          text: userInput,
        });

        const botAnswer =
        response.data.answer.answerText === "Sorry I did not understand the question."
          ? "Hi there! I'm your Food bot. Ask me anything about nutrition, recipes, or ingredients!"
          : response.data.answer.answerText || "Sorry, no response.";
        const botMedia = response.data.answer.media || [];
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botAnswer, media: botMedia },
        ]);
      } catch (error) {
        console.error("Error in frontend:", error);

        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Sorry, something went wrong." },
        ]);
      } finally {
        setLoading(false);
        setUserInput("");
      }
    }, 2000);
  };

  return (
    <div className="fixed ml-[60%] mt-[7%] w-1/2 bg-gray-100 p-4 rounded-lg max-w-lg z-50 shadow-xl border border-gray-300">
      <div className="h-[73vh] overflow-y-scroll div3 bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4 p-4 bg-blue-100 text-blue-900 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Welcome to the Food Bot!</h2>
          <p className="text-sm">
            I'm here to help you explore recipes, food trivia, and meal ideas. Here are some examples of what you can ask:
          </p>
          <ul className="list-disc ml-6 mt-2 text-sm">
            <li>"What can I make with chicken and rice?"</li>
            <li>"Tell me a fun fact about pizza."</li>
            <li>"Suggest a healthy dessert option."</li>
            <li>"What are some quick breakfast recipes?"</li>
          </ul>
        </div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.sender === "user" ? "text-right" : "text-left"}`}
          >
            <p
              className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </p>

            {msg.media && msg.media.length > 0 && (
              <div className="media mt-2 flex flex-wrap justify-start">
                {msg.media.map((item, idx) => (
                  <div key={idx} className="w-full sm:w-1/2 md:w-1/3 mb-4 px-2">
                    <a
                      className="text-blue-600"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={item.image}
                        alt={item.title || "Media item"}
                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                    </a>
                    <span className="block text-black font-medium mb-1">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className=" mt-4">
            <lord-icon
              src="https://cdn.lordicon.com/fdxqrdfe.json"
              trigger="loop"
              colors="primary:#000"
              style={{ width: "50px", height: "50px" }}
            ></lord-icon>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Add this div for auto-scrolling */}
      </div>

      <div className="mt-4 flex items-center space-x-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask me about food..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
