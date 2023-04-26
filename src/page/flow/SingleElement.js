import { useState } from "react";
import Row from "../../component/Row"
import Tips from "../../component/Tips"

export default function SingleElement({props:{ ele, handleEle }}){

  const [idOrTextVal, setIdOrTextVal] = useState(!!ele.id? ele.id: ele.text);
  const [select, setSelect] = useState(!!ele.id || (!ele.id && !ele.text) ? 'id': "text");

  function handleElement(event){
    const name = event.target.getAttribute('realname');
    const value = event.target.value;
    switch(name){
      case 'eleType':
        setSelect(value);
        setEelement();
        break;
      case 'idOrText':
        setIdOrTextVal(value);
        setEelement(value);
        break;
      case 'notInRoot':
      case 'optional':
      case 'multi':
        ele[name] = event.target.checked;
        break;
      default:
        break;
    }
    handleEle(ele);
  }

  function setEelement(value){
    if('id' === select){
      ele.id = value;
      ele.text = '';
    }else{
      ele.id = '';
      ele.text = value;
    }
  }

  return (
    <div className="single-element">
      <Row>
        <label> <input type="radio" realname="eleType" name={`eleType-${ele._id}`} value="id" checked={select === 'id'} onChange={handleElement}/> id </label>
        <label> <input type="radio" realname="eleType" name={`eleType-${ele._id}`} value="text" checked={select === 'text'} onChange={handleElement}/> text </label>
        <input name={`idOrText-${ele._id}`} realname="idOrText" defaultValue={idOrTextVal} onChange={handleElement}/>
      </Row>
      <Row>
        <label> <input type="checkbox" realname="notInRoot" name={`notInRoot-${ele._id}`} checked={!!ele.notInRoot} onChange={handleElement}/> 不再当前页面上  </label><Tips title={"比如消息提示框上的问题"}/>
        <label> <input type="checkbox" realname="optional" name={`optional-${ele._id}`} checked={!!ele.optional} onChange={handleElement}/> 元素可选  </label><Tips title={"如果元素不存在，不会中断测试"}/>
        <label> <input type="checkbox" realname="multi" name={`multi-${ele._id}`} checked={!!ele.multi} onChange={handleElement}/> 元素重复 </label><Tips title={"如果有重名(id或者text)的元素，需要勾选此项"}/>
      </Row>
    </div>
  )
}