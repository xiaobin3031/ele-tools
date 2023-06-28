const net = require('net');
const fs = require('fs');

const localPort = 61124;
const clientHandle = require('./handleClient.js')
const logHandle = require('./handleLog.js')
const flowHandle = require('./handleFlow.js')

// 下标类型 begin
const INDEX_CONTENT_LEN = 30; // 报文内容长度的起始
// 下标类型 end

// 内容类型 begin
const DATATYPE_CONNECT = 1;  // 第一次连接注册设备id
// 内容类型 end

/**
 * 获取文本的长度
 * @param {string} content 
 * @returns 
 */
const contentLen = (content) => {
  let count = 0;
  for(let i = 0;i < content.length;i++){
    const c = content.charAt(i);
    //console.log('content.index: ', i, ', char: ', c, ', count: ', count, ', hex: ', c.toString(16));
    if(/[\u0000-\u007f]/.test(c)){
      count++;
    }else if(/[\u0080-\u07ff]/.test(c)){
      count += 2;
    } else if(/[\u0800-\ud7ff]/.test(c) || /[\ue000-\uffff]/.test(c)){
      count += 3;
    } else if(/[\u10000-\u10ffff]/.test(c)){
      count += 4;
    }else{
      throw new Error('Unknown unicode point');
    }
  }
  return count;
}

/**
 * 根据文本内容，填充字节流
 * @param {string} content 
 * @returns 
 */
const getBuf = (content) => {
  if(!content){
    const buf = Buffer.alloc(1);
    return buf;
  }
  const buf = Buffer.alloc(contentLen(content) + 5);
  const len = buf.write(content, 5);
  //todo 测试前端收到的字节信息
  buf.writeInt32BE(len, 1);
  return buf;
}

/**
 * 发送成功请求
 * @param {socket} socket 
 * @param {string} content 
 */
const sendSuccess = (socket, content) => {
  console.log('success content: ', content);
  const buf = getBuf(content);
  buf.writeInt8(1, 0);
  socket.write(buf);
}

/**
 * 发送失败请求
 * @param {socket} socket 
 * @param {string} msg 
 */
const sendError = (socket, msg) => {
  const buf = getBuf(msg);
  buf.writeInt8(0, 0);
  socket.write(buf);
}

let server;
const clients = []; // 客户端集合
function startServer(){
  server = net.createServer((socket) => {
    clients.push(socket);
    const ipLogMap = {};   //一个客户端只能有一个globalLogId存在
    console.log('connect: ', socket.remoteAddress, ':', socket.remotePort);

    socket.on('data', (data) => {
      //console.log('req.data', data.toString());
      // 调整请求报文的格式
      let offset = 0; // 有可能多个报文同时接受到，此时会有偏移值
      while(true) {
        const dataType = data.readInt8(0 + offset);
        if(dataType >= DATATYPE_CONNECT){
          const clientId = data.toString("utf-8", 1 + offset, 17 + offset);
          const len = data.readInt32BE(INDEX_CONTENT_LEN + offset);
          if(len > 0){
            const msg = data.toString("utf-8", 35 + offset, len + 35 + offset);
            switch(dataType){
              case 1:
                clientHandle(msg, socket.remoteAddress)
                  .then(content => {
                    sendSuccess(socket, JSON.stringify(content));
                  }).catch(err => sendError(socket, JSON.stringify(err)));
                break;
              case 2:
                const globalLogId = logHandle(msg);
                if(!!globalLogId){
                  ipLogMap[socket.remoteAddress] = globalLogId;
                }
                break;
              case 3:
                break;
            }
          }
          offset += len + 35;
          if(data.length <= offset){
            break;
          }
        }else{
          // 无效报文，整个退出
          break;
        }
      }
    })

    socket.on('error', (exception) =>{
      console.log('socket error: ', exception);
      logEnd('server error')
      socket.end();
    })

    socket.on('close', (data) => {
      console.log('client closed!')
      logEnd('client close')
    })

    const logEnd = (endReason) => {
      for(let i=0;i<clients.length;i++){
        if(clients[i] === socket){
          clients.splice(i, 1)
          break
        }
      }
      // 客户端断开后，标识记录日志为空
      const globalLogId = ipLogMap[socket.remoteAddress]
      if(!!globalLogId){
        // _log-end 表示日志记录结束，:后面跟着的是结束原因
        fs.appendFile(`logs/${globalLogId}`, `_log-end: ${endReason}`, () => {})
      }
    }
  }).listen(localPort);

  server.on('listening', () => {
    console.log('server listening: ', server.address())
  })

  server.on('error', (exception) =>{
    console.log('server error: ', exception)
  })

  server.on('close', () => {
    console.log('server closed success')
  })
}

function stopServer(){
  if(clients.length > 0){
    clients.forEach(socket => socket.close())
  }
  if(server){
    console.log('prepare to close server')
    server.close();
  }
}

module.exports = {
  start: startServer,
  stop: stopServer,
  onceConnect: 
}