import React from 'react'

const ChatBlock = ({ messages, user, chatNotifications, messagesEndRef }) => {
  
  return (
    <>
      <div style={{
        height: '80vh',
        maxHeight: '80vh',
        border: '1px solid #ccc',
        overflowY: 'auto',
        padding: '10px'
      }}>
        {/* Chat Notifications (Join/Leave) */}
      {chatNotifications.map((notif, i) => (
        <div
          key={i}
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            fontSize: '0.9em',
            color: '#888',
            margin: '10px 0'
          }}
        >
          {notif.text}
          <small style={{ marginLeft: '10px', color: '#aaa' }}>{notif.time}</small>
        </div>
      ))}



        {messages.map((msg, i) => {
          const isMyMessage = msg.username === user?.username;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  backgroundColor: isMyMessage ? '#007bff' : '#f1f1f1',
                  color: isMyMessage ? 'white' : 'black',
                  padding: '15px 15px',
                  borderRadius: '10px',
                  minWidth: '17%',
                  maxWidth: '60%',
                  wordWrap: 'break-word'
                }}
              >
                {!isMyMessage && <><strong>{msg.username}</strong><br/></>}
                <span >{msg.text}</span>
                <small
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '10px',
                    fontSize: '9px',
                    opacity: 0.8
                  }}
                >
                  {msg.time}
                </small>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </>
  )
}

export default ChatBlock