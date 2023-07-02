import React, { useState, useEffect } from 'react';
import './NavBar.scss';
import Logo from '../images/logo.PNG';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ListItemIcon from '@mui/material/ListItemIcon';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import SecurityIcon from '@mui/icons-material/Security';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../utils/AuthContext.js';

import axios from './../utils/axios';

function NavBar(props) {
    const { isRole } = useAuth();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const role = JSON.parse(localStorage.getItem('role'));

    const [notifications, setNotifications] = useState();

    const logout = () => {
        localStorage.clear();
        navigate('/');
    };

    const hoaButton = () => {
        // console.log(role.role == 'admin')
        if (isRole('admin')) {
            navigate('/dashboard');
        } else if (isRole('guard')) {
            navigate('/scanner');
        } else {
            navigate('/hoa');
        }
    };

    const fetchNotifications = async () => {
        await axios.get(`notifications`).then((response) => {
            // console.log(response.data)
            setNotifications(response.data);
        });
    };

    const [anchorAvatarDropDown, setAnchorAvatarDropDown] = useState(null);
    const openAvatarDropDown = Boolean(anchorAvatarDropDown);

    const [anchorNotificationDropDown, setAnchorNotificationDropDown] = useState(null);
    const openNotificationDropDown = Boolean(anchorNotificationDropDown);

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (!notifications) return <div>Loading...</div>;

    return (
        <div id="NavBar">
            <div id="NavBar__Container">
                <div id="Logo">
                    <a href="/homes">
                        <img src={Logo} alt="" />
                    </a>
                </div>
                <ul>
                    <li>
                        <a href="/homes" className={props.type === 'home' ? 'active' : ''}>
                            Homes
                        </a>
                    </li>
                    <li>
                        <a href="/vehicles" className={props.type === 'vehicles' ? 'active' : ''}>
                            Vehicles
                        </a>
                    </li>
                    <li>
                        <a href="/visitors" className={props.type === 'visitors' ? 'active' : ''}>
                            Visitors
                        </a>
                    </li>
                    <li>
                        <IconButton onClick={() => navigate('/chat')}>
                            <ChatIcon />
                        </IconButton>
                    </li>
                    <li>
                        <IconButton onClick={(event) => setAnchorNotificationDropDown(event.currentTarget)}>
                            <NotificationsIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorNotificationDropDown}
                            id="account-menu"
                            open={openNotificationDropDown}
                            onClose={() => setAnchorNotificationDropDown(null)}
                            onClick={() => setAnchorNotificationDropDown(null)}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <div id="Notification">
                                <h5 id="Notification__Title">Notification</h5>
                                <ul>
                                    {notifications.length === 0 ? (
                                        <li>No Notifications</li>
                                    ) : (
                                        <>
                                            {notifications.length > 0 &&
                                                notifications.map((notification) => {
                                                    switch (notification.type) {
                                                        case 'VISITOR':
                                                            return (
                                                                <li>
                                                                    <a href="/visitorslist" className="active">
                                                                        {/* <Avatar/> */}
                                                                        <p className="BodyText3">{notification.message}</p>
                                                                    </a>
                                                                </li>
                                                            );
                                                        case 'DUE':
                                                            return (
                                                                <li>
                                                                    <a href={`/homes/${notification.subjectId}`} className="active">
                                                                        {/* <Avatar/> */}
                                                                        <p className="BodyText3">{notification.message}</p>
                                                                    </a>
                                                                </li>
                                                            );
                                                        case 'HOMESENT':
                                                            return (
                                                                <li>
                                                                    <a href="/homelist" className="active">
                                                                        {/* <Avatar/> */}
                                                                        <p className="BodyText3">{notification.message}</p>
                                                                    </a>
                                                                </li>
                                                            );
                                                        case 'HOMEAPPROVED':
                                                            return (
                                                                <li>
                                                                    <a href={`/homes/${notification.subjectId}`} className="active">
                                                                        {/* <Avatar/> */}
                                                                        <p className="BodyText3">{notification.message}</p>
                                                                    </a>
                                                                </li>
                                                            );
                                                    }
                                                })}
                                        </>
                                    )}
                                </ul>
                            </div>
                        </Menu>
                    </li>

                    <li>
                        <IconButton onClick={(event) => setAnchorAvatarDropDown(event.currentTarget)}>
                            <Avatar />
                        </IconButton>
                        <Menu
                            anchorEl={anchorAvatarDropDown}
                            id="account-menu"
                            open={openAvatarDropDown}
                            onClose={() => setAnchorAvatarDropDown(null)}
                            onClick={() => setAnchorAvatarDropDown(null)}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <a href={'/profile'}>
                                <MenuItem>
                                    <Avatar /> {user.user.name.firstName} {user.user.name.lastName}
                                </MenuItem>
                            </a>
                            <Divider />
                            {isRole('admin') || isRole('guard') ? (
                                <MenuItem onClick={hoaButton}>
                                    <ListItemIcon>
                                        <MapsHomeWorkIcon fontSize="small" />
                                    </ListItemIcon>
                                    Homeowners Associations
                                </MenuItem>
                            ) : (
                                <></>
                            )}

                            <MenuItem onClick={logout}>
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;
