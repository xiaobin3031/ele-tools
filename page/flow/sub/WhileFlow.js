import Row from "../../../component/Row";
import Input from "../../../component/Input";
import Label from "../../../component/Label";
import Broke from "./Broke";
import FlowList from "../FlowList";

// 循环流程
export default function WhileFlow({props: {flow, broke, handleFlow, handleBroke}}){

  function handleWhile(event){
    flow[event.target.name] = event.target.value;
    handleFlow(flow);
  }

  function handleFlows(flows){
    flow.flows = flows;
    handleFlow(flow);
  }

  return (
    <Row>
      <Row>
        <Broke props={{
          broke: broke,
          handleBroke: handleBroke
        }} />
      </Row>
      <Row>
        <Label>每次循环的间隔: </Label>
        <Input type="number" name="sleepTime" defaultValue={flow.sleepTime} onChange={handleWhile} />
      </Row>
      <Row>
        <label>最大尝试次数: </label>
        <Input type="number" name="maxCount" defaultValue={flow.maxCount} onChange={handleWhile} />
      </Row>
      <FlowList props={{
        btnName: "循环流程",
        flowIdPrefix: 'while-flow',
        handleFlows: handleFlows
      }}/>
    </Row>
  )
}