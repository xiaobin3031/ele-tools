// 内部函数调用
import { buildIn } from '../data/flowData'
import Row from '../../../component/Row'
import Select from '../../../component/Select';

export default function BuildInFlow({props: {flow, handleFlow}}){

  function handleMethodName(event){
    flow[event.target.name] = event.target.value;
    handleFlow(flow);
  }

  return (
    <Row>
        <label>函数名称:</label>
        <Select list={buildIn} attr={{
          name: "methodName",
          onChange: handleMethodName,
          defaultValue: flow.methodName
        }} />
    </Row>
  )
}