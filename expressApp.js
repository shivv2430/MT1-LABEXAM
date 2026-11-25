// ==============================================================================
// Part B: Employee Management REST API using Express.js
// File: expressApp.js
// Port: 4000
// ==============================================================================

// 1. Import Express
const express = require('express');

// 2. Initialize Express application
const app = express();

// 3. Define the Port
const PORT = 4000;

// 4. Configure Middleware
// express.json() is built-in middleware that parses incoming requests with JSON payloads
// It populates req.body with the parsed JavaScript object
app.use(express.json());

// 5. In-memory data store using a JavaScript Array
// Initialized with at least three sample employee records
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

// Counter for auto-incrementing the numeric ID
let nextId = 4;

// ==============================================================================
// REST API ENDPOINTS
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. GET /employees - Retrieve all employees
// ------------------------------------------------------------------------------
app.get('/employees', (req, res) => {
  return res.status(200).json({
    success: true,
    total: employees.length,
    data: employees
  });
});

// ------------------------------------------------------------------------------
// 2. GET /employees/:id - Retrieve a single employee by numeric ID
// Route parameter: req.params.id
// ------------------------------------------------------------------------------
app.get('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);

  // Validate if id is a valid number
  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }

  // Find employee in the array
  const employee = employees.find(emp => emp.id === empId);

  // If not found, return 404
  if (!employee) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }

  // If found, return 200 OK with employee data
  return res.status(200).json({
    success: true,
    data: employee
  });
});

// ------------------------------------------------------------------------------
// 3. POST /employees - Add a new employee
// Status code: 201 Created
// ------------------------------------------------------------------------------
app.post('/employees', (req, res) => {
  const { name, employeeId, department, salary } = req.body;

  // Validation: Check for required fields
  if (!name || !employeeId || !department || salary === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please provide name, employeeId, department, and salary.'
    });
  }

  // Validation: Prevent duplicate employeeId (e.g., EMP101)
  const existingEmployee = employees.find(
    emp => emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase()
  );
  if (existingEmployee) {
    return res.status(400).json({
      success: false,
      message: `Validation Error: An employee with employeeId '${employeeId}' already exists.`
    });
  }

  // Create new employee object
  const newEmployee = {
    id: nextId++,
    name: name.trim(),
    employeeId: employeeId.toString().trim(),
    department: department.trim(),
    salary: Number(salary)
  };

  // Add to array
  employees.push(newEmployee);

  // Return 201 Created status
  return res.status(201).json({
    success: true,
    message: 'Employee created successfully.',
    data: newEmployee
  });
});

// ------------------------------------------------------------------------------
// 4. PUT /employees/:id - Update an existing employee's details
// ------------------------------------------------------------------------------
app.put('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);

  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }

  // Find index of the employee in the array
  const index = employees.findIndex(emp => emp.id === empId);

  // If employee does not exist, return 404
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }

  const { name, employeeId, department, salary } = req.body;

  // If user wants to update employeeId, ensure it doesn't conflict with another employee
  if (employeeId) {
    const duplicate = employees.find(
      emp => emp.id !== empId && emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase()
    );
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: employeeId '${employeeId}' is already used by another employee.`
      });
    }
  }

  // Update existing employee fields (or keep existing if not provided)
  const currentEmployee = employees[index];
  employees[index] = {
    ...currentEmployee,
    name: name !== undefined ? name.trim() : currentEmployee.name,
    employeeId: employeeId !== undefined ? employeeId.toString().trim() : currentEmployee.employeeId,
    department: department !== undefined ? department.trim() : currentEmployee.department,
    salary: salary !== undefined ? Number(salary) : currentEmployee.salary
  };

  return res.status(200).json({
    success: true,
    message: `Employee with ID ${empId} updated successfully.`,
    data: employees[index]
  });
});

// ------------------------------------------------------------------------------
// 5. DELETE /employees/:id - Delete an employee by ID
// ------------------------------------------------------------------------------
app.delete('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);

  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }

  const index = employees.findIndex(emp => emp.id === empId);

  // If not found, return 404
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }

  // Remove the employee from array and capture deleted record
  const deletedEmployee = employees.splice(index, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Employee with ID ${empId} deleted successfully.`,
    data: deletedEmployee
  });
});

// ------------------------------------------------------------------------------
// 404 Handler for undefined routes
// ------------------------------------------------------------------------------
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// 6. Start listening on port 4000
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Part B: Express REST API is running on http://localhost:${PORT}`);
  console.log(` Available REST Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/employees`);
  console.log(`   GET    http://localhost:${PORT}/employees/:id`);
  console.log(`   POST   http://localhost:${PORT}/employees`);
  console.log(`   PUT    http://localhost:${PORT}/employees/:id`);
  console.log(`   DELETE http://localhost:${PORT}/employees/:id`);
  console.log(`=======================================================`);
});
