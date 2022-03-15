/**
 * GET → 取得所有代辦事項，{{url}}/todos
 * POST → 新增代辦事項，{{url}}/todos
 * PATCH → 編輯指定代辦事項，{{url}}/todos/{{uuid}}
 * DELETE → 刪除所有代辦事項，{{url}}/todos
 * DELETE → 刪除指定代辦事項，{{url}}/todos/{{uuid}}
 * @param {*} req 
 * @param {*} res 
 */

// 自動執行：npx nodemon server.js
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('./errorHandle');

const todos = [];

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  };

  req.setEncoding('utf8');
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  if(req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos,
    }));
    res.end();
  } else if(req.url == '/todos' && req.method == 'POST') {
    // 新增待辦事項
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if(title !== undefined) {
          const todo = {
            'title': title,
            'id': uuidv4()
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            'status': 'success',
            'data': todos,
          }));
          res.end();
        } else {
          errHandle(res);
        };
      } catch(error) {
        errHandle(res);
      };
    });
  } else if(req.url == '/todos' && req.method == 'DELETE') {
    // 刪除所有代辦事項
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos,
      'delete': 'yes'
    }));
    res.end();
  } else if(req.url.startsWith('/todos/') && req.method == 'DELETE') {
    // 刪除單筆代辦事項
    const id = req.url.split('/').pop();
    const index = todos.findIndex(el => el.id == id);
    if(index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        'status': 'success',
        'data': todos,
      }));
      res.end();
    } else {
      errHandle(res);
    };
  } else if(req.url.startsWith('/todos/') && req.method == 'PATCH') {
    // 編輯代辦事項
    req.on('end', () => {
      try{
        const todo = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex(el => el.id == id);
        if(todo !== undefined && index !== -1) {
          todos[index].title = todo;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            'status': 'success',
            'data': todos,
          }));
          res.end();
        } else {
          errHandle(res);
        };
      } catch {
        errHandle(res);
      };
    });
  } else if(req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'false',
      'message': '查無資訊',
    }));
    res.end();
  };
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);