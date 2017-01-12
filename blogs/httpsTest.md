# node https server example

`node` `https`

现在强调网络安全，https server肯定也要弄起来

```zsh
   70  openssl genrsa -out client-key.pem 2048
   71  openssl req -new -key client-key.pem -out client.csr
   72  openssl x509 -req -in client.csr -signkey client-key.pem -out client-cert.pem
```

node https server example 

```javascripte
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('client-key.pem'),
  cert: fs.readFileSync('client-cert.pem')
};

var a = https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);
```
test
```bash
curl -k https://localhost:8000/
```