//处理前端请求

const fs = require('fs')
const fsPromise = fs.promises;
const flowHandle = require('./handleFlow.js');

const listReqStr = 'SceneRoute#list';
const detailReqStr = 'SceneRoute#detail';

const cacheMap = {};

/**
 * @param req 前端请求的参数
 * @param ip 前端请求的ip，用来做设备标识，参数统一
 */ 
const handle = (req, ip) => {
  console.log(`client req = ${req}`)
  return new Promise((resolve, reject) => {
    if(!req){
      reject(`Unknown req: ${req}`);
      return;
    }
    if(req === listReqStr){
      fs.readFile('flows/list.json', (err, data) => {
        const list = JSON.parse(data.toString());
        if(err){
          reject(err)
        }else{
          cacheMap[ip + req] = list;
          // 这里不校验文件是否存在
          const indexList = [];
          for(let i in list){
            indexList.push(i);
          }
          // 这里生成一个全局id值，ip+当前时间，并且生成一个以全局id值作为文件名的文件
          const globalLogId = `${ip}.${formatDateTime(new Date())}`
          const obj = {
            globalLogId: globalLogId,
            sceneIdList: indexList
          }
          resolve(obj);
        }
      })
    }else if(req.indexOf(detailReqStr) === 0){
      let param = req.substring(req.indexOf(':') + 1);
      param = JSON.parse(param);
      const list = cacheMap[ip + listReqStr];
      if(!!list && param.id < list.length){
        fs.readFile(`flows/${list[param.id]}.json`, (err, res) => {
          if(err){
            reject(err);
          }else{
            const content = flowHandle.replace(res.toString());
            resolve(JSON.parse(content));
          }
        })
        return
      }
      reject('Invalid id');
    }else{
      reject('Unknown req: ' + req);
    }
  });
}

const setValueByJsonPath = (path, data, values) => {
  let index;
  if(/^.*\[\d+\]$/.test(path)){
    
  }
}

const checkObj = (obj, path, importList) => {
  if(!!obj.perform && obj.perform === 'import' && !!obj.path){
    importList.push({
      data: obj,
      path: path
    })
    return;
  }
  const keys = Object.keys(obj);
  for(let i in keys){
    const key = keys[i];
    const _path = `${path}.${key}[${i}]`;
    if(isArray(obj[key])){
      checkArr(obj[key], _path, importList);
    }else if(isObj(obj[key])){
      checkObj(obj[key], _path, importList);
    }
  }
}

const checkArr = (arr, path, importList) => {
  for(let i in arr){
    const _a = arr[i];
    const _path = `${path}[${i}]`;
    if(isArray(_a)){
      checkArr(_a, _path, importList);
    }else if(isObj(_a)){
      checkObj(_a, _path, importList);
    }
  }
}

const translateArray = (array) => {
  for(let i=0; i<array.length;i++){
    const a = array[i];
    console.log('translate array item: ', a)
    if(isArray(a)){
      const rA = translateArray(a);
      if(rA){
        array[i] = rA;
      }else{
        array.splice(i, 1);
        i--;
      }
    }else if(isObj(a)){
      const rO = translateObj(a);
      console.log('translate result, origin', a, ' result', rO);
      if(rO){
        if(isArray(rO)){
          array.splice(i, 1, rO);
          i += rO.length - 1;
        }else{
          array[i] = rO;
        }
      }else{
        array.splice(i, 1);
        i--;
      }
    }
  }
}

const translateObj = async (obj) => {
  if(!!obj.perform && obj.perform === 'import' && obj.path){
    let detail = await fsPromise.readFile(obj.path);
    detail = JSON.parse(detail.toString());
    const flows = detail.flows;
    if(!!flows){
      detail = flows[obj.id];
      if(!!detail){
        return detail.flows;
      }
    }
    return null;
  }
  const keys = Object.keys(obj);
  for(let i in keys){
    const key = keys[i];
    if(isArray(obj[key])){
      obj[key] = translateArray(obj[key]);
    }else if(isObj(obj[key])){
      obj[key] = translateObj(obj[key]);
    }
  }
  return obj;
}

const isArray = (data) => {
  return !!data && data instanceof Array;
}

const isObj = (data) => {
  return !!data && typeof data === 'object' && data.toString() === '[object Object]';
}

const formatDateTime = (_date) => {
  let txt = _date.getFullYear();
  const month = _date.getMonth() + 1;
  txt += `${month < 10 ? '0': ''}${month}`;
  const date = _date.getDate();
  txt += `${date < 10 ? '0': ''}${date}`;
  const hour = _date.getHours();
  const minutes = _date.getMinutes();
  const seconds = _date.getSeconds();
  txt += `${hour < 10 ? '0': ''}${hour}`;
  txt += `${minutes < 10 ? '0': ''}${minutes}`;
  txt += `${seconds < 10 ? '0': ''}${seconds}`;
  return txt;
}

module.exports = handle;
