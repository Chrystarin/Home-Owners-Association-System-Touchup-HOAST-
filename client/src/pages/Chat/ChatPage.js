import './ChatStyle.scss';

import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from '../../utils/axios';
import NavBar from '../../layouts/NavBar';
import { useAuth } from './../../utils/AuthContext.js';

const ChatPage = ({ socket }) => {
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [selectedName, setSelectedName] = useState();
    const { isRole } = useAuth();
    const [scroll, setScroll] = useState(false);

    const fetchMessages = async () => {
        console.log('Messages Fetched');
        
        await axios
            .get(`messages`, {
                params: {
                    userId: isRole('guard') ? selectedUser : JSON.parse(localStorage.getItem('user')).user.userId,
                    guardId: isRole('guard') ? JSON.parse(localStorage.getItem('user')).user.userId : selectedUser
                }
            })
            .then((response) => {
                setMessages(response.data);
            });
    };

    useEffect(() => {
        if (selectedUser) {
            fetchMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        socket.on('receive', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('receive');
        };
    }, [socket, messages]);

    return (
        <>
            <NavBar />
            <div className="chat">
                <ChatBar
                    socket={socket}
                    setSelectedUser={setSelectedUser}
                    selectedUser={selectedUser}
                    setScroll={setScroll}
                    setMessages={setMessages}
                    setSelectedName={setSelectedName}
                />
                <div className="chat__main">
                    <div className="chat__main__Container">
                        <div className="chat__main__Header">
                            <h6>{selectedName}</h6>
                        </div>
                        <ChatBody messages={messages} scroll={scroll} setScroll={setScroll} />
                    </div>
                    <ChatFooter socket={socket} recipient={selectedUser} />
                </div>
            </div>
        </>
    );
};

export default ChatPage;
