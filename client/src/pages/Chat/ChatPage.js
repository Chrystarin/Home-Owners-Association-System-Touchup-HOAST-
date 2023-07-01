import './ChatStyle.scss';

import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from '../../utils/axios';
const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     socket.on('receive', (data) => setMessages([...messages, data]));
    // }, [socket, messages]);

    // useEffect(() => {
    //     socket.on('receive', (data) => setMessages([...messages, data]));
    // }, [socket, messages]);

    // console.log(messages);

    useEffect(() => {
        const fetchMessages = async () => {
            await axios
                .get(`messages`, {
                    params: {
                        userId: JSON.parse(localStorage.getItem('user')).user.userId,
                        guardId: 'USR2@s23T_v'
                    }
                })
                .then((response) => {
                    // console.log(response.data);
                    setMessages(response.data);
                });
        };
        fetchMessages();
    }, [messages]);

    return (
        <div className="chat">
            <ChatBar socket={socket} />
            <div className="chat__main">
                <ChatBody messages={messages} />
                <ChatFooter socket={socket} />
            </div>
        </div>
    );
};

export default ChatPage;
