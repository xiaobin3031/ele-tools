import Row from "../../../component/Row";
import Element from "../Element";
import * as flowInit from "../data/flowInit"
import Select from "../../../component/Select";
import {activities} from "../data/flowData"
import { useState } from "react";

export default function Broke({props:{ broke, handleBroke }}){

  const useEle = !broke.activity && (!broke.activities || broke.activities.length === 0);
  const [ele, setEle] = useState(useEle ? {...broke.element} : flowInit.initElement({}))

  const [brokeType, setBrokeType] = useState(useEle ? "1" : "2");

  function handleEle(updateEle){
    setEle({...ele, ...updateEle})
    broke.element = ele;
    broke.activities = [];
    handleBroke(broke);
  }

  function handleActivity(event){
    broke.activities = Array.from(event.target.selectedOptions).map(a => a.value);
    broke.element = flowInit.initElement({});
    debugger;
    handleBroke(broke);
  }

  function handleBrokeType(event){
    setBrokeType(event.target.value);
  }

  return (
    <fieldset>
      <legend>中断条件</legend>
      <Row>
        <label>中断方式</label>
        <label><input type="radio" name="brokeType" value="1" onChange={handleBrokeType} checked={brokeType === "1"}/>按元素</label>
        <label><input type="radio" name="brokeType" value="2" onChange={handleBrokeType} checked={brokeType === "2"}/>按功能页面</label>
      </Row>
      {
        brokeType === "1" &&
          <Row>
            <Element props={{
              ele: ele,
              handleEle: handleEle
            }}/>
          </Row>
      }
      {
        brokeType === "2" &&
          <Row>
            <label>功能页面</label>
            <Select list={activities} showSelect={false} attr={{
              multiple: true,
              onChange: handleActivity
            }}/>
          </Row>
      }
    </fieldset>
  )
}