var fs = require('fs')
    , http = require('http')
    , url = require('url')
    , socketio = require('socket.io');
 
var server = http.createServer(function(req, res) {
	  var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received");
    res.writeHead(200, { 'Content-type': 'text/html'});

    if (pathname == "/") 
		{
			pathname="/index.html";
		}
    res.end(fs.readFileSync(__dirname + pathname));
    
    
}).listen(3000, function() {
    console.log('Listening at: http://localhost:3000');
});
 
socketio.listen(server).on('connection', function (socket) {
	  socket.emit('news',{ hello: 'Session ' + socket.id });
	  
	  socket.on('set nickname', function (name) {
	  	socket.set('nickname', name, function (){
	  		socket.emit('news' , { hello: 'Welcome,' + name + '!' });
	  	});
	  });
	  	
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.get('nickname', function (err, nickname){
        	if (!err){
        	  socket.broadcast.emit('message', 'You have the new message from ' + nickname + ': ' + msg);
          }
        })
    });

});