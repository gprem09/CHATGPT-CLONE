import React, { useState, useEffect, useRef } from 'react';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/sessions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.flatMap(session =>
          session.chats.flatMap(chat => [
            { type: 'user', text: chat.user_input },
            { type: 'bot', text: chat.bot_response }
          ])
        );
        setConversation(formattedData);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
  
    setUserInput('');
  
    const newUserMessage = { type: 'user', text: userInput };
    setConversation(prev => [newUserMessage, ...prev]);
  
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setConversation(prev => [{ type: 'bot', text: data.response }, ...prev]);
  
    } catch (error) {
      console.error('Error during fetch:', error);
      setConversation(prev => [{ type: 'bot', text: 'Failed to get response.' }, ...prev]);
    }
  };
  
  if (isLoading) {
    return <p>Loading chat history...</p>;
  }
  
  return (
    <main className='flex flex-col min-h-screen bg-rgba'>
      <h1 className='text-xl'>PremGPT</h1>
      <div className='flex flex-col-reverse flex-grow overflow-auto mb-20' ref={messagesContainerRef}>
        {conversation.map((msg, index) => (
          <div key={index} className="message-container">
            <p className={msg.type === 'user' ? 'user-style' : 'bot-style'}>
              {msg.type === 'user' ? `You: ${msg.text}` : `PremGPT: ${msg.text}`}
            </p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <form className='bg-rgba flex p-4 space-x-5 border border-gray-400 rounded-2xl w-1/2 mx-auto' onSubmit={handleSubmit}>
          <input className='bg-rgba focus:outline-none flex-1' type="text" value={userInput} onChange={handleInputChange} placeholder="Message PremGPT..." />
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
};

export default Index;
