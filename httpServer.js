const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

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
let nextId = 4;

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  console.log(`[${new Date().toLocaleTimeString()}] ${method} request received for ${url}`);

  if (method === 'GET' && url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: false,
          message: 'Internal Server Error: Unable to read index.html'
        }));
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else if (method === 'GET' && url === '/about') {
    const filePath = path.join(__dirname, 'about.html');
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
  } else if (method === 'GET' && url === '/employees') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: employees.length,
      data: employees
    }, null, 2));
  } else if (method === 'POST' && url === '/add-employee') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedData = JSON.parse(body);
        const { name, employeeId, department, salary } = parsedData;

        if (!name || !employeeId || !department || salary === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: false,
            message: 'Validation Error: Please provide name, employeeId, department, and salary.'
          }));
        }

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

        const newEmployee = {
          id: nextId++,
          name: name.trim(),
          employeeId: employeeId.toString().trim(),
          department: department.trim(),
          salary: Number(salary)
        };

        employees.push(newEmployee);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Employee added successfully',
          data: newEmployee
        }, null, 2));
      } catch (parseError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid JSON format in request body.'
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      message: `Route not found: ${method} ${url}`
    }));
  }
});

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
