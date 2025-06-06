import React, { useEffect, useState, useRef } from 'react';
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
  const socket = useRef();

  const fetchUsername = async (userId) => {
  try {
    const res = await fetch(`http://localhost:4000/api/auth/${userId}`);
    const data = await res.json();
    return data.username;
  } catch (err) {
    console.error("Error fetching username:", err);
    return "Unknown";
  }
};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {

    if (!token) return;

    scrollToBottom();

    // Fetch user info
    fetch('http://localhost:4000/api/auth/me', {
      headers: { 'x-auth-token': token }
    }).then(res => res.json()).then(userData => {
      setUser(userData);
    });

    // Connect to backend
    socket.current = io('http://localhost:4000', {
      auth: {
        token
      }
    });

    socket.current.emit('authenticate', token);

    socket.current.on('authenticated', async (userId) => {
      const username = await fetchUsername(userId)
      setMessages(prev => [
        ...prev,
        { type: "notify", 
          text: `${username} has joined the chat`, time: new Date().toLocaleTimeString() }
      ]);
    });

    socket.current.on('userDisconnected', async (userId) => {
      const username = await fetchUsername(userId)
      setMessages(prev => [
        ...prev,
        {
          type: "notify",
          text: `${username} has leaved the chat`, time: new Date().toLocaleTimeString()
        }
      ]);
    });

    socket.current.on("updateTypingUsers", (users) => {
      setTypingUsers(users);
    });

    socket.current.on("receiveMessage", (message) => {
      // console.log("📨 Message received:", message);
      setMessages(prev => [...prev, message]);
    });

    // socket.current.on('userList', (users) => {
    //   console.log('Current users online:', users);
    // });

    socket.current.on('unauthorized', () => {
      alert('Authentication failed!');
      window.location.href = '/signin';
    });

    // userDisconnected
    return () => {
      socket.current.disconnect();
    };

  }, [token]);

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
        <Header isloggedin={true} typingUsers={typingUsers.filter(name => name !== user?.username)} user={user} />

        <ChatBlock messages={messages} user={user} messagesEndRef={messagesEndRef} />

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