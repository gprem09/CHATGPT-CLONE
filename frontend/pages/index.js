import React, { useState, useEffect, useRef } from 'react';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState({});
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchAllSessions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/sessions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSessions(data.reduce((acc, session) => ({ ...acc, [session.session_id]: session.chats }), {}));
        if (data.length > 0) {
          setCurrentSessionId(data[0].session_id);
        }
        console.log(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllSessions();
  }, []);

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const handleStartNewSession = () => {
    const newSessionId = Object.keys(sessions).length; 
    setCurrentSessionId(newSessionId);
    setSessions(prev => ({ ...prev, [newSessionId]: [] }));
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [currentSessionId, sessions]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
  
    setUserInput('');
  
    const updatedChats = [...(sessions[currentSessionId] || []), { type: 'user', text: userInput }];
    setSessions(prev => ({ ...prev, [currentSessionId]: updatedChats }));
  
    try {
      const response = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput, session_id: currentSessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const updatedChatsWithResponse = [...updatedChats, { type: 'bot', text: data.response }];
      setSessions(prev => ({ ...prev, [currentSessionId]: updatedChatsWithResponse }));
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };
  
  if (isLoading) {
    return <p>Loading chat history...</p>;
  }
  
  return (
    <main className='flex flex-col min-h-screen bg-rgba'>
      <h1 className='text-xl'>PremGPT</h1>
      <button onClick={handleStartNewSession}>Start New Session</button>
      <div>
        {Object.keys(sessions).map(sessionId => (
          <button key={sessionId} onClick={() => handleSelectSession(sessionId)}>
            Session {sessionId}
          </button>
        ))}
      </div>
      <div className='flex flex-col-reverse flex-grow overflow-auto mb-20' ref={messagesContainerRef}>
        {currentSessionId != null && sessions[currentSessionId]?.map((msg, index) => (
          <div key={index} className="message-container">
            <p className="user-style">You: {msg.user_input}</p>
            <p className="bot-style">PremGPT: {msg.bot_response}</p>
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
