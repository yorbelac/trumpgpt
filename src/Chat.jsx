import React, { useState, useEffect } from 'react';

function Chat() {

    const url = 'handy-sculpin-reliably.ngrok-free.app/v1/chat/completions';
    const systemPrompt = { role: 'system', content: 'Answer the prompt briefly, but thoroughly.' }

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

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
    };

    useEffect(() => {
        console.log(chat)
    }, [chat])



    return (
        <div>
            <div name="chatWindow" style={{textAlign:'left'}}>
                {chat.map((m, index) => (
                    <div key={index}>
                        {m.role}: <div dangerouslySetInnerHTML={{ __html: m.content }}/>
                    </div>
                ))}
            </div>

            <input type='text' value={message} onChange={handleMessageChange}></input>
            <button onClick={handleUserChat}>submit</button>
        </div>
    );
}

export default Chat;