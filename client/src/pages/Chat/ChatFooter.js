import React, { useState } from 'react';

const ChatFooter = ({ socket }) => {
    const [message, setMessage] = useState('');
    const [guard, setGuard] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        socket.emit('send', {
            content: message,
            userId: JSON.parse(localStorage.getItem('user')).user.userId,
            hoaId: process.env.REACT_APP_HOA_ID,
            guardId: guard,
            sender: 'user',
            receiver: 'guard'
        });
        setMessage('');
    };
    return (
        <div className="chat__footer">
            <form onSubmit={handleSendMessage}>
                <input type="text" placeholder="Guard Id" value={guard} onChange={(e) => setGuard(e.target.value)} />
                <br />
                <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatFooter;
