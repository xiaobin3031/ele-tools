const fs = require('fs')

const dbPath = 'data/posauto';
fs.mkdir(dbPath, {recursive: true}, (err) => {
  console.log('create dir', dbPath, err)
})

function saveSteps({list, filename = 'common'}){
  fs.writeFile(getPath(filename), new Uint8Array(Buffer.from(JSON.stringify(list))), (err) => {
    // log 
  })
}

function saveOrUpdateStep({step, filename="common"}){
  const path = getPath(filename);
  fs.exists(path, exist => {
    if(exist){
      fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
        if(!err){
          let list = [];
          if(!!data){
            list = JSON.parse(data).filter(a => !!a);
          }
          let pushed = false;
          if(list.length !== 0){
            for(let i = 0;i<list.length;i++){
              if(list[i]._id === step._id){
                list[i] = step;
                pushed = true;
                break;
              }
            }
          }
          if(!pushed){
            list.push(step);
          }
          fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify(list))), (err) => {
            // log
          })
        }
      })
    }else{
      fs.writeFile(path, new Uint8Array(Buffer.from(JSON.stringify([step]))), (err) => {
        // log
      })
    }
  })
}

function readSteps({filename = 'common'}){
  const path = getPath(filename);
  if(fs.existsSync(path)){
    const data = fs.readFileSync(path, {encoding: 'utf-8'});
    if(!!data){
      return JSON.parse(data).filter(a => !!a);
    }
  }
  return [];
}

function getPath(filename){
  return `${dbPath}/${filename}.json`
}
module.exports = {
  saveSteps: saveSteps,
  readSteps: readSteps,
  saveOrUpdateStep: saveOrUpdateStep
}