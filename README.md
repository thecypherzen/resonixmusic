# <img src="https://github.com/gabrielisaacs/resonix/raw/main/frontend/public/logo-grad.png" alt="Resonix Logo" width="auto" height="28" style="vertical-align: middle; margin-right: 10px"/> Music

A modern, full-stack music streaming application that provides seamless music playback experience with a sleek user interface with loyalty-free tracks, playlists and albums download capabilities. Powered by React, Node.js, and the Jamendo Music API.

🌐 <a href="https://resonix.vercel.app" target="_blank">Try Resonix</a>

## 🌟 Features

- **🎨 Modern UI/UX**
  - Sleek, responsive design
  - Dark mode interface
  - Custom animations and transitions
  - Framer Motion integrations

- **🎵 Music Playback**
  - High-quality audio streaming
  - Gapless playback
  - Queue management
  - Shuffle and repeat modes
  - Real-time progress bar
  - Volume controls

- **📚 Content Management**
  - Playlist creation and management
  - Album browsing
  - Artist profiles
  - Track details
  - Search functionality

- **👤 User Features**
  - User authentication with Jamendo Oauth2
  - Profile customization
  - Favorites management
  - Social sharing

- **🔧 Technical Features**
  - Public API with Swagger documentation
  - Real-time updates
  - Caching system
  - Responsive image loading
  - Error boundary handling

## 🛝 Getting Started

### 🧩 Prerequisites

- Node.js (v16 or higher)
- npm (or yarn)
- Redis (optional, for caching)


### 🌟 Features

- 🎵 Stream music from Jamendo Music's extensive library
- 🎨 Modern and responsive UI built with TailwindCSS
- 📱 Cross-platform compatibility
- 🎼 Real-time music playback controls
- 📋 Playlist management
- 🔍 Advanced search functionality
- 👤 User authentication and profiles
- 💾 Favorites and history tracking
- ⬇️ Tracks, albums and playlist downloads to local machine

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router DOM
- React Icons/Lucide React
- Context API
- Axios

### Backend
- Node.js
- Express
- Swagger/OpenAPI
- CORS
- Axios
- Redis

### APIs
- Jamendo Music API

## 📂Project Structure
<pre>
resonix/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── README.md
</pre>

## 🚀 <span id="deployment">Deployment</span>

### Live Demo
- Production: [resonix.vercel.app](https://resonix.vercel.app)
- API Docs: [resonix.vercel.app/docs](https://resonix.vercel.app/docs)


## 📚 API Documentation
API documentation is available at <a href="#deployment">/docs</a>. Built with Swagger/OpenAPI, it provides:

- Detailed endpoint descriptions
- Request/response examples
- Authentication requirements
- Testing interface


## Usage Guidelines & Installation

1. Clone the repository
    ```bash
    git clone https://github.com/gabrielisaacs/resonix.git
    cd resonix
    ```

2. Install dependencies for frontend
    ```bash
    cd frontend
    npm install
    ```

3. Install dependencies for backend
    ```bash
    cd backend
    npm install
    ```

4. Create a .env file in the backend directory
    ```env
    RXBE_PORT=your_port
    JAM_CLIENT_ID=jamendo_client_id
    JAM_CLIENT_SECRET=jamendo_secret_id
    ```

5. Start the development servers

  - **For backend:**
    ```bash
    cd backend
    npm start
    ```
  
  - **For frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

## 🤝 Contributing
1. Fork the repository

2. Create a feature branch
    ```bash
    git checkout -b feature/AmazingFeature
    ```

3. Commit changes
    ```bash
    git commit -m 'Add AmazingFeature'
    ```

4. Push to branch
    ```bash
    git push origin feature/AmazingFeature
    ```
5. Open a Pull Request


## 👥 Authors
- [Gabriel Isaac](https://github.com/gabrielisaacs)
- [William Inyam](https://github.com/gabrielisaacs)
- [Valentine Nyibiam](https://github.com/gabrielisaacs)
- [John Ajayi](https://github.com/gabrielisaacs)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/gabrielisaacs/resonix/blob/main/LICENSE) file for details.
