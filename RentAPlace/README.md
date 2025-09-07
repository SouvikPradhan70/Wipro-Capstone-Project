
# 🏠 RentAPlace - Capstone Project

Capstone Project built using **ASP.NET Core Web API (Backend)** and **Angular (Frontend)**.  
It is an online rental platform that connects **Users (Renters)** and **Owners** for short and long-term property rentals.

---

## 📌 Problem Statement
Renting homes is often difficult due to the lack of a centralized platform.  
**RentAPlace** solves this by providing a platform where:
- Users can **search, book, and message owners**
- Owners can **list, manage, and confirm reservations**

---

## 🚀 Features

### 👤 For Users (Renters)
- Register, Login, Logout
- Search properties with filters (location, type, features)
- View property details with images
- Reserve a property
- Message the owner

### 🏠 For Owners
- Register, Login, Logout
- Add, update, delete properties
- View reservations & messages
- Confirm reservations
- Receive email notifications

---

## 🛠 Tech Stack
- **Frontend:** Angular
- **Backend:** ASP.NET Core Web API
- **Database:** SQL Server (Entity Framework Core)
- **Authentication:** JWT
- **Documentation:** Swagger

---

## ⚙️ Installation & Setup

### 🔧 Backend (.NET Core API)
1. Clone the repository  
2. Navigate to the backend folder  
3. Run the project:
   ```bash
   dotnet run
   ```
4. API will be available at `https://localhost:5001/swagger`

### 🎨 Frontend (Angular)
> ⚠️ Note: `node_modules` is removed from the zip to reduce size. You must install dependencies first.

1. Navigate to the frontend folder  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular project:
   ```bash
   ng serve
   ```
4. App will run on `http://localhost:4200/`

---

## 🔗 API Documentation (Swagger)
Swagger UI is integrated for API testing and documentation.  
- Example APIs:  
  - `POST /api/Users/login` → User Login  
  - `POST /api/Users/register` → User Registration  
  - `GET /api/Properties` → Fetch properties  
  - `POST /api/Reservations` → Reserve property  

---

## 📊 Database
Database is implemented using **SQL Server** with **Entity Framework Core**.  
[Placeholder: Insert ER Diagram Image]

---

## 📷 Screenshots
- [Placeholder: Insert UI screenshots]  
- [Placeholder: Insert Swagger API screenshots]

---

## 📅 Sprint Plan
- **Sprint I:** Use Case, DB Schema, Controllers  
- **Sprint II:** User Management, Property CRUD  
- **Sprint III:** Search, Reservation, Notifications  

---

## 👥 Contributors
- **Souvik Pradhan**

---

## 🙏 Acknowledgements
- Inspired by Airbnb for design reference  
- Thanks to trainers & mentors for guidance
