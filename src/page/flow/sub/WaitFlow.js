import Row from "../../../component/Row";
import FlowList from "../FlowList";
import Broke from "./Broke";

export default function WaitFlow({props: {flow, handleFlow, broke, handleBroke}}){

  function handleWait(event){
    flow[event.target.getAttribute('realname')] = event.target.value;
    handleFlow(flow);
  }

  function handleFlows(flows){
    flow.flows = flows;
    handleFlow(flow);
  }

  return (
    <div>
      <Row>
        <Broke props={{
          broke: broke,
          handleBroke: handleBroke
        }} />
      </Row>
      <Row>
        <label>每次等待时间: </label>
        <input type="number" defaultValue={flow.time} onChange={handleWait} realname="time"/>
      </Row>
      <Row>
        <label>最大等待时间: </label>
        <input type="number" defaultValue={flow.maxTime} onChange={handleWait} realname="maxTime"/>
      </Row>
      <FlowList props={{
        btnName: '超出最大等待时间后的流程',
        flowIdPrefix: 'wait-flow',
        handleFlows: handleFlows
      }} />
    </div>
  )
}