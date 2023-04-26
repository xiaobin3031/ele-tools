// 一个流程
import { flows as flowsData } from "./data/flowData"
import BuildInFlow from "./sub/BuildInFlow";
import CacheFlow from "./sub/CacheFlow";
import CheckFlow from "./sub/CheckFlow";
import ClickFlow from "./sub/ClickFlow";
import PressKeyFlow from "./sub/PressKeyFlow";
import RecycleViewFlow from "./sub/RecycleViewFlow";
import SleepFlow from "./sub/SleepFlow";
import SwipeFlow from "./sub/SwipeFlow";
import WaitFlow from "./sub/WaitFlow";
import WhileFlow from "./sub/WhileFlow";
import InputFlow from "./sub/InputFlow";
import Row from "../../component/Row";
import { useState } from "react";
import Element from "./Element";
import * as flowInit from "./data/flowInit"
import Select from "../../component/Select";

export default function Flow({props: {_flow, _handleFlow, _saveFlow}}){

  const flow = {..._flow};
  let _showEle = flowsData.filter(a => a.name === flow.perform)[0];
  if(!!_showEle){
    _showEle = _showEle.showEle;
  }else{
    _showEle = false;
  }
  const [showEle, setShowEle] = useState(_showEle);
  const [ele, setEle] = useState(!!flow._modify ? {...flow.element} : flowInit.initElement({}));
  const [broke, setBroke] = useState(!!flow._modify && !!flow.broke ? {...flow.broke} : flowInit.initBroke({}));

  function handlePerform(event){
    const newFlow = {_id: flow._id, _id_prefix: flow._id_prefix};
    newFlow.perform = event.target.value;
    setShowEle(!!flowsData.filter(a => a.name === event.target.value)[0].showEle);
    flowInit.initFlow(newFlow);
    _handleFlow({
      ...newFlow,
      perform: event.target.value
    })
  }

  function handleEle(updateEle){
    setEle({ ...ele, ...updateEle })
    _handleFlow({element: ele})
  }

  function handleAnyEle(type, anyEle){
    if(type === 1){ // add
      setEle({
        ...ele,
        anyElements: [
          ...ele.anyElements,
          anyEle
        ]
      })
    }else if(type === 2){ // delete
      setEle({
        ...ele,
        anyElements: ele.anyElements.filter(a => a._id !== anyEle._id)
      })
    }else{ // update
      setEle({
        ...ele,
        anyElements: ele.anyElements.map(a => a._id === anyEle._id ? anyEle: a)
      })
    }
  }

  function handleBroke(updateBroke){
    const _broke = {...broke, ...updateBroke}
    setBroke(_broke)
    _handleFlow({...flow, broke: _broke});
  }

  function saveFlowWithCheck(){
    _saveFlow(flow);
  }

  function delFlow(){
    if(window.confirm('是否删除该流程')){
      _handleFlow(flow, 2);
    }
  }

  return (
    <div className="flow">
      <fieldset>
        <legend>流程: {flow._id}</legend>
        <Row>
          <Select list={flowsData} attr={{ defaultValue: flow.perform, onChange: handlePerform }} />
        </Row>
        {
          showEle && <Element props={{
            ele: ele,
            handleEle: handleEle,
            handleAnyEle: handleAnyEle
          }} />
        }
        <Row>
            {
              flow.perform === 'buildIn' &&
                <BuildInFlow props={{
                  flow: flow,
                  handleFlow: _handleFlow
                }} />
            }
            {
              flow.perform === 'cache' &&
                <CacheFlow props={{
                  flow: flow,
                  handleFlow: _handleFlow
                }}/>
            }
            {
              flow.perform === 'check' &&
                <CheckFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'click' &&
                <ClickFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'input' &&
                <InputFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'pressKey' &&
                <PressKeyFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'recycleView' &&
                <RecycleViewFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'sleep' &&
                <SleepFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'swipe' &&
                <SwipeFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'wait' &&
                <WaitFlow props={{ flow: flow, handleFlow: _handleFlow }}/>
            }
            {
              flow.perform === 'while' &&
                <WhileFlow props={{
                  flow: flow,
                  broke: broke,
                  handleFlow: _handleFlow,
                  handleBroke: handleBroke
                }}/>
            }
        </Row>
        <Row>
          <button type="button" onClick={saveFlowWithCheck}>保存</button>
          <button type="button" onClick={delFlow} style={{ color: 'red', 'marginLeft': '10px'}}>删除</button>
        </Row>
      </fieldset>
    </div>
  )
}