var amqp = require('amqplib');
var when = require('when');
var channel, connection;
var queue = 'task_queue';
var amqpUrl = 'amqp://localhost';

amqp.connect(amqpUrl)
  .then(function (conn) {
      connection = conn;
      return when(conn.createChannel());
  })
  .then(function (ch) {
      channel = ch;
      return channel.assertQueue(queue, {durable: true}); 
  })
  .then(function () {
      var text = process.argv.slice(2).join(' ') || "Hello World!";

      var msg = {
        source: 'My service 1',
        targetNumber: '89135292926',
        msgText: text,
        span: 2
      };

      msg = JSON.stringify(msg);

      console.log('msg', msg);

      channel.sendToQueue(queue, new Buffer(msg), {deliveryMode: true});
      console.log(" [x] Sent '%s'", msg);
      return channel.close();
  })
  .ensure(function() { connection.close(); })
  .then(null, console.warn);