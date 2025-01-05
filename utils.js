import { TOTAL_LENGTH_SIZE, HANDLER_ID } from './constants.js';

export const readHeader = (buffer) => {
  return {
    length: buffer.readUInt32BE(0), //0번째 부터 32비트, 즉 4바이트 만큼 읽겠다. ,빅 인디안은 큰순대로, 리틀 인디안은 작은 순대로 읽음.
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE), //TOTAL_LENGTH_SIZE 부터 읽겠다.
  };
};

// 헤더를 만드는 거라 버퍼가 필요함.
export const writeHeader = (length, handlerId) => {
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  const buffer = Buffer.alloc(headerSize); // 버퍼 객체를 만드는 함수, 지금은 6만큼 만듬.
  buffer.writeUInt32BE(length + headerSize, 0); // 메시지 길이를 빅엔디안 방식으로 기록 (4바이트)
  buffer.writeUInt16BE(handlerId, TOTAL_LENGTH_SIZE); // 핸들러 ID를 빅엔디안 방식으로 기록 (2바이트)
  return buffer;
};
