import { useState } from "react"
import Row from "../../component/Row";
import Flow from "./Flow";
import { createFlow } from "./data/flowInit";
import FlowDisplay from "./FlowDisplay";

import './css/flow.css'

export default function FlowList({props: { btnName = '添加流程', flowLegend = '流程', flowIdPrefix = 'flow', handleFlows }}){

  const [flows, setFlows] = useState([]);
  const [flow, setFlow] = useState(null);

  function addFlow(){
    if(!!flow){
      return;
    }
    setFlow(createFlow(flowIdPrefix));
  }

  function handleFlow(_flow, type){
    if(type === 2){ // delete
      setFlow(null);
      delFlow(_flow);
    }else{ // update
      setFlow({...flow, ..._flow});
    }
  }

  function saveFlow(flow, index = -1){
    console.log('save.flow', flow);
    let newFlows;
    if(!!flow._modify){
      delete flow._modify;
      newFlows = flows.map(a => a._id === flow._id ? flow : a);
    }else{
      if(index < 0 || index >= flows.length){
        newFlows = [...flows, flow];
      }else{
        flows.splice(index, 0, flow)
        newFlows = [...flows]
      }
    }
    setFlow(null);
    setFlows(newFlows)
    handleFlows(newFlows);
  }

  function delFlow(_flow){
    if(!!_flow){
      let newFlows = flows.filter(a => a._id !== _flow._id);
      setFlows(newFlows)
      handleFlows(newFlows);
    }
  }

  function modifyFlow(_flow){
    if(!!flow){
      window.alert('请先完成当前流程')
      return;
    }
    _flow._modify = true;
    setFlow(_flow);
  }

  return (
    <div>
      <Row>
          <button type="button" onClick={addFlow}>{btnName}</button>
      </Row>
      {
        !!flow && 
          <Flow props={{
            _flow: flow,
            _handleFlow: handleFlow,
            _saveFlow: saveFlow
          }}/>
      }
      {
        flows.length > 0 &&
          <Row>
            <div className="flow-list">
              {
                flows.map(a => {
                  return (<FlowDisplay key={a._id} props={{
                    flow: a,
                    modifyFlow: modifyFlow,
                    delFlow: delFlow
                  }} />)
                })
              }
            </div>
          </Row>
      }
    </div>
  )
}