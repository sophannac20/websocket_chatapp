import React from 'react'

const typingIcons = () => {
    const loaderStyle = {
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        margin: '20px auto'
    };

  return (
    <div style={loaderStyle}></div>
  );
}

export default typingIcons