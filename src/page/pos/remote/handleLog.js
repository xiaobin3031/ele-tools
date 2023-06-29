// 处理日志
// 1. 根据globalLogId，记录到文件中
// 2. 反显到html中

const fs = require('fs')

const formatLog = (log) => {
  const logs = log.split(',');

  return {
    globalLogId: logs.shift(),
    msg: logs.join(',')
  }
}
const handle = (log) => {
  // 从log中获取多个数据
  let logs = formatLog(log);
  fs.appendFile(`logs/${logs.globalLogId}`, logs.msg + '\n', () =>{})
  return logs.globalLogId;
}

module.exports = handle;