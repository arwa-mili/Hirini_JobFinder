import React from 'react';
import './Chat.css';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogoSearch from '../components/LogoSearch/LogoSearch';
import { userChats } from '../utils';
import NavIcons from '../components/NavIcons/NavIcons';
import ChatBox from '../components/ChatBox/ChatBox';
import Conversation from '../components/Conversation/Conversation';
import { io } from "socket.io-client";

const Chat = () =>
{
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    //const [chats, setChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);


    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    //console.log(user);



    const socket = useRef();
    // Connect to Socket.io
    useEffect(() =>
    {
        socket.current = io('http://localhost:8600');
        socket.current.emit("new-user-add", user._id);
        socket.current.on('get-users', (users) =>
        {
            setOnlineUsers(users)
        })
    }, [user])


    // Send Message to socket server
    useEffect(() =>
    {
        if (sendMessage !== null)
        {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);


    // Get the message from socket server
    useEffect(() =>
    {
        socket.current.on("recieve-message", (data) =>
        {
            console.log(data)
            setReceivedMessage(data);
        }

        );
    }, []);

    useEffect(() =>
    {
        const getChats = async () =>
        {
            try
            {
                const { data } = await userChats(user._id)
                setChats(data)
                //console.log(data)


            } catch (error)
            {
                console.log(error)
            }
        }
        getChats()
    }, [user])

    const [chats, setChats] = useState([]);

    return (
        <div className='Chat'>
            {/*left side */}
            <div className="Left-side-chat">
                <LogoSearch />
                <div className="Chat-container">
                    <h2>Chat</h2>
                    <div className="Chat-list">
                        {chats.map((chat) => (
                            <div onClick={() => setCurrentChat(chat)}>
                                <Conversation data={chat}
                                    currentUser={user._id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* right side */}
            <div className="Right-side-chat">
                <div style={{ width: "20rem", alignSelf: "flex-end" }}>
                    <NavIcons />
                </div>
                <ChatBox
                    chat={currentChat}
                    currentUser={user._id}
                    setSendMessage={setSendMessage}
                    receivedMessage={receivedMessage}
                />
            </div>
        </div>
    )
}

export default Chat