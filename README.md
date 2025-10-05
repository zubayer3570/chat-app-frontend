# ZEXT-SEC - End-to-End Encrypted Realtime Chat Application

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://chat-app-89528.web.app)
[![Frontend Repo](https://img.shields.io/badge/Frontend-Repo-blue)](https://github.com/zubayer3570/chat-app-frontend)
[![Backend Repo](https://img.shields.io/badge/Backend-Repo-orange)](https://github.com/zubayer3570/chat-app-backend)

An End-to-End encrypted real-time chatting application built with modern web technologies, ensuring secure and private communication between users.

## 🔐 Security Features

- **End-to-End Encryption**: Messages are encrypted on the client-side and can only be decrypted by the intended recipient
- **Diffie-Hellman Key Exchange**: Secure key exchange protocol for establishing shared secrets
- **Per-Conversation AES Encryption**: Unique encryption keys generated for each conversation
- **Multi-Device Support**: Encrypted private keys stored in database for seamless device switching
- **Offline User Handling**: Pre-shared public keys stored for messaging offline users
- **Secure Authentication**: JWT-based authentication system


## 🔒 Encryption Process for the Messages

1. **Sender**: At the start of the new conversation, sender generates a Diffie Hellman key pair, and sends the public key to the receiver
2. **Receiver**: also generate a Diffie hellman key pair and uses the private key with the sender's public key to generate an AES key. Then receiver sends the public key of the Diffie hellman back to the sender. 
3. **Sender**: recieves the public key of the reciver and uses it with his Diffie hellman private key to generate the same AES key
4. **Messaging**: After that the AES key is used to encrypt and decrypt the messages.
5. **Multi Device Support**: The private keys are encrypted with the password of the user and stored on the database for multi device support.
6. **Offline user support**: On login, each user stores some public key to the server as pre-shared keys. If the user is offline then other user can start the conversation by using the pre-shared public keys.

## 🚀 Tech Stack

### Frontend
- **React.js** - User interface library
- **Redux** - State management
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.io** - Real-time bidirectional communication
- **Multer** - File upload handling
- **JWT** - JSON Web Tokens for authentication

## 🏗️ Architecture

The application follows a client-server architecture with the following components:

1. **Client-Side Encryption**: Messages are encrypted using AES before transmission
2. **Secure Key Management**: Private keys are encrypted with user passwords before database storage
3. **Real-Time Communication**: Socket.io enables instant message delivery
4. **Persistent Storage**: MongoDB stores user data, encrypted keys, and message metadata

## ⚡ Features

- Real-time messaging with Socket.io
- User registration and authentication
- Profile image upload during registration
- Multi-device login support
- Secure message encryption/decryption
- Offline message delivery
- Responsive design

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. Clone the backend repository:
```bash
git clone https://github.com/zubayer3570/chat-app-backend.git
cd chat-app-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
nodemon index.js
```

### Frontend Setup

1. Clone the frontend repository:
```bash
git clone https://github.com/zubayer3570/chat-app-frontend.git
cd chat-app-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_SERVER_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`


## 🔗 Links

- **Live Demo**: [https://chat-app-89528.web.app](https://chat-app-89528.web.app)
- **Frontend Repository**: [https://github.com/zubayer3570/chat-app-frontend](https://github.com/zubayer3570/chat-app-frontend)
- **Backend Repository**: [https://github.com/zubayer3570/chat-app-backend](https://github.com/zubayer3570/chat-app-backend)
