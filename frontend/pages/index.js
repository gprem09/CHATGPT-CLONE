import React, { useState } from 'react';

const Index = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUserInput('');

    const newConversation = [...conversation, { type: 'user', text: userInput }];
    setConversation(newConversation);

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
      setConversation([...newConversation, { type: 'bot', text: data.response }]);
    } catch (error) {
      console.error('Error during fetch:', error);
      setConversation([...newConversation, { type: 'bot', text: 'Failed to get response.' }]);
    }

  };

  return (
    <main className='min-h-screen bg-rgba'>
      <h1 className='text-xl'>PremGPT</h1>
      <div className='flex justify-center'>
        {conversation.map((msg, index) => (
          <p key={index} className={msg.type === 'user' ? 'user-style' : 'bot-style'}>
            {msg.text}
          </p>
        ))}
      </div>
      <form className='flex p-4 space-x-5 border border-gray-400 rounded-2xl w-1/2 mx-auto' onSubmit={handleSubmit}>
        <input className='bg-transparent focus:outline-none flex-1' type="text" value={userInput} onChange={handleInputChange} placeholder="Message PremGPT..." />
        <button type="submit">Send</button>
      </form>
    </main>
  );
};

export default Index;
