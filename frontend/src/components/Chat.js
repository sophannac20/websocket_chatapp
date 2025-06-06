import React, { useEffect, useState, useRef, use } from 'react';
import io from 'socket.io-client';
import Header from './Header';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ChatBlock from './ChatBlock';

const Chat = () => {
  const token = localStorage.getItem('token');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef();
  const [chatNotifications, setChatNotifications] = useState([]);
  const socket = useRef();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {

    scrollToBottom();

    if (!token) return;

    // Connect to backend
    socket.current = io('http://localhost:4000', {
      auth: {
        token
      }
    });

    // Fetch user info
    fetch('http://localhost:4000/api/auth/me', {
      headers: { 'x-auth-token': token }
    }).then(res => res.json()).then(userData => {
      setUser(userData);
    });

    socket.current.emit('authenticate', token);

    socket.current.on('authenticated', (username) => {
      console.log(username)
      setChatNotifications(prev => [
      ...prev,
      { type: "join", text: `${username} has joined the chat`, time: new Date().toLocaleTimeString() }
    ]);
      // socket.current.on('receiveMessage', (msg) => {
      //   setMessages(prev => [...prev, msg]);
      // });
    });

    socket.current.on('userDisconnected', (userId) => {
      // alert(`user ${userId} just leave!`);
      console.log(`user ${userId} leaved!`)
      setChatNotifications(prev => [
      ...prev,
      { type: "leave", text: `${userId} has leaved the chat`, time: new Date().toLocaleTimeString() }
      ]);
    });

    socket.current.on("updateTypingUsers", (users) => {
      setTypingUsers(users);
    });

    socket.current.on("receiveMessage", (message) => {
      // console.log("📨 Message received:", message);
      setMessages(prev => [...prev, message]);
    });

    socket.current.on('userList', (users) => {
      console.log('Current users online:', users);
    });

    socket.current.on('unauthorized', () => {
      alert('Authentication failed!');
      window.location.href = '/signin';
    });

    // userDisconnected

    return () => {
      socket.current.disconnect();
    };

  }, [token, messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const fullMessage = {
      text: message,
      username: user.username,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    socket.current.emit('sendMessage', fullMessage);

    socket.current.emit('stopTyping', user.username); // Clear typing status
    setMessage('');
  };

  return (
    <>
      <div>
        <Header isloggedin={true} typingUsers={typingUsers.filter(name => name !== user?.username)} user={user}/>

        <ChatBlock messages={messages} user={user} chatNotifications={chatNotifications} messagesEndRef={messagesEndRef} />
        
        {/* input Label */}
        <Form onSubmit={sendMessage}>
          <InputGroup className="mb-3" style={{ padding: '0px 5px' }}>
            <Form.Control
              placeholder="Write a message..."
              aria-label="Write a message..."
              aria-describedby="basic-addon2"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (e.target.value.trim() !== '') {
                  socket.current.emit('typing', user.username); // Notify others
                } else {
                  socket.current.emit('stopTyping', user.username); // Stop typing
                }
              }}
            />
            <Button type='submit' style={{ width: '60px' }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </>
  );
};

export default Chat;