function errorHandle(res) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
  };
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    'status': 'false',
    'data': '欄位未填寫正確，或查無此 ToDo ID',
  }));
  res.end();
};

module.exports = errorHandle;