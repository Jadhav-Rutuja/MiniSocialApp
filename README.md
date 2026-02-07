# Social Media Web Application

## Project Overview

This project is a full-stack social media web application where users can create posts, like posts, comment, follow other users, and view user profiles. Each user has a personal profile page showing their posts and information.

The application is designed to demonstrate full-stack development concepts including authentication, REST APIs, database operations, and interactive UI.

## Features

### User Features
* User registration and login
* View profile
* Follow / Unfollow users
* Search posts and users

### Post Features
* Create posts with text and image
* Edit posts
* Delete posts
* Like posts
* Comment on posts
* View posts of other users

### Profile Features
* View own profile
* View other users' profiles
* See all posts of a specific user

### Additional Features
* Pagination / Load more posts
* Notifications (basic logic)
* Avatar fallback system

## Technologies Used

### Frontend
* React.js
* Axios
* CSS / Inline Styling

### Backend
* Node.js
* Express.js

### Database
* MongoDB

### Authentication
* JWT (JSON Web Token)

## Project Structure

```
project-root
│
├── frontend
│   ├── components
│   │   ├── Header.js
│   │   ├── ProfilePage.js
│   │
│   ├── pages
│   │   ├── SocialPage.js
│   │
│   ├── services
│   │   ├── api.js
│
├── backend
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── server.js
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository
```
git clone (https://github.com/Jadhav-Rutuja/MiniSocialApp.git)
cd MiniSocialApp
```

### 2. Install dependencies

Frontend:
```
cd frontend
npm install
npm start
```

Backend:
```
cd backend
npm install
npm start
```

## Environment Variables
Create a `.env` file in the backend folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

## Future Improvements
* Real-time chat
* Story feature
* Notifications system with WebSockets
* Image upload using Cloudinary
* Dark mode

## Author
Rutuja Jadhav

## License
This project is for educational purposes.
