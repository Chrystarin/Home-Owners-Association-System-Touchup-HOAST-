import React, { useState, useEffect } from 'react';
import { useAuth } from './../../utils/AuthContext.js';
import axios from '../../utils/axios';
const ChatBar = ({ socket, setSelectedUser, selectedUser, setMessages, setSelectedName }) => {
    const [users, setUsers] = useState([]);
    const { isRole } = useAuth();

    useEffect(() => {
        
        const fetchResidents = async () => {
            await axios
                .get(`residents`, {
                    params: {
                        hoaId: localStorage.getItem('hoaId')
                    }
                })
                .then((response) => {
                    // console.log(response.data);
                    setUsers(response.data);
                });
        };

        const fetchGuards = async () => {
            await axios
                .get(`hoas/guards`, {
                    params: {
                        selectedHoa: process.env.REACT_APP_HOA_ID
                    }
                })
                .then((response) => {
                    setUsers(response.data);
                });
        };
        if (isRole('guard')) {
            fetchResidents();
        } else {
            fetchGuards();
        }
    }, []);

    return (
        <div className="chat__sidebar">
            <h4 id="chat__sidebar__Title">Chats</h4>
            <div>
                <div className="chat__users">
                    {users.map((user) => (
                        <p
                            key={user.user.userId}
                            onClick={() => {
                                setSelectedUser(user.user.userId);
                                setSelectedName(user.user.name.firstName + ' ' + user.user.name.lastName);
                                setMessages([]);
                            }}
                            className={user.user.userId === selectedUser ? 'activeUser' : 'UsersList'}
                        >
                            {user.user.name.firstName} {user.user.name.lastName}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
