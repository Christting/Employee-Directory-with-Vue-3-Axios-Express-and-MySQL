CREATE DATABASE IF NOT EXISTS utm_employee_db;
USE utm_employee_db;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empId VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    hireDate DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. 往这个表格里塞入 7 个员工的信息（这就是种子数据/Seed Data）
INSERT INTO employees (empId, name, email, department, position, hireDate, salary, active) VALUES
('EMP001', 'Ali Ahmad', 'ali@company.com', 'IT', 'Software Engineer', '2023-01-15', 4500.00, 1),
('EMP002', 'Siti Nur', 'siti@company.com', 'HR', 'HR Manager', '2022-03-12', 6000.00, 1),
('EMP003', 'Tan Ah Teck', 'tan@company.com', 'Finance', 'Accountant', '2021-06-01', 5500.00, 1),
('EMP004', 'John Doe', 'john@company.com', 'IT', 'System Administrator', '2024-02-10', 4000.00, 1),
('EMP005', 'Muthu', 'muthu@company.com', 'Marketing', 'Marketing Executive', '2023-11-20', 3500.00, 0),
('EMP006', 'Jane Smith', 'jane@company.com', 'Operations', 'Operations Manager', '2020-05-18', 7000.00, 1),
('EMP007', 'Lee Chong', 'lee@company.com', 'HR', 'Recruiter', '2025-01-05', 3800.00, 1);