import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../utils/AuthContext.js';
import axios from '../../utils/axios';

const ChatBody = ({ messages, selectedUser, selectedName }) => {
    const messageContainerRef = useRef(null);

    // console.log(messages);

    // const handleLeaveChat = () => {
    //     localStorage.removeItem('userName');
    //     navigate('/');
    //     window.location.reload();
    // };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };
    scrollToBottom();

    // const fetchGuard = async () => {
    //     await axios
    //         .get(`hoas/guards`, {
    //             params: {
    //                 hoaId: process.env.REACT_APP_HOA_ID,
    //                 guardId: selectedUser
    //             }
    //         })
    //         .then((response) => {
    //             console.log(response.data);
    //             setGuard(response.data);
    //         });
    // };

    // const { isRole } = useAuth();
    // const [guard, setGuard] = useState();

    // const fetchGuards = async () => {
    //     await axios
    //         .get(`hoas/guards`, {
    //             params: {
    //                 selectedHoa: process.env.REACT_APP_HOA_ID
    //             }
    //         })
    //         .then((response) => {
    //             const getUserById = (userId) => {
    //                 return response.data.find((item) => item.user.userId === userId);
    //             };
    //             setGuard(getUserById(selectedUser));
    //             console.log(getUserById(selectedUser));
    //         });
    // };

    // useEffect(() => {
    //     if (!isRole('guard')) {
    //         if (selectedUser) fetchGuards();
    //     }
    // }, [selectedUser]);

    if (!messages) return <div>Loading...</div>;

    return (
        <>
            {/* <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header> */}

            <div>
                {messages.length === 0 ? (
                    <div className="message__container message__Empty">
                        <p>Start a Conversation . . .</p>
                    </div>
                ) : (
                    <>
                        <div className="message__container" ref={messageContainerRef}>
                            {messages.map((message) =>
                                message[message.sender].userId === JSON.parse(localStorage.getItem('user')).user.userId ? (
                                    <div className="message__chats" key={message.id}>
                                        <p className="sender__name">You</p>
                                        <p className="sender__name">{message[message.sender + 'Id']}</p>
                                        <div className="message__sender">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="message__chats" key={message.id}>
                                        {/* <p>{message[message.receiver].name.firstName}</p> */}
                                        <p>{selectedName}</p>
                                        <div className="message__recipient">
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}

                <div className="message__status">{/* <p>Someone is typing...</p> */}</div>
            </div>
        </>
    );
};

export default ChatBody;
