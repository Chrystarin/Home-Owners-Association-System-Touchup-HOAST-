import './ChatStyle.scss';

import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from '../../utils/axios';

import { useAuth } from './../../utils/AuthContext.js';

const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const { isRole } = useAuth();

    useEffect(() => {
        socket.on('receive', (data) => setMessages([...messages, data]));
    }, [socket, messages]);

    // useEffect(() => {
    //     socket.on('receive', (data) => setMessages([...messages, data]));
    // }, [socket, messages]);

    // console.log(messages);

    useEffect(() => {
        const fetchMessages = async () => {
            await axios
                .get(`messages`, {
                    params: {
                        userId: isRole('guard') ? selectedUser : JSON.parse(localStorage.getItem('user')).user.userId,
                        guardId: isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : selectedUser
                    }
                })
                .then((response) => {
                    // console.log(response.data);
                    setMessages(response.data);
                });
        };
        fetchMessages();

        socket.on('receive', (data) => {
            // console.log(data);
            setMessages([...messages, data]);
        });
    }, [socket, messages, selectedUser]);

    // socket.on('receive', (data) => console.log(data[data.sender + 'Id']));

    return (
        <div className="chat">
            {/* <input type="text" placeholder="Recipient" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} /> */}

            <ChatBar socket={socket} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
            <div className="chat__main">
                <p>Selected User: {selectedUser}</p>
                <ChatBody messages={messages} />
                <ChatFooter socket={socket} recipient={selectedUser} />
            </div>
        </div>
    );
};

export default ChatPage;
