import React from 'react'

const ChatBlock = ({ messages, user, messagesEndRef }) => {
  
  return (
    <>
      <div style={{
        height: '80vh',
        maxHeight: '80vh',
        border: '1px solid #ccc',
        overflowY: 'auto',
        padding: '10px'
      }}>
        {/* Start Chat Notifications (Join/Leave) */}
        {messages.map((msg, i) => {
          if (msg.type === 'notify'){
            return (
            <div
              key={i}
              style={{
                textAlign: 'center',
                fontSize: '0.9em',
                fontStyle: 'italic',
                color: '#888',
                margin: '10px 0'
              }}
            >
              {msg.text}
              <small style={{ marginLeft: '10px', color: '#aaa' }}>{msg.time}</small>
            </div>
          );
          }
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