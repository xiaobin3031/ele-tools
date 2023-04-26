import { useState } from "react";
import Row from "../../../component/Row";
import Select from "../../../component/Select";

export default function InputFlow({props: {flow, handleFlow}}){

  const [contentType, setContentType] = useState("1");

  function handleInput(event){
    const name = event.target.getAttribute('realname');
    const value = event.target.value;
    switch(name){
      case 'inputContentType':
        setContentType(value);
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
        <label>输入方式: </label>
        <label><input type="radio" name={`inputContentType-${flow._id}`} realname="inputContentType" value="1" onChange={handleInput} checked={contentType === "1"} />文本</label>
        <label><input type="radio" name={`inputContentType-${flow._id}`} realname="inputContentType" value="2" onChange={handleInput} checked={contentType === "2"} />随机数</label>
        <label><input type="radio" name={`inputContentType-${flow._id}`} realname="inputContentType" value="3" onChange={handleInput} checked={contentType === "3"} />缓存</label>
      </Row>
      {
        contentType === "1" &&
        <Row>
          <label>文本内容</label>
          <input onChange={handleInput} defaultValue={flow.text} realname="text" />
        </Row>
      }
      {
        contentType === "2" &&
        <Row>
          <label>最大值</label>
          <input type="number" onChange={handleInput} defaultValue={flow.randomMax} realname="randomMax" />
          <label style={{ "marginLeft": "10px" }}>最小值</label>
          <input type="number" onChange={handleInput} defaultValue={flow.randomMin} realname="randomMin" />
          <label style={{ "marginLeft": "10px" }}>小数位数</label>
          <Select showSelect={false} list={[0, 1, 2]} attr={{
            defaultValue: 0,
            realname: 'scale',
            onChange: handleInput
          }}/>
        </Row>
      }
      {
        contentType === "3" &&
        <Row>
          <label>缓存Key</label>
          <input onChange={handleInput} defaultValue={flow.cacheKey} realname="cacheKey" />
        </Row>
      }
    </div>
  )
}