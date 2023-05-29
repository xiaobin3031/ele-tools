
let _id = 1;
export function globalId(){

  return new Date().getTime() + (_id++);
}

const clickToCloseFunc = [];
export function registCloseFunc(func){
  if(!!func && typeof func === 'function'){
    for(let i = 0;i<clickToCloseFunc.length;i++){
      if(clickToCloseFunc[i] === func){
        return;
      }
    }
    clickToCloseFunc.push(func);
  }
}
export function unRegistCloseFunc(func){
  if(!!func && typeof func === 'function'){
    for(let i=0;i<clickToCloseFunc.length;i++){
      if(clickToCloseFunc[i] === func){
        clickToCloseFunc.splice(i, 1);
        return;
      }
    }
  }
}
window.addEventListener('click', function(event){
  event.stopPropagation();
  event.preventDefault();
  if(!!clickToCloseFunc && clickToCloseFunc.length > 0){
    for(let i=0;i<clickToCloseFunc.length;i++){
      clickToCloseFunc[i](event);
    }
  }
});