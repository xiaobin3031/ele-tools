/**
 * 操作流程类
 * 1. 操作flows/module下的通用类
 */
const cache = {};
const fs = require('fs');
/**
 * 刷新指定目录下的缓存
 * 如果内容中包含import，也需要读取
 */
const refresh = (dir) => {
  let _dir = dir;
  if(!_dir){
    _dir = "flows/module";
  }
  fs.readdir(_dir, {withFileTypes: true}, (err, files) => {
    if(err || !files || !files.length) return;
    for(let i in files){
      const file = files[i];
      if(file.isFile()){
        const path = `${_dir}/${file.name}`
        fs.readFile(path, (e, data) => {
          if(e || !data) return;
          cache[path] = data.toString();
        })
      }else{
        refresh(`${_dir}/file.name`);
      }
    }
  });
} 

/**
 * 替换指定内容中的import
 * {
 *  "perform": "import",
 *  "path": "/path/to/flow",
 *  "type": "key in file"
 * }
 */
const replace = (_content) => {
  let content = _content;
  let index = content.indexOf('"perform": "import"');
  while(index > -1){
    const leftI = content.lastIndexOf("{", index);
    const rightI = content.indexOf("}", index);
    const importItem = JSON.parse(content.substring(leftI, rightI + 1));
    let subContent;
    if(importItem.path && importItem.type){
      subContent = cache[importItem.path];
      if(!!subContent){
        subContent = JSON.parse(subContent);
        subContent = subContent.flows[importItem.type].flows;
        if(!!subContent){
          if(subContent instanceof Array){
            subContent = JSON.stringify(subContent);
            subContent = subContent.substring(1, subContent.length - 1);
          }else{
            subContent = JSON.stringify(subContent);
          }
        }
      }
    }
    if(!subContent){
      subContent = "";
    }else{
      subContent += ",";
    }
    content = content.substring(0, leftI) + subContent + content.substring(rightI + 2);
    index = content.indexOf('"perform": "import"');
  }
  return content;
}

//const all = () => {
 // refresh: refresh,
 // replace: replace
//};

module.exports = {
  refresh: refresh,
  replace: replace
};