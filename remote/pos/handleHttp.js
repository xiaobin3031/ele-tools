// 处理http请求
const fs = require('fs')
const defaultHttpResponse = '{"code": 0, "msg": "default response"}';

const handle = ({pathname, searchParams}) => {
  return new Promise((resolve, reject) => {
    if(!!pathname){
      switch(pathname){
        case "/log/logList":
          //todo 读取文件夹中的所有文件
          const fold = searchParams.get('fold');
          let path = 'logs';
          if(!!fold){
            path += `/${fold}`
          }
          fs.readdir(path, {withFileTypes: true}, (err, files) => {
            if(err){
              reject('{msg: "暂无日志文件"}');
              return;
            }      
            if(files.length){
              // 排序，剔除其他
              const list = files.filter(a => "tmp" !== a.name).map(a => { return {name: a.name, isFile: a.isFile()}});
              // 按时间倒叙排序
              list.sort((a, b) =>{
                const aTime = a.name.substring(a.name.lastIndexOf('.') + 1);
                const bTime = b.name.substring(b.name.lastIndexOf('.') + 1);
                return aTime < bTime ? 1: -1;
              })
              resolve(list);
              return;
            }
            resolve([]);
          })
          return;
        case "/log/detail":
          const id = searchParams.get('id');
          if(!!id){
            fs.readFile(`logs/${id}`, (err, data) => {
              if(err){
                reject(`读取文件:${id}失败`);
              }else{
                resolve(data.toString());
              }
            })
            return;
          }
          reject(`文件:${id}不存在`)
          return;
      }
    }
    resolve(defaultHttpResponse);
  })
}

module.exports = handle;