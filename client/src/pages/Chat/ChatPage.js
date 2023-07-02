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
                console.log(response.data);
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
            if (
                (data[data.receiver].userId === JSON.parse(localStorage.getItem('user')).user.userId && data[data.sender].userId === selectedUser) ||
                (data[data.receiver].userId === selectedUser && data[data.sender].userId === JSON.parse(localStorage.getItem('user')).user.userId)
            ) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        return () => {
            socket.off('receive');
        };
    }, [socket, messages]);

    const [guard, setGuard] = useState();

    const fetchGuards = async () => {
        await axios
            .get(`hoas/guards`, {
                params: {
                    selectedHoa: process.env.REACT_APP_HOA_ID
                }
            })
            .then((response) => {
                const getUserById = (userId) => {
                    return response.data.find((item) => item.user.userId === userId);
                };
                setGuard(getUserById(selectedUser));
                console.log(getUserById(selectedUser));
            });
    };

    useEffect(() => {
        if (!isRole('guard')) {
            if (selectedUser) fetchGuards();
        }
    }, [selectedUser]);

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
                            <h6>
                                {selectedName}
                                {isRole('guard') ? '' : ` (${guard?.contactNo})`}
                            </h6>
                        </div>
                        <ChatBody messages={messages} scroll={scroll} setScroll={setScroll} selectedUser={selectedUser} selectedName={selectedName} />
                    </div>
                    <ChatFooter socket={socket} recipient={selectedUser} setMessages={setMessages} />
                </div>
            </div>
        </>
    );
};

export default ChatPage;
