import Row from "../../../component/Row";
import Select from "../../../component/Select";
import { flows as flowsData } from "../data/flowData";
import FlowList from "../FlowList";

export default function CacheFlow({props: {flow, handleFlow }}){

  function handleActivity(event){
    flow.activity = event.target.value;
    handleFlow(flow);
  }

  function handleMatchFlows(flows){
    flow.match.flows = [...flows];
    handleFlow(flow);
  }
  function handleMismatchFlows(flows){
    flow.mismatch.flows = [...flows];
    handleFlow(flow);
  }

  return (
    <div>
      <Row>
        <label>当前所处页面</label>
        <Select list={flowsData} attr={{
          onChange: handleActivity
        }}/>
      </Row>
      <Row>
        <FlowList
          props={{
            handleFlows: handleMatchFlows,
            btnName: '匹配时执行',
            flowIdPrefix: 'check-match-flow'
          }}
         />
      </Row>
      <Row>
        <FlowList
          props={{
            handleFlows: handleMismatchFlows,
            btnName: '不匹配时执行',
            flowIdPrefix: 'check-mismatch-flow'
          }}
         />
      </Row>
    </div>
  )
}