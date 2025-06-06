import React from 'react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import Avatar from 'react-avatar';

const Header = ({ user, typingUsers, isloggedin = false }) => {

    const handleLogout = () => {
        // setIsLoggedIn(false);
        localStorage.removeItem("token");
        window.location.href = '/signin';
    };

    // function formatTypingMessage(users) {
    //     const count = users.length;
    //     let exists = users.includes(user?.username)
    //     if (count === 0) return '';
    //     if (count === 1) return `${users[0] === user.username ? '' : `${users[0]} is typing...`}`;
    //     // if (count === 2) return `${users[0] === user.username ? `${users[1]} is typing...` : `${users[0]} is typing...`}`;
    //     if (count >= 2)
    //         return `${users[0]}, ${users[1]}, and ${count - 1} others are typing...`;
    // }

    const formatTypingMessage = (typingUsers) => {
        const count = typingUsers.length;

        if (count <= 0) return '';

        if (count === 1) {
            return `${typingUsers[0]} is typing...`;
        }

        if (count === 2) {
            return `${typingUsers[0]}, ${typingUsers[1]} are typing...`;
        }

        if (count > 2) {
            return 'Several people are typing...';
        }
    };

    return (
        <Navbar bg="dark" variant="dark" className="py-1 px-1">
            <Container fluid>
                {/* App Name / Logo */}
                <Navbar.Brand className="me-auto">
                    <div className='d-flex align-items-center'>
                        <div className="appIcon" style={{ float: 'left' }} ></div>
                        <div>
                            <div className='d-flex align-items-center'>
                                <strong className='px-2'> Chat App </strong>
                            </div>
                            {isloggedin ? <>
                                {typingUsers.length > 0 ? <>
                                    <div className='d-flex align-items-center' style={{ marginLeft: '1.3rem' }}>
                                        <div className="loader"></div>
                                        <span style={{ float: 'left', fontWeight: 'bold', fontSize: '10px', marginLeft: '2px' }}>
                                            {/* {formatTypingMessage(typingUsers)} hello
                                        username */}
                                            {formatTypingMessage(typingUsers)}
                                            {/* {user?.username} */}
                                        </span>
                                    </div>
                                </> : <> <div style={{ marginLeft: '2rem', height: '15px' }} /> </>}
                            </> : <><div style={{ marginLeft: '2rem', height: '15px' }} /></>}
                        </div>
                    </div>
                </Navbar.Brand>

                {isloggedin && <>
                    {/* User Dropdown */}
                    <div className="d-flex align-items-center">
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="dark" id="user-dropdown" className="rounded p-2">
                                <Avatar
                                    name={user?.username}
                                    size="32"
                                    maxInitials='2'
                                    round={true}
                                    color="#007bff"     // Background color
                                    fgColor="#fff"      // Text color
                                    className="me-2"
                                />
                                <span className="fw-bold">{user?.username}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleLogout} className="text-danger">
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </>
                }

            </Container>

        </Navbar>

    );
}

export default Header;