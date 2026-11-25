
const express = require('express');

const app = express();

const PORT = 4000;

app.use(express.json());

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

app.get('/employees', (req, res) => {
  return res.status(200).json({
    success: true,
    total: employees.length,
    data: employees
  });
});

app.get('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);


  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }

  const employee = employees.find(emp => emp.id === empId);

  if (!employee) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: employee
  });
});
app.post('/employees', (req, res) => {
  const { name, employeeId, department, salary } = req.body;


  if (!name || !employeeId || !department || salary === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please provide name, employeeId, department, and salary.'
    });
  }


  const existingEmployee = employees.find(
    emp => emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase()
  );
  if (existingEmployee) {
    return res.status(400).json({
      success: false,
      message: `Validation Error: An employee with employeeId '${employeeId}' already exists.`
    });
  }


  const newEmployee = {
    id: nextId++,
    name: name.trim(),
    employeeId: employeeId.toString().trim(),
    department: department.trim(),
    salary: Number(salary)
  };


  employees.push(newEmployee);


  return res.status(201).json({
    success: true,
    message: 'Employee created successfully.',
    data: newEmployee
  });
});

app.put('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);

  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }


  const index = employees.findIndex(emp => emp.id === empId);


  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }

  const { name, employeeId, department, salary } = req.body;

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


app.delete('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);

  if (isNaN(empId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Employee ID. ID must be an integer number.'
    });
  }

  const index = employees.findIndex(emp => emp.id === empId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Employee with ID ${empId} not found.`
    });
  }


  const deletedEmployee = employees.splice(index, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Employee with ID ${empId} deleted successfully.`,
    data: deletedEmployee
  });
});



app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

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
