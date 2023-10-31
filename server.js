const fs = require("fs");

const UDP = require('dgram')

const server = UDP.createSocket('udp4')

// Local port
const port = 2222

//================ Server is listening
server.on('listening', () => {
  // Server address it’s using to listen

  const address = server.address()

  console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
})

//================ When receiving data from client 

server.on('message', (message, info) => {
  // console.log('Message', message.toString())
  // const validJson = message.toString().replaceAll(`'`, `"`);
  const validJson = message;
  fs.writeFileSync('output.json', validJson);
  const parsed = JSON.parse(validJson);
  console.log(parsed);

  const response = Buffer.from('Message Received')

  //sending back response to client

  server.send(response, info.port, info.address, (err) => {
    if (err) {
      console.error('Failed to send response !!')
    } else {
      console.log('Response send Successfully')
    }
  })
})

server.bind(port)

