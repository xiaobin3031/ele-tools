import { flows as flowsData } from "./data/flowData";
import Row from "../../component/Row";
import {activities} from './data/flowData'

import './css/flow.css'

// 流程展示
function Broke(_broke){
  let _brokeInfo;
  if(_broke.activity || (_broke.activities && _broke.activities.length > 0)){
    let _acs, _ac;
    if(_broke.activity){
      _ac = activities.filter(a => a.name === _broke.activity)[0];
      _acs = !!_ac ? _ac.desc : _broke.activity;
    }else{
      _acs = _broke.activities.map(a => {
        _ac = activities.filter(b => b.name === a)[0];
        return !!_ac ? _ac.desc: a;
      }).join(' ');
    }
    _brokeInfo = `activity: ${_acs}`
  }else{
    _brokeInfo = (<SingleElement {..._broke.element}/>)
  }
  return (
    <Row>
      <label>中断: {_brokeInfo}</label>
    </Row>
  )
}
function Element(_ele){

  return (
    <div>
      {
        !!_ele.anyElements && _ele.anyElements.length > 0 && 
          <CombineElement {..._ele.anyElements} />
      }
      {
        (!_ele.anyElements || _ele.anyElements.length === 0) &&
          <SingleElement {..._ele}/>
      }
    </div>
  )
}
function CombineElement(_anyEles){

}
function SingleElement(_ele){
  let prefix;
  let eleTxt;
  if(!!_ele.id){
    prefix = 'id';
    eleTxt = _ele.id;
  }else if(!!_ele.text){
    prefix = 'text';
    eleTxt = _ele.text;
  }else if(!!_ele.anyElements && _ele.anyElements.length > 0){
    prefix = 'anyElement';
    eleTxt = _ele.anyElements.map(a => {
        if(a.id){
          return `id: ${a.id}`
        }else if (a.text){
          return `text: ${a.text}`
        }else{
          return null;
        }
      }).filter(a => !!a).join(' , ');
  }else{
    prefix = 'none';
    eleTxt = '';
  }
  return (
    <span className="single-element">
      <span className="single-element-prefix">{prefix}: </span>
      <span className="single-element-text">{eleTxt}</span>
      {
        _ele.notInRoot && <label className="single-element-label">NotInRoot</label>
      }
      {
        _ele.optional && <label className="single-element-label">Optional</label>
      }
      {
        _ele.multi && <label className="single-element-label">Multi</label>
      }
    </span>
  )
}
function BuildInFlow(_flow){

}
function CacheFlow(_flow){

}
function CheckFlow(_flow){

}
function ClickFlow(_flow){

}
function InputFlow(_flow){

}
function PressKeyFlow(_flow){

}
function RecycleViewFlow(_flow){

}
function SleepFlow(_flow){

}
function SwipeFlow(_flow){

}
function WaitFlow(_flow){

}
function WhileFlow(_flow){
  return (
    <Row>
      <Broke {..._flow.broke}/>
      <Row>
        <label>sleep: {_flow.sleepTime} 秒</label>
        <label style={{
          'marginLeft': '10px'
        }}>maxCount: {_flow.maxCount <= -1 ? '不限制': _flow.maxCount}</label>
      </Row>
      {
        !!_flow.flows && _flow.flows.length > 0 && 
          <Row>
            <label>子流程数: {_flow.flows.length}</label>
          </Row>
      }
    </Row>
  )
}

export default function FlowDisplay({props: { flow, delFlow, modifyFlow }}){
  const flowPerform = flowsData.filter(a => a.name === flow.perform)[0] || {};

  function confirmToDelFlow(){
    if(window.confirm('是否删除该流程')){
      delFlow(flow);
    }
  }

  return (
    <div className="flow-card">
      <div className="flow-card-head">
        {flowPerform.desc}
        {
          !!flow.name && 
          (
            <span>: <span>{flow.name}</span></span>
          )
        }
      </div>
      <div style={{
        "borderBottomWidth": "thick"
      }}></div>
      <div className="flow-card-content">
          {
            flow.perform === 'buildIn' &&
              <BuildInFlow {...flow}/>
          }
          {
            flow.perform === 'cache' &&
              <CacheFlow {...flow}/>
          }
          {
            flow.perform === 'check' &&
              <CheckFlow {...flow}/>
          }
          {
            flow.perform === 'click' &&
              <ClickFlow {...flow}/>
          }
          {
            flow.perform === 'input' &&
              <InputFlow {...flow}/>
          }
          {
            flow.perform === 'pressKey' &&
              <PressKeyFlow {...flow}/>
          }
          {
            flow.perform === 'recycleView' &&
              <RecycleViewFlow {...flow}/>
          }
          {
            flow.perform === 'sleep' &&
              <SleepFlow {...flow}/>
          }
          {
            flow.perform === 'swipe' &&
              <SwipeFlow {...flow}/>
          }
          {
            flow.perform === 'wait' &&
              <WaitFlow {...flow}/>
          }
          {
            flow.perform === 'while' &&
              <WhileFlow {...flow}/>
          }
      </div>
      {
        !flow._modify && 
        <div className="flow-card-foot">
            <button type="button" onClick={confirmToDelFlow} style={{
              color: 'red',
              position: 'relative',
              float: 'left'
            }}>删除</button>
            <button type="button" onClick={() => modifyFlow(flow)} style={{
              color: 'blue',
              position: 'relative',
              float: 'right'
            }}>修改</button>
        </div>
      }
      
    </div>
  )
}