var readline = require('readline');
var net = require('net');
var crypto = require('crypto');
var net = require('net');

var algorithm = 'aes-256-ctr';
var password = 'password';
var client = new net.Socket();

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

client.connect(6969, '127.0.0.1', function() {
    console.log('Connected');
});

client.on('data', function(data) {
    process.stdout.write(data);
});

client.on('close', function() {
    console.log('Connection closed');
});

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line){
    client.write(encrypt(password+"|;"+line));
})
