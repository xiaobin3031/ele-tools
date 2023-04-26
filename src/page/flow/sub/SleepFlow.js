import Row from "../../../component/Row";

export default function SleepFlow({props: {flow, handleFlow}}){
  
  function handleSleep(event){
    flow[event.target.getAttribute('realname')] = event.target.value;
    handleFlow(flow);
  }
  return (
    <Row>
      <label>睡眠时间</label>
      <input type="number" defaultValue={flow.sleep} onChange={handleSleep} realname="sleep"/>
    </Row>
  )
}