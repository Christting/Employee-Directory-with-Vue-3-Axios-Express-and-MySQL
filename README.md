# Employee Directory — Chapter 8 Individual Assignment

**Student Information**
* **Name:** Christ Ting Shin Ling
* **Matric Number:** A24CS5050
* **Course:** Cross Platform Application Development
* **Stack:** Vue 3 (Composition API) · Vite · Axios · Express.js · Node.js · MySQL

---

## Project Overview
This project is a premium full-stack Employee Directory web application tailored for internal organizational staff records management. It is styled around an elegant, responsive soft-dashboard card layout utilizing blur backdrop filters and custom neon purple/blue gradient accents.

The system empowers human resource coordinates to perform secure dynamic data operations across separated client-server architectural networks.

---

## Technical Architecture & Features

### 1. Frontend Capabilities
* **Vue 3 Composition API**: Structured entirely using decoupled, reusable components (EmployeeForm.vue and EmployeeList.vue) driven by stateful properties (props) and event triggers (emits).
* **Advanced Inline Validation**: Real-time form evaluation using localized state regex patterns to validate Employee IDs (^EMP[0-9]{3,5}$) and strict financial baseline boundaries (RM 1,500 - RM 50,000).
* **Centralized Axios Interceptors**: Managed lifecycle network pipelines that intercept outgoing payloads for request telemetry logging, alongside response handlers mapping connection anomalies into browser alerts.
* **Localization Currency Formatting**: Integrates the native JavaScript Intl.NumberFormat('ms-MY') utility matrix to output financial compensation entries accurately inside Malaysian Ringgit (MYR) currency syntax.

### 2. Backend API Worker
* **Express.js Service API**: Production-ready decoupled RESTful framework mapping secure asynchronous data exchange pathways.
* **Secured Prepared Statements**: All active transactional database requests (INSERT, DELETE, SELECT) leverage parameterized placeholders (?) to encapsulate strings, completely neutralizing SQL Injection threat factors.
* **Server-Side Filter Matrix**: Dynamically appends dynamic query criteria to pull multi-column fuzzy match constraints (LIKE operands across name, empId, and email) and enforces column verification whitelists directly on the database engine level.

---

## Project Structure Diagram
```text
Chapter8_A24CS5050_ChristTingShinLing/
├── frontend/     # Vue 3 Client Application (Vite Server gateway)
├── server/       # Node.js Express Backend REST API Worker
├── sql/          # Database Schema blueprints & Seed records scripts
├── README.md     # Master Portfolio documentation summary page
└── report.pdf    # Final comprehensive systems engineering analysis report
\`\`\`



## Setup Instructions

### 1. Database Setup

Open MySQL or Laragon and run:

```sql
sql/schema.sql
```

---

### 2. Backend Setup

```bash
cd server
npm install
node index.js
```

Backend runs on:

```text
http://localhost:3001
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5174
```

---

## Features

- Add Employee
- Edit Employee
- Delete Employee
- Employee Search
- Employee Sorting
- Form Validation
- Axios Interceptors
- Loading State
- Error Handling
- Responsive Design

---