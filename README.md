# 🏡 Devconnect Backend 

- A Node.js + Express + TypeScript backend for **DevConnect**, a developer-focused social platform. Supports user authentication, post creation, comments, likes, replies, and following/follower functionality.
---

## 🌐 Live API
## 🚀 Live Deployment

- Backend: [Render](https://devconnect-backend-wos6.onrender.com)
- Frontend: [Vercel](https://devconnect-frontend-taupe.vercel.app/)

## 🚀 Features

- ✅ User Signup & Login with token authentication
- 📝 CRUD for Posts
- 💬 Nested Comments and Replies
- ❤️ Like/Unlike Posts
- 👥 Follow/Unfollow Users
- 🔐 Protected Routes via JWT middleware

## 🧰 Tech Stack

- *Node.js*
- *Express*
- *TypeScript*
- *MongoDB* with *Mongoose*
- *JWT* for Authentication
- *Render* for deploymen

---

## Related repositories

- **Frontend**: [devconnect-frontend](https://github.com/prateekbalawat/devconnect-frontend)

---

PI Endpoints (High-level)

🔐 Auth

- POST /api/auth/register

- POST /api/auth/login


👤 Users

- GET /api/users/:email/posts

- POST /api/users/:email/follow

- POST /api/users/:email/unfollow

- GET /api/users/:email/followers

- GET /api/users/:email/following


📫 Posts

- GET /api/posts

- POST /api/posts

- PUT /api/posts/:id

- DELETE /api/posts/:id

- GET /api/posts/following/:email


💬 Comments & Replies

- POST /api/posts/:postId/comment

- PUT /api/posts/:postId/comment/:commentIndex

- DELETE /api/posts/:postId/comment/:commentIndex

- POST /api/posts/:postId/comment/:commentIndex/reply

- PUT /api/posts/:postId/comment/:commentIndex/reply/:replyIndex

- DELETE /api/posts/:postId/comment/:commentIndex/reply/:replyIndex

