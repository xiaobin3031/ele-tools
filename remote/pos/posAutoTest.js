const net = require('net');
const fs = require('fs');

const localPort = 61124;
const clientHandle = require('./handleClient.js')
const logHandle = require('./handleLog.js')
const flowHandle = require('./handleFlow.js')

// 下标类型 begin
// const INDEX_DATATYPE = 0; // 报文类型的下标
// const INDEX_CLIENT_ID = INDEX_DATATYPE + LEN_DATA_TYPE;  // 客户端id的下标
// const INDEX_RESERVE = INDEX_CLIENT_ID + LEN_CLIENT_ID;  // 预留字段的下标
// const INDEX_CONTENT_LEN = INDEX_RESERVE + LEN_RESERVE; // 报文内容长度的起始
// const INDEX_CONTENT = INDEX_CONTENT_LEN + LEN_CONTENT_LEN; // 报文内容的下标
// 下标类型 end

// 报文长度 begin
const LEN_DATA_TYPE = 1;   // 报文类型长度
const LEN_CLIENT_ID = 32;   // 客户端id长度
const LEN_RESERVE = 32;  // 预留字段长度
const LEN_CONTENT_LEN = 4;  // 报文长度的长度
// 报文长度 end

// 内容类型 begin
const DATATYPE_CONNECT = 1;  // 第一次连接注册设备id
const DATATYPE_REQ_FLOWS = 2;  //请求流程信息
const DATATYPE_LOG = 3; // 日志信息
const DATATYPE_LOG_STEP = 4; // 单步日志信息
// 内容类型 end

let connectCallbacks = [];
let responseCallbacks = {};

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
const clients = {};
function startServer(){
  connectCallbacks = []
  server = net.createServer((socket) => {
    const ipLogMap = {};   //一个客户端只能有一个globalLogId存在
    console.log('connect: ', socket.remoteAddress, ':', socket.remotePort);

    socket.on('data', (data) => {
      //console.log('req.data', data.toString());
      // 调整请求报文的格式
      let offset = 0; // 有可能多个报文同时接受到，此时会有偏移值
      while(true) {
        const dataType = data.readInt8(offset);
        if(dataType >= DATATYPE_CONNECT){
          offset += LEN_DATA_TYPE
          const clientId = data.toString("utf-8", offset, offset + LEN_CLIENT_ID);
          if(dataType === DATATYPE_CONNECT){
            clients[clientId] = socket;
            if(connectCallbacks.length > 0){
              connectCallbacks.forEach(a => a({clientId: clientId}))
            }
          }
          offset += LEN_CLIENT_ID
          offset += LEN_RESERVE
          const len = data.readInt32BE(offset);
          if(len > 0){
            offset += LEN_CONTENT_LEN
            const msg = data.toString("utf-8", offset, offset + len);
            switch(dataType){
              case DATATYPE_REQ_FLOWS:
                clientHandle(msg, socket.remoteAddress)
                  .then(content => {
                    sendSuccess(socket, JSON.stringify(content));
                  }).catch(err => sendError(socket, JSON.stringify(err)));
                break;
              case DATATYPE_LOG:  //日志
                const globalLogId = logHandle(msg);
                if(!!globalLogId){
                  ipLogMap[socket.remoteAddress] = globalLogId;
                }
                break;
              default:
                const cbs = responseCallbacks[dataType];
                if(!!cbs && cbs.length > 0){
                  cbs.forEach(cb => cb(msg)) // 进行回调处理
                }
                break;
            }
          }
          offset += len;
          if(data.length - 1 <= offset){
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
      for(let k in clients){
        if(clients[k] === socket){
          delete clients[k]
          break;
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
/**
 * 关闭服务
 * @param {function} cb onceConnect()注入的回调函数
 */
function stopServer(){
  for(let k in clients){
    clients[k].close();
    delete clients[k]
  }
  if(server){
    console.log('prepare to close server')
    server.close();
  }
  connectCallbacks = []
  responseCallbacks = []
}

function sendContent({clientId, content}){
  if(!content || !clientId) return
  const socket = clients[clientId]
  if(!socket) return
  sendSuccess(socket, content)
}

module.exports = {
  start: startServer,
  stop: stopServer,
  onceConnect: function(cb){
    if(!!cb && typeof cb === 'function' && connectCallbacks.every(a => a !== cb)){
      connectCallbacks.push(cb);
    }
  },
  registerResponse: function(dataType, cb){
    if(dataType in responseCallbacks){
      if(responseCallbacks[dataType].every(a => a !== cb)){
        responseCallbacks[dataType].push(cb);
      }
    }else{
      responseCallbacks[dataType] = [cb];
    }
  },
  sendContent: sendContent
}