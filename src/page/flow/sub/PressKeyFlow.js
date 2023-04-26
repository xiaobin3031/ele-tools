import Row from "../../../component/Row";
import Select from "../../../component/Select";
import { androidKeys } from "../data/androidKey";

export default function PressKeyFlow({props: {flow, handleFlow}}){

  const pressKeyType = [
    {
      name: "back",
      desc: "返回键"
    },
    {
      name: "menu",
      desc: "菜单键"
    },
    {
      name: "key",
      desc: "按键"
    }
  ]

  function handlePressKey(event){
    flow[event.target.getAttribute('realname')] = event.target.value;
    handleFlow(flow);
  }

  return (
    <div>
      <Row>
        <label>按键类型: </label>
        <Select list={pressKeyType} showSelect={false} attr={{
          realname: 'keyType',
          onChange: handlePressKey,
          defaultValue: flow.keyType
        }} />
        {
          flow.keyType === 'key' &&
            <Select list={androidKeys} showSelect={false} attr={{
              style: {
                "marginLeft": "10px"
              },
              realname: 'key',
              onChange: handlePressKey,
              defaultValue: flow.key
            }}/>
        }
      </Row>
    </div>
  )
}