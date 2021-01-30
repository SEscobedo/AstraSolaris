const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 8000;



const server = http.createServer((req, res) => {
    
    if (req.url.indexOf("favicon.ico") > 0){ return;}

    fs.readFile("./index.html", function(err, html){
        var html_string = html.toString();
        res.writeHead(200,{"ContetType": "text/html"})
        res.write(html_string);
        res.end();
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});