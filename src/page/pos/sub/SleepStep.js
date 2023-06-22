import Input from "../../../component/Input";
import Label from "../../../component/Label";
import Row from "../../../component/Row";

export default function SleepStep({_step, _stepChange}){

  function valueChange(event){
    _step[event.target.name] = event.target.value;
    _stepChange({..._step})
  }

  return (
    <Row>
      <Label size="sm">睡眠时间/秒</Label>
      <Input style={{width: '100px'}} size="sm" value={_step.sleep} name="sleep" onChange={valueChange} />
    </Row>
  )
}