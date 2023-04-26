import { useState } from "react";
import Row from "../../../component/Row";
import Tips from "../../../component/Tips";

export default function RecycleViewFlow({props: {flow, handleFlow}}){

  // 1 指定下标, 2 范围下标，3 随机下标
  const [inputType, setInputType] = useState(!!flow.indexes && flow.indexes.length > 0 ? "1": !!flow.random ? "3": "2");

  function handleRecycleView(event){
    const name = event.target.getAttribute('realname');
    const value = event.target.value;
    switch(name){
      case 'indexType':
        setInputType(value);
        break;
      default:
        flow[name] = value;
        handleFlow(flow);
        break;
    }
  }

  return (
    <div>
      <Row>
        <label>下标方式</label>
        <label><input type="radio" name={`indexType-${flow._id}`} onChange={handleRecycleView} realname="indexType" checked={inputType === "1"} value={1} />指定</label>
        <label><input type="radio" name={`indexType-${flow._id}`} onChange={handleRecycleView} realname="indexType" checked={inputType === "2"} value={2} />范围</label>
        <label><input type="radio" name={`indexType-${flow._id}`} onChange={handleRecycleView} realname="indexType" checked={inputType === "3"} value={3} />随机</label>
      </Row>
      <Row>
        {
          inputType === "1" &&
            <input realname="indexes" placeholder="0 2 3 4 ..." defaultValue={flow.indexes.join(' ')} onChange={handleRecycleView}/>
        }
        {
          inputType === "2" &&
            (
              <div>
                <label>开始</label>
                <input type="number" realname="rangeBegin" defaultValue={flow.rangeBegin} onChange={handleRecycleView} />
                <label style={{ "marginLeft": "10px" }}>结束</label>
                <input type="number" realname="rangeEnd" defaultValue={flow.rangeEnd} onChange={handleRecycleView} />
              </div>
            )
        }
        {
          inputType === "3" &&
            (
              <div>
                <label>点击次数<Tips title="如果列表数小于点击次数，则会出现重复的下标，即优先保证点击次数" /></label>
                <input type="number" realname="randomCount" defaultValue={flow.randomCount} onChange={handleRecycleView} />
              </div>
            )
        }
      </Row>
    </div>
  )
}