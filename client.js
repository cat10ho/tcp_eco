import net from 'net';
import { readHeader, writeHeader} from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

//클라이언트도 소켓으로 하나 서버 띄우는거. 그리고 통신


// 서버에 연결할 호스트와 포트
const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server');

  const message = 'Hello'; 
  const test = Buffer.from(message);

  const header = writeHeader(test.length, 10); //임시로 헨들러 아이디 10
  const packet = Buffer.concat([header, test]);// 테스트에 헤더를 붙히는 함수.
  client.write(packet); //이게 서버에 보네는 것.

});

client.on('data', (data) => {
    const buffer = Buffer.from(data); // 데이터를 버퍼 형태로 변환. 10진수(아스키 코드)-> 16진수 이렇게 차례로 바꿈.

    const { handlerId, length } = readHeader(buffer);
    console.log(`handlerId: ${handlerId}`);
    console.log(`length: ${length}`);
  
    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
    // 메시지 추출
    const message = buffer.slice(headerSize); // 앞의 헤더 부분을 잘라낸다.
  
    console.log(`server 에게 받은 메세지: ${message}`);
});

client.on('close', () => { //이건 양쪽이 끈겼을때, end는 한쪽만 끈겼을때.
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});