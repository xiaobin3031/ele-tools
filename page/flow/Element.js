// 元素选择
import Row from "../../component/Row"
import CombineElement from "./CombineElement"
import SingleElement from "./SingleElement"
import { initSingleElement } from "./data/flowInit"

export default function Element({props:{ ele, handleEle }}){

  function addCombileEle(){
    if(ele.anyElements.some(a => !a.id && !a.text)){
      return;
    }
    const singleEle = initSingleElement({});
    ele.anyElements.push(singleEle);
    handleEle(ele);
  }

  function handleEleAny(updateEle, type){
    if(!!type){ //delete
      ele.anyElements = ele.anyElements.filter(a => a._id !== updateEle._id);
    }else{ //update
      ele.anyElements = ele.anyElements.map(a => a._id === updateEle._id ? updateEle: a);
    }
    handleEle(ele);
  }

  return (
    <div className="flow-element">
      <fieldset>
        <legend>执行元素</legend>
        <SingleElement props={{
          ele: ele,
          handleEle: handleEle
        }}/>
        <Row>
          <button type="button" onClick={addCombileEle}>任一元素</button>
        </Row>
        {
          ele.anyElements && ele.anyElements.length > 0 &&
          (
            <Row>
              {
                ele.anyElements.map(a => {
                  return (<CombineElement key={a._id} props={{
                    ele: a,
                    handleEle: handleEleAny
                  }}/>)
                })
              }
            </Row>
          )
        }
      </fieldset>
    </div>
  )
}