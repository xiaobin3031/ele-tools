import Input from "../../../component/Input";
import Label from "../../../component/Label";
import Row from "../../../component/Row";
import BrokeStep from "./BrokeStep";

export default function WaitStep({_step, _stepChange}){

  function brokeChange(broke){
    _step.broke = broke;
    _stepChange({..._step})
  }

  function valueChange(event){
    _step[event.target.name] = event.target.value;
    _stepChange({..._step})
  }
  return (
    <>
      <Row>
        <BrokeStep broke={_step.broke} _brokeChange={brokeChange}/>
      </Row>
      <Row>
        <Label size="sm">每次等待间隔</Label>
        <Input style={{width: '100px'}} size="sm" name="time" value={_step.time} onChange={valueChange} />

        <Label size="sm" style={{marginLeft: '20px'}}>最大等待时间</Label>
        <Input style={{width: '100px'}} size="sm" name="maxTime" value={_step.maxTime} onChange={valueChange} />
      </Row>
    </>
  )
}