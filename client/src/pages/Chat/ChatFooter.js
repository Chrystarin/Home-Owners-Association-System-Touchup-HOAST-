import React, { useState } from 'react';
import { useAuth } from './../../utils/AuthContext.js';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
const ChatFooter = ({ socket, recipient, setMessages }) => {
    const [message, setMessage] = useState('');
    const { isRole } = useAuth();

    const handleSendMessage = (e) => {
        e.preventDefault();

        console.log(JSON.parse(localStorage.getItem('user')).user.userId);
        console.log(recipient);
        socket.emit('send', {
            content: message,
            userId: isRole('guard') ? recipient : JSON.parse(localStorage.getItem('user')).user.userId,
            hoaId: process.env.REACT_APP_HOA_ID,
            guardId: isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : recipient,
            sender: isRole('guard') ? 'guard' : 'user',
            receiver: isRole('guard') ? 'user' : 'guard'
        });
        // setMessages((prevMessages) => [
        //     ...prevMessages,
        //     {
        //         content: message,
        //         userId: isRole('guard') ? recipient : JSON.parse(localStorage.getItem('user')).user.userId,
        //         hoaId: process.env.REACT_APP_HOA_ID,
        //         guardId: isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : recipient,
        //         sender: isRole('guard') ? 'guard' : 'user',
        //         receiver: isRole('guard') ? 'user' : 'guard'
        //     }
        // ]);
        setMessage('');
    };
    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input type="text" placeholder="Write message" className="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button variant="contained" type="submit">
                    SEND
                </Button>
            </form>
        </div>
    );
};

export default ChatFooter;
