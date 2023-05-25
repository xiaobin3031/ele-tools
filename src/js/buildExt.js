Array.prototype.merge = function(item){
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
      this.push(item);
    }
  }
  return this;
}
Array.prototype.mergeString = function(string, split=' '){
  if(!!string){
    const strs = string.split(split);
    for(let i in strs){
      this.push(strs[i]);
    }
  }
  return this;
}
export default {};