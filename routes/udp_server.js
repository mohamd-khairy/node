const UDP = require('dgram')

const server = UDP.createSocket('udp4')

const port = 2222

server.on('listening', () => {
  // Server address it’s using to listen

  const address = server.address()

  console.log('Listining to ', 'Address: ', address.address, 'Port: ', address.port)
})

server.on('message', (message, info) => {

  const receivedData = JSON.parse(message.toString());
  console.log('Received data:', receivedData);

  // const response = Buffer.from('Message Received')

  // //sending back response to client

  // server.send(response, info.port, info.address, (err) => {
  //   if (err) {
  //     console.error('Failed to send response !!')
  //   } else {
  //     console.log('Response send Successfully')
  //   }
  // })
})

server.bind(port)
