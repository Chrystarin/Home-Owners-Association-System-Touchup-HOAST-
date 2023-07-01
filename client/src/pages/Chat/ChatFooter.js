import React, { useState } from 'react';
import { useAuth } from './../../utils/AuthContext.js';

const ChatFooter = ({ socket, recipient }) => {
    const [message, setMessage] = useState('');
    const { isRole } = useAuth();

    const handleSendMessage = (e) => {
        e.preventDefault();

        console.log('content: ' + message);
        console.log('userId: ' + isRole('guard') ? recipient : JSON.parse(localStorage.getItem('user')).user.userId);
        console.log('hoaId: ' + process.env.REACT_APP_HOA_ID);
        console.log('guardId: ' + isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : recipient);
        console.log('sender: ' + isRole('guard') ? 'guard' : 'user');
        console.log('receiver: ' + isRole('guard') ? 'user' : 'guard');

        socket.emit('send', {
            content: message,
            userId: isRole('guard') ? recipient : JSON.parse(localStorage.getItem('user')).user.userId,
            hoaId: process.env.REACT_APP_HOA_ID,
            guardId: isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : recipient,
            sender: isRole('guard') ? 'guard' : 'user',
            receiver: isRole('guard') ? 'user' : 'guard'
        });
        setMessage('');
    };
    return (
        // <div className="chat__footer">
        //     <form onSubmit={handleSendMessage}>
        //         <input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
        //         <button type="submit">Send</button>
        //     </form>
        // </div>
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input type="text" placeholder="Write message" className="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;
