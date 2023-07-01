import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages }) => {
    const navigate = useNavigate();

    // console.log(messages);

    // const handleLeaveChat = () => {
    //     localStorage.removeItem('userName');
    //     navigate('/');
    //     window.location.reload();
    // };

    if (!messages) return <div>Loading...</div>;

    return (
        <>
            {/* <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header> */}

            <div className="message__container">
                {messages.length === 0 ? (
                    <p>Start a Conversation</p>
                ) : (
                    <>
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
                                    <p>{message[message.receiver].name.firstName}</p>
                                    <div className="message__recipient">
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </>
                )}

                <div className="message__status">{/* <p>Someone is typing...</p> */}</div>
            </div>
        </>
    );
};

export default ChatBody;
