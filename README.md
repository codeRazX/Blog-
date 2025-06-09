# 📰 Complete Blog with Backend and Separate Frontends

This repository contains a full-featured blog built with simple technologies and split into three main branches, each representing a different part of the system.

---

## 🔀 Branch Structure

| Branch         | Description                               |
|----------------|-------------------------------------------|
| `main`         | Public blog frontend                      |
| `admin-panel`  | Admin interface for managing the blog     |
| `backend`      | API for authentication, data, and logic   |

---

## 🛠️ Technologies Used

- **Backend**: Node.js + Express (no frameworks)
- **Database**: PostgreSQL + Prisma ORM
- **Public Frontend**: JavaScript, HTML, Sass
- **Admin Panel**: JavaScript, HTML, Sass

---

## 🧠 What Does This Blog Do?

### 🌐 Public Frontend (`main`)
- Homepage to view published blog posts
- Users can comment on articles
- Authentication is required to post comments
- Open and accessible UI for all visitors

### 🛡️ Backend (`backend`)
- RESTful API built with Express
- Authentication system (session or token-based)
- Handles users, blog posts, and comments
- Basic security for regular users, advanced for admins
- Uses PostgreSQL with Prisma for database operations

### 🔒 Admin Panel (`admin-panel`)
- Secure login for administrators
- Create, edit, and delete blog posts
- Manage users and moderate comments
- Includes internal admin tools