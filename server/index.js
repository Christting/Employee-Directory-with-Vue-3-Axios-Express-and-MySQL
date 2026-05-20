// 1. 引入我们刚才安装的三个插件
const express = require('express');
const mysql = require('mysql2/promise'); // 引入支持 Promise 的数据库驱动（老师要求的 API 格式）
const cors = require('cors');

const app = express();

// 2. 激活插件
app.use(cors());          // 允许前端跨域访问（防止浏览器拦截前后端通讯）
app.use(express.json());  // 允许服务器接收和解析前端传来的 JSON 格式的数据

// 3. 配置数据库连接池（Pool）
// 这就像是建一条通往你在 Laragon 里的 MySQL 数据库的“高速公路”
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',            // Laragon 默认的数据库密码为空
    database: 'utm_employee_db', // 刚刚在 HeidiSQL 里建的数据库名字
    waitForConnections: true,
    connectionLimit: 10
});

// 4. 测试接口（非核心，纯粹用来检查服务器有没有活着）
// 当你在浏览器输入 http://localhost:3001/ 时就会看到这句话
app.get('/', (req, res) => {
    res.send('Backend Server is running perfectly!');
});

// 5. 核心接口：获取所有员工列表 (READ - List)
// 当你在浏览器输入 http://localhost:3001/employees 时会触发这里
app.get('/employees', async (req, res) => {
    try {
        // 使用连接池去数据库里执行查询命令：拿到 employees 表的所有数据
        const [rows] = await pool.query('SELECT * FROM employees');
        
        // 成功拿到后，把数据变成 JSON 文本格式，回复给来拿数据的浏览器
        res.json(rows);
    } catch (err) {
        // 如果中间停电了或者数据库连不上，返回 500 状态码并告诉前端错在哪里
        res.status(500).json({ error: err.message });
    }
});

// 6. 让服务器开始在电脑的 3001 端口上“守听”
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});