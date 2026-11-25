const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

let employees = [
  { id: 1, name: "Rahul Sharma", employeeId: "EMP101", department: "IT", salary: 45000 },
  { id: 2, name: "Priya Patel", employeeId: "EMP102", department: "Human Resources", salary: 50000 },
  { id: 3, name: "Aman Verma", employeeId: "EMP103", department: "Finance", salary: 55000 }
];

let nextId = 4;

app.get('/employees', (req, res) => {
  res.status(200).json({ success: true, total: employees.length, data: employees });
});

app.get('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);
  if (isNaN(empId)) {
    return res.status(400).json({ success: false, message: 'Invalid Employee ID.' });
  }

  const employee = employees.find(emp => emp.id === empId);
  if (!employee) {
    return res.status(404).json({ success: false, message: `Employee with ID ${empId} not found.` });
  }

  res.status(200).json({ success: true, data: employee });
});

app.post('/employees', (req, res) => {
  const { name, employeeId, department, salary } = req.body;
  if (!name || !employeeId || !department || salary === undefined) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const exists = employees.find(emp => emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase());
  if (exists) {
    return res.status(400).json({ success: false, message: `Employee with employeeId '${employeeId}' already exists.` });
  }

  const newEmployee = {
    id: nextId++,
    name: name.trim(),
    employeeId: employeeId.toString().trim(),
    department: department.trim(),
    salary: Number(salary)
  };

  employees.push(newEmployee);
  res.status(201).json({ success: true, message: 'Employee created successfully.', data: newEmployee });
});

app.put('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);
  if (isNaN(empId)) {
    return res.status(400).json({ success: false, message: 'Invalid Employee ID.' });
  }

  const index = employees.findIndex(emp => emp.id === empId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Employee with ID ${empId} not found.` });
  }

  const { name, employeeId, department, salary } = req.body;
  if (employeeId) {
    const duplicate = employees.find(emp => emp.id !== empId && emp.employeeId.toLowerCase() === employeeId.toString().toLowerCase());
    if (duplicate) {
      return res.status(400).json({ success: false, message: `Employee ID '${employeeId}' already in use.` });
    }
  }

  const current = employees[index];
  employees[index] = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    employeeId: employeeId !== undefined ? employeeId.toString().trim() : current.employeeId,
    department: department !== undefined ? department.trim() : current.department,
    salary: salary !== undefined ? Number(salary) : current.salary
  };

  res.status(200).json({ success: true, message: `Employee with ID ${empId} updated successfully.`, data: employees[index] });
});

app.delete('/employees/:id', (req, res) => {
  const empId = parseInt(req.params.id, 10);
  if (isNaN(empId)) {
    return res.status(400).json({ success: false, message: 'Invalid Employee ID.' });
  }

  const index = employees.findIndex(emp => emp.id === empId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: `Employee with ID ${empId} not found.` });
  }

  const deleted = employees.splice(index, 1)[0];
  res.status(200).json({ success: true, message: `Employee with ID ${empId} deleted successfully.`, data: deleted });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Express REST API running on http://localhost:${PORT}`);
});
