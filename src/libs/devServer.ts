import http from 'http';
import fs from 'fs';
import path from 'path';

export const DevServer = async function () {
  const server = http.createServer((req, res) => {
    let data;
    if (req.url === '/') {
      data = fs.readFileSync(path.join(__dirname, '../../example/public/index.html'));
    } else if (req.url) {
      data = fs.readFileSync(path.join(__dirname, '../../example/public', req.url));
    } else {
      res.writeHead(404);
      res.end();
    }
    res.writeHead(200);
    res.end(data);
  });
  server.listen(5000);
  return () => {
    server.close();
  };
};
