import  { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const faqs = {
    "help": "1. perform vlookup  2. remove records by vlookup 3. remove duplicate based on selected column 4. remove entire row duplicates 5. multiple sheets vlookup",
    "1": "Upload two excel files, left one vlookup for, right one vlookup from",
    "2": "Upload two excel files, remove records from left one that match records in right one",
    "3": "upload single excel file and select a single column to remove duplicate rows based on selected column",
    "4": "upload single file and remove entire row containing duplicate values in all columns ",
    "5": "vlookup between two selected sheets of single excel file",
  };


  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      const botReply = {
        text: faqs[input] || "Sorry, I don't have an answer for that.",
        sender: "bot",
      };
      setMessages([...messages, userMessage, botReply]);
      setInput("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded shadow">
      <div className="h-[400px] overflow-y-auto mb-4 p-2 bg-white rounded border max-w-xs break-words">
      <span className="text-gray-400 text-sm">Type help</span>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block text-sm px-4  rounded ${
                msg.sender === "user"
                  ? " bg-gray-200 text-black"
                  : "bg-green-600 text-white"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
