Array.prototype.merge = function(item, prepend = false){
  if(!!item){
    let pushed = false;
    for(let i=0;i<this.length;i++){
      if(this[i]._id === item._id){
        this[i] = item;
        pushed = true;
        break;
      }
    }
    if(!pushed){
      if(prepend){
        this.unshift(item);
      }else{
        this.push(item);
      }
    }
  }
  return this;
}
Array.prototype.mergeString = function(string, split=' '){
  if(!!string){
    const strs = string.split(split);
    for(let i = 0;i<strs.length;i++){
      this.push(strs[i]);
    }
  }
  return this;
}

String.prototype.beginWith = function(prefix){
  if(!!prefix){
    if(this.indexOf(prefix) > -1){
      return true;
    }
  }
  return false;
}









export default {};