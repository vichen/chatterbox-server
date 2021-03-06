// var fname = path.basename(url.parse(request.url, true).pathname);  
  
// var ext = path.extname(request.url);
// var dname = path.dirname(request.url);
  
// if (ext !== '') {
//   serveStatic(dname, fname, ext, response);
// }

// var mime = {
//   '.txt': 'text/plain',
//   '.css': 'text/css',
//   '.js': 'text/javascript',
//   '.htm': 'text/html',
//   '.html': 'text/html',
//   '.jpeg': 'image/jpeg',
//   '.jpg': 'image/jpeg',
//   '.png': 'image/png',
//   '.gif': 'image/gif',
//   '.ico': 'image/x-icon'
// };
  
// var serveStatic = function(dname, fname, ext, response) {
//   var filePath = path.join(__dirname + dname, fname);
//   fs.readFile(filePath, function(error, data) {
//     if (!error) {
//       response.writeHead(200, {'Content-Type': mime[ext]});
//       response.end(data);
//     } else {
//       response.writeHead(404, {'Content-Type': 'text/html'});
//       response.end('There is no such file...');
//       console.log(error);
//     }
//   });
// };

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var uuid = require('node-uuid');
var fs = require('fs');

var anObj = {results: [{
  username: 'Jono',
  text: 'Do my bidding!',
  roomname: 'lobby'
}]};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCodeOut = 200;
  // The ingoing status.
  var statusCodeIn = 201;
  var statusCodeError = 404;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';


  if (request.method === 'OPTIONS') {
    console.log('OPTIONS is called');
    response.writeHead(statusCodeOut, headers);
    response.end();
  }

  if (request.method === 'GET') {
    console.log('GET is called');
    console.log(request.url);
    if (request.url.match(/client\/index\.html/)) {
      // response.writeHead(statusCode, {'Content-Type': 'text/html'});
      // fs.readFile('../client/index.html', 'utf8', function(err, data) {
      //   if (err) {
      //     response.writeHead(statusCodeError, headers);
      //     return response.end(err);
      //   }
      //   response.writeHead(statusCodeIn, headers);
      //   response.end(data);
      // });
    }

    if (request.url.match(/classes\/messages/)) {
      console.log('200');
      response.writeHead(statusCodeOut, headers);
    } else {
      console.log('404');
      response.writeHead(statusCodeError, headers);
    }
    
    var json = JSON.stringify(anObj);
    console.log('my json is ', json);
    response.end(json);

  }

  if (request.method === 'POST') {
    console.log('POST is called');
    response.writeHead(statusCodeIn, headers);
    //request.setEncoding();
    request.on('data', function(data) {
      var newMessage = JSON.parse(data.toString('utf8'));
      newMessage.objectId = uuid.v4();
      console.log('data is: ', newMessage);
      anObj.results.push(newMessage);
    });
    response.end('message received!');
  }


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// module.exports = requestHandler;
exports.requestHandler = requestHandler;
