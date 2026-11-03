
import http from 'http';
import fs from 'fs';

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Create Homepage",
        assignedTo: "Priya Verma",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "Pending"
    }
];

const server = http.createServer((req, res) => {

    // Route 1: Welcome Page
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management</h1>');
    }

    // Route 2: Display All Tasks
    else if (req.url === '/tasks' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    // Route 3: About Page
    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Employee Task Management Application</h1><p>Manage employee tasks easily.</p>');
    }

    // Route 4: Read HTML File Using FS
    else if (req.url === '/home' && req.method === 'GET') {
        fs.readFile('./public/index.html', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // Route 5: Add Task Using POST
    else if (req.url === '/add-task' && req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'All required fields are necessary'
                    }));
                    return;
                }

                if (tasks.some(task => task.id === newTask.id)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        message: 'Task ID already exists'
                    }));
                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Invalid JSON data'
                }));
            }
        });
    }

    // Invalid Route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
