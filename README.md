# Employee Management Web Application
**Course:** Full Stack Development (FSD) — MT1 Lab Exam  
**Student:** Shivani Pal  
**Repository:** [https://github.com/shivv2430/MT1-LABEXAM.git](https://github.com/shivv2430/MT1-LABEXAM.git)  
**Tech Stack:** Node.js, JavaScript ES6, HTTP Module, FS Module, Express.js (In-Memory Array Storage)

---

## 1. Project Overview

This project consists of two independent, production-grade learning applications built without an external database:
1. **Part A (`httpServer.js`)**: A raw Node.js HTTP server running on port **3000**, using core built-in `http` and `fs` modules to serve static HTML pages and handle JSON API requests.
2. **Part B (`expressApp.js`)**: A RESTful API built with **Express.js** running on port **4000**, implementing complete CRUD (Create, Read, Update, Delete) operations with validation and status codes.

---

## 2. Project Directory Structure

```text
MT1-LABEXAM/
│
├── package.json          # Project metadata, dependencies, and start scripts
├── package-lock.json     # Locked dependency tree
├── .gitignore            # Ignores node_modules
├── README.md             # Complete lab exam documentation and viva guide
├── httpServer.js         # Part A: Node.js Core HTTP + FS Server (Port 3000)
├── expressApp.js         # Part B: Express.js REST API Server (Port 4000)
├── index.html            # Welcome page served by Part A
├── about.html            # About page served by Part A
├── screenshots/          # Directory to store Postman & browser screenshots
└── node_modules/         # Installed dependencies (Express.js)
```

---

## 3. How to Run the Applications

Ensure you are inside the project folder:
```bash
cd /Users/ShivaniPal/Desktop/MT1-LABEXAM
```

### Running Part A (Core HTTP Server - Port 3000)
```bash
node httpServer.js
# Or via npm script:
npm run start:http
```
* **URL:** `http://localhost:3000`

### Running Part B (Express REST API - Port 4000)
```bash
node expressApp.js
# Or via npm script:
npm run start:express
```
* **URL:** `http://localhost:4000`

---

## 4. Endpoints & Postman Testing Guide

### Part A: HTTP Server (`http://localhost:3000`)

| Method | Endpoint | Description | Content-Type | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Welcome page (reads `index.html` via FS) | `text/html` | `200 OK` |
| **GET** | `/about` | About page (reads `about.html` via FS) | `text/html` | `200 OK` |
| **GET** | `/employees` | List all employees in JSON | `application/json` | `200 OK` |
| **POST** | `/add-employee` | Add a new employee | `application/json` | `201 Created` / `400 Bad Request` |

#### Sample POST Body (`/add-employee`):
```json
{
  "name": "Neha Gupta",
  "employeeId": "EMP104",
  "department": "Marketing",
  "salary": 48000
}
```

---

### Part B: Express.js REST API (`http://localhost:4000`)

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/employees` | Retrieve all employees | `200 OK` |
| **GET** | `/employees/:id` | Retrieve single employee by ID (e.g., `/employees/1`) | `200 OK` / `404 Not Found` |
| **POST** | `/employees` | Add a new employee (validates duplicates & fields) | `201 Created` / `400 Bad Request` |
| **PUT** | `/employees/:id` | Update employee details by ID | `200 OK` / `404 Not Found` |
| **DELETE** | `/employees/:id` | Delete employee by ID | `200 OK` / `404 Not Found` |

#### Sample Requests for Part B:

1. **POST `/employees`** (Headers: `Content-Type: application/json`):
```json
{
  "name": "Vikram Singh",
  "employeeId": "EMP105",
  "department": "Engineering",
  "salary": 62000
}
```

2. **PUT `/employees/2`**:
```json
{
  "department": "Lead HR",
  "salary": 56000
}
```

3. **DELETE `/employees/1`**:
Deletes employee with ID 1 and returns the deleted record.

---

## 5. Lab Examination Viva Guide

### Q1: What is the difference between Node.js HTTP module and Express.js?
* **Node.js HTTP module**: Built directly into Node.js runtime. Requires manual stream chunk concatenation (`req.on('data')`, `req.on('end')`), manual header setting (`res.writeHead`), and manual URL routing logic.
* **Express.js**: A minimalist web framework on top of Node.js HTTP. It simplifies routing (`app.get`, `app.post`), provides powerful middleware (`express.json()`), handles route parameters (`req.params`), and auto-formats responses (`res.status(200).json(...)`).

### Q2: What is Middleware in Express.js?
* Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application’s request-response cycle. Example: `app.use(express.json())` automatically intercepts incoming JSON payloads, parses them, and populates `req.body`.

### Q3: Why is status code 201 used instead of 200 on POST?
* Status `200 OK` indicates general success.
* Status `201 Created` specifically indicates that the request has succeeded and led to the creation of a new resource (such as a new employee record).

### Q4: How does the FS module work in Part A?
* `fs.readFile(filePath, 'utf8', callback)` is used to read `index.html` and `about.html` asynchronously from the file system without blocking the single-threaded Node.js event loop.
