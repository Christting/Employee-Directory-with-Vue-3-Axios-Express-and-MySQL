# UTM HR Employee Management System - Backend Server

**Name:** CHRIST TING SHIN LING  
**Matric No:** A24CS5050  
**Course:** Web Application Development  
**Stack:** Vue 3 · Vite · Axios · Express · MySQL  

---
This is the backend RESTful API server for the UTM HR Employee Management System, built using **Node.js**, **Express**, and **mysql2/promise**. It executes secured database interaction layers powered by a centralized connection pool.

## Tech Stack & Architecture
* **Express.js Framework**: Handles decoupled routing for client communication logic.
* **MySQL Database Pool**: Integrated via `mysql2/promise` to support asynchronous connection recycling, optimizing performance barriers under traffic.
* **Prepared Statements (`?`)**: Sanitizes incoming parameters dynamically to neutralize SQL Injection threat vectors.
* **Server-Side Filtering Matrix**: Processes dynamic string matching via SQL `LIKE` operators and enforces whitelist checks against illegal sorting parameter columns.
* **CORS Middleware**: Enabled to bridge resource-sharing handshakes safely with the Vue 3 frontend pipeline running on port 5173.

## Setup Instructions

### Prerequisites
* Laragon (Full edition) with MySQL running on port 3306
* Node.js 24+ and npm installed globally

### 1. Database Setup
1. Open HeidiSQL via Laragon.
2. Create a database named utm_employee_db.
3. Go to File -> Load SQL file -> select sql/schema.sql from this project directory.
4. Press F9 to execute the database script.
5. Verify: 7 initial employee records appear successfully in the database table.

### 2. Backend Server Execution (Port 3001)
cd server
npm install
node index.js

Expected output: Backend server is running on http://localhost:3001

### 3. Frontend Client Interface Execution (Port 5173)
cd frontend
npm install
npm run dev

Open your local browser gateway and navigate inside the development routing target at http://localhost:5173/

---

## Architecture Flow
Browser Client (Port 5173) <——> Express API Server (Port 3001) <——> MySQL Database (Port 3306)
[ Vue 3 + Vite ]             [ Node.js v24 ]                  [ Laragon Engine ]

---

## Key Technical Notes

* **Secured Prepared Statements**: All SQL queries (INSERT, DELETE, SELECT) leverage parameterized queries (? placeholders) instead of raw string concatenation to completely eliminate SQL injection threat surfaces.
* **Centralized Axios Architecture**: Implemented a standalone custom Axios instance (src/services/api.js) handling automated request console tracking and customized response interceptors for immediate runtime error mapping and user-friendly toast error alerts.
* **Server-Side Filter Pipeline**: Dynamic multi-column fuzzy search handling LIKE matching expressions across fields (name, empId, email) alongside strict column sorting validation whitelists (name, hireDate, salary) processed directly on the server layer.
* **Advanced Form Validation**: Enforces pattern matching regex boundaries (^EMP[0-9]{3,5}$) and strict financial bounds checking (RM 1,500 - RM 50,000) using Vue .trim and .number modifiers before any API dispatch.
* **Premium Responsive UX**: Styled with a fluid Minimalist Cream Theme layout. Features an interactive top-collapsible hidden input card layout that toggles smoothly on user click and scales responsively down to a 1-column layout under mobile screen width break points.