# Sweet Shop Management System  
A full-stack role-based sweet shop management system with dashboards, authentication, and complete sweet inventory management.

Built using:
- **React + TypeScript + Redux Toolkit** (Frontend)
- **Node.js + Express + TypeScript + Prisma** (Backend)
- **PostgreSQL** (Database)

---

# 🎯 Overview
A complete management system for a sweet shop featuring:
- Secure JWT authentication  
- Role-based access (Admin & Customer)  
- Inventory management  
- Purchase workflow  
- Search, filtering, and sweet categorization  
- REST APIs with Zod validation  
- TDD setup (Jest + Supertest)

---

# 👥 User Roles

## 🔐 Admin (ROLE: `ADMIN`)
**Dashboard:** `/admin-dashboard`

Admin can:
- ➕ Add Category  
- 🍬 Add Sweet  
- ✏️ Edit Sweet  
- ❌ Delete Sweet  
- 🔍 Search Sweets  
- 📦 Restock inventory  

---

## 👤 Customer (ROLE: `CUSTOMER`)
**Dashboard:** `/user-dashboard`

Customer can:
- 👀 View available sweets  
- 🔍 Search sweets  
- 🛒 Purchase sweets with correct quantity  

---

# 🛠️ Tech Stack

### Frontend
- React + TypeScript  
- Redux Toolkit (RTK)  
- Tailwind CSS  
- Axios  

### Backend
- Node.js (Express)  
- TypeScript  
- Prisma ORM  
- JWT Authentication  
- Zod Validation  
- Jest + Supertest (TDD)

### Database
- PostgreSQL  

---

# 🧠 State Management (Redux)

### Slices
- **userData** → Auth info (token, user object)  
- **sweets** → Sweet CRUD + search + loading  
- **categories** → Category CRUD  

---

# ❗ Error Handling
- Custom messages for FK constraint failures  
- JWT & token validation  
- Global loading + error states in RTK  
- Guards using `useEffect`  
- `.addCase` and `.addMatcher` for clean reducers  

---

# ⚙️ Setup Instructions

### 1️⃣ Install dependencies
```sh
npm install
