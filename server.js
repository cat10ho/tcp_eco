import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE, MAX_MESSAGE_LENGTH } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => { //이건 서버를 만드는 것.
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);
   //socket.remoteAddress-> 어떤 주소로 연결되 있는지.
  socket.on('data' , (data) => {
    const buffer = Buffer.from(data);

    const { handlerId, length } = readHeader(data);
    console.log(`handlerId: ${handlerId}`);
    console.log(`length: ${length}`);

    // 메시지 길이 확인
    if (length > MAX_MESSAGE_LENGTH) {
        console.error(`Error: Message length ${length} exceeds maximum of ${MAX_MESSAGE_LENGTH}`);
        socket.write('Error: Message too long');
        socket.end();
        return;
      }

      const handler = handlers[handlerId];

      if (!handlers[handlerId]) {
        console.error(`Error: No handler found for ID ${handlerId}`);
        socket.write(`Error: Invalid handler ID ${handlerId}`);
        socket.end();
        return;
      }
  

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
    // 메시지 추출
    const message = buffer.slice(headerSize); // 앞의 헤더 부분을 잘라낸다.

    console.log(`client 에게 받은 메세지: ${message}`)
    
    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);
    
    const header = writeHeader(responseBuffer.length, handlerId);
    const responsePacket = Buffer.concat([header, responseBuffer]);

    socket.write(responsePacket);
  })
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
})

server.listen(PORT, () => { //이게 서버 실행.
  console.log(`Echo server listening on port ${PORT}`);
  console.log(server.address()); //서버 어디서 뜨는지 확인용.
})