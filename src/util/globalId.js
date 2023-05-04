
let _id = 1;
export default function globalId(){

  return new Date().getTime() + (_id++);
}