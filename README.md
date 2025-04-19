# 🎓 AcademIQ

**AcademIQ** is a fully responsive full-stack web application inspired by platforms like **Udemy** and **Coursera**. It enables learners to explore, purchase, and complete courses while allowing instructors to manage content seamlessly. With advanced features like Google OAuth, Stripe payments, certificate generation, and email notifications, AcademIQ is a complete e-learning platform.

---

## 🚀 Features

- 🔐 Authentication using JWT & Google OAuth
- 🧑‍🏫 Role-based access for Students & Instructors
- 🎥 Upload video lectures using Cloudinary
- 🖼️ Upload images and PDFs using Cloudinary
- 💳 Stripe Payment Integration with Webhooks
- 📬 Email Notifications via Nodemailer:
  - Welcome Email
  - Password Reset Email
  - Course Enrollment Confirmation
  - Certificate Issuance Email
- 📜 Auto-generated Course Completion Certificate
- 🧠 Slate-based rich text editor for course content
- 📈 Instructor sales analytics with charts
- 🔍 Advanced Course Filtering:
  - By Query (search)
  - By Tags
  - By Subtitles
  - By Price Range
- ♾️ Infinite scroll to explore courses
- 🎨 Fully responsive UI with Light/Dark Theme Toggle
- 🔐 Highly Secure APIs with Authentication & Authorization
- 🛡️ Input validation and sanitization

---

## 🛠️ Tools Used
- Figma for UI/UX design
- Postman for API testing
- VS Code for development

---

## ⚙️ Tech Stack

### 🧩 Backend

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Stripe (Payments + Webhooks)**
- **Cloudinary** (Image, Video & PDF upload)
- **Google OAuth** (via Passport.js)
- **Nodemailer** (Mail services)

#### 🔌 Backend Dependencies

```bash
bcryptjs
jsonwebtoken
cookie-parser
cors
express-session
express-validator
multer
passport
nodemailer
```

---

### 🎨 Frontend

- **React.js**
- **Redux Toolkit + RTK Query**
- **Tailwind CSS**
- **Material UI**
- **Shadcn UI**
- **HTML**
- **Slate.js** (Rich text editor)
- **React Icons**
- **React Toasts**
- **React Infinite Scroll**
- **Dark/Light Mode Toggle**

---

## 📁 Folder Structure

```
academiq/
├── backend/
│   ├── controllers/
│   ├── models/
|   ├── db/
|   ├── uploads/ 
│   ├── routes/
│   ├── middlewares/
|   ├── services/
|   ├── views/
│   ├── utils/
|   └── app.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── features/ (Redux slices)
    │   ├── editor/ (Slate configuration)
    │   ├── hooks/
    │   └── App.jsx
```

---

## 🛠️ Installation

### Clone the repository
```bash
git clone https://github.com/bytexplorerr/AcademIQ.git
cd AcademIQ
```

### 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `backend/` directory with:

```env
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


## 👨‍💻 Developer

Made with ❤️ by [Devrajsinh Jethwa](https://github.com/devrajsinh-d-jethwa)
