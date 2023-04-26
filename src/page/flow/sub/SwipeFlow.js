import Row from "../../../component/Row"
import Select from "../../../component/Select"

export default function SwipeFlow({props: {flow, handleFlow}}){

  const directions = [
    {
      name: 'up',
      desc: '上'
    },
    {
      name: 'down',
      desc: '下'
    },
    {
      name: "left",
      desc: '左'
    },
    {
      name: "right",
      desc: '右'
    }
  ]

  function handleSwipe(event){
    flow[event.target.getAttribute('realname')] = event.target.value;
    handleFlow(flow);
  }

  return (
    <Row>
      <label>选择方向</label>
      <Select list={directions} showSelect={false} attr={{
        defaultValue: flow.direction,
        realname: 'direction',
        onChange: handleSwipe
      }}/>
    </Row>
  )
}