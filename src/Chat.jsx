import React, { useState, useEffect } from 'react';
import './Chat.css'

function Chat() {

    const sampleMessages = [
        {role:"user", content:"Something a little more logical and less chaotic here. Assuming a very long message should still be readable. But we do want the CSS styles to be correct."},
        {role:"assistant", content:"Something a little more logical and less chaotic here. Assuming a very long message should still be readable. But we do want the CSS styles to be correct."},
    ]

    const url = 'https://handy-sculpin-reliably.ngrok-free.app/v1/chat/completions';
    const systemPrompt = { role: 'system', content: 'Answer the prompt briefly, but thoroughly.' }

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false)

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleUserChat = async () => {
        let newChat = [...chat, { role: 'user', content: message }]
        setChat(newChat)
        const data = { //define data to be sent to api
            messages: [systemPrompt, ...newChat,],
            temperature: 0.7,
            max_tokens: -1,
            stream: false
        };

        setLoading(true)

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        newChat = [...chat, { role: 'user', content: message }, result.choices[0].message]
        setChat(newChat); // Corrected the update of chat state
        setMessage(''); // Clear the message input after submitting
        setLoading(false)        
    };



    return (
        <div className='chat'>

            <div className='chat-title'>
                <h1>WizardLM 1.0 via Caleb Roy</h1>
                <h2>Uncensored Llama2 13B Q5_K_M</h2>
                <figure class="avatar">
                    <img src="https://tabsapp.s3.amazonaws.com/ai.png" /></figure>
            </div>

            <div className='messages' name="chatWindow" style={{ textAlign: 'left' }}>
                <div className='messages-content'>
                    {chat.map((m, index) => (
                        <div className={m.role === "user" ? 'message message-personal' : 'message'} key={index}>
                            <div dangerouslySetInnerHTML={{ __html: m.content }} />
                        </div>
                    ))}
                    {loading ? <div className="message">Loading...</div> : <></>}
                </div>
        
            </div>

            <div class="message-box">
                <textarea type="text" class="message-input" placeholder="Type message..." value={message} onChange={handleMessageChange}></textarea>
                <button type='submit' class="submit-button" onClick={handleUserChat}>Send</button>
            </div>
        </div>
    );
}

export default Chat;