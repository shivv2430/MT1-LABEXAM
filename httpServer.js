// ==============================================================================
// Part A: Employee Management System using Core Node.js HTTP & FS Modules
// File: httpServer.js
// Port: 3000
// ==============================================================================

// 1. Import built-in Node.js modules
// http: allows Node.js to transfer data over the Hyper Text Transfer Protocol
// fs: allows Node.js to work with the computer's file system (reading/writing files)
// path: provides utilities for working with file and directory paths
const http = require('http');
const fs = require('fs');
const path = require('path');

// 2. Define the Server Port
const PORT = 3000;

// 3. In-memory storage for employees using a JavaScript Array
// Initial sample records matching the required structure:
// id, name, employeeId, department, salary
let employees = [
  {
    id: 1,
    name: "Rahul Sharma",
    employeeId: "EMP101",
    department: "IT",
    salary: 45000
  },
  {
    id: 2,
    name: "Priya Patel",
    employeeId: "EMP102",
    department: "Human Resources",
    salary: 50000
  },
  {
    id: 3,
    name: "Aman Verma",
    employeeId: "EMP103",
    department: "Finance",
    salary: 55000
  }
];

// Helper variable to auto-increment employee id
let nextId = 4;

// 4. Create the HTTP Server
// http.createServer() takes a callback function with two arguments:
// req (IncomingMessage): contains request method, url, headers, and data streams
// res (ServerResponse): used to send back status code, headers, and response body
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(`[${new Date().toLocaleTimeString()}] ${method} request received for ${url}`);

  // --------------------------------------------------------------------------
  // ROUTE 1: GET / -> Serve index.html welcome page
  // --------------------------------------------------------------------------
  if (method === 'GET' && url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    
    // Read the HTML file asynchronously using fs.readFile
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          success: false, 
          message: 'Internal Server Error: Unable to read index.html' 
        }));
      }

      // 200 OK: Set Content-Type header to text/html
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  }

  // --------------------------------------------------------------------------
  // ROUTE 2: GET /about -> Serve about.html page
  // --------------------------------------------------------------------------
  else if (method === 'GET' && url === '/about') {
    const filePath = path.join(__dirname, 'about.html');
    
    // Read about.html using FS module
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          success: false, 
          message: 'Internal Server Error: Unable to read about.html' 
        }));
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  }

  // --------------------------------------------------------------------------
  // ROUTE 3: GET /employees -> Return all employees in JSON format
  // --------------------------------------------------------------------------
  else if (method === 'GET' && url === '/employees') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: employees.length,
      data: employees
    }, null, 2));
  }

  // --------------------------------------------------------------------------
  // ROUTE 4: POST /add-employee -> Add a new employee to the array
  // --------------------------------------------------------------------------
  else if (method === 'POST' && url === '/add-employee') {
    let body = '';

    // Node.js HTTP server receives request body in chunks (data streams)
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // 'end' event fires when the full payload has been received
    req.on('end', () => {
      try {
        // Parse incoming JSON string to JavaScript object
        const parsedData = JSON.parse(body);
        const { name, employeeId, department, salary } = parsedData;

        // Validation 1: Check for missing required fields
        if (!name || !employeeId || !department || salary === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            message: 'Validation Error: Please provide name, employeeId, department, and salary.'
          }));
        }

        // Validation 2: Check for duplicate employeeId
        const existingEmployee = employees.find(
          emp => emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase()
        );
        if (existingEmployee) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            message: `Validation Error: Employee with employeeId '${employeeId}' already exists.`
          }));
        }

        // Create new employee record with auto-incremented id
        const newEmployee = {
          id: nextId++,
          name: name.trim(),
          employeeId: employeeId.toString().trim(),
          department: department.trim(),
          salary: Number(salary)
        };

        // Add to in-memory array
        employees.push(newEmployee);

        // Respond with 201 Created status code
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Employee added successfully',
          data: newEmployee
        }, null, 2));

      } catch (parseError) {
        // Handle invalid JSON format in request body
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid JSON format in request body.'
        }));
      }
    });
  }

  // --------------------------------------------------------------------------
  // INVALID ROUTE HANDLER (404 Not Found)
  // --------------------------------------------------------------------------
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: `Route not found: ${method} ${url}`
    }));
  }
});

// 5. Start listening on the specified port
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Part A: HTTP Server is running on http://localhost:${PORT}`);
  console.log(` Available routes:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/about`);
  console.log(`   GET  http://localhost:${PORT}/employees`);
  console.log(`   POST http://localhost:${PORT}/add-employee`);
  console.log(`=======================================================`);
});
