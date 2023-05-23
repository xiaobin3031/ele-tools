import { useEffect, useRef, useState } from "react";
import Input from "../../../component/Input";
import Label from "../../../component/Label";
import Row from "../../../component/Row";
import BrokeStep from "./BrokeStep";

export default function WhileStep({_step, _stepChange}){

  const [step, setStep] = useState({
    broke: {
      element: {}
    }
  });

  useEffect(() => {
    setStep(_step)
  }, [_step])

  const [values, setValues] = useState({
    sleepTime: _step.sleepTime,
    maxCount: _step.maxCount
  })

  function brokeChange(broke){
    const step = {..._step, broke: broke}
    setStep(step)
    _stepChange(step)
  }

  function stepValueChange(event){
    values[event.target.name] = event.target.value;
    setValues({...values})
    const step = {..._step, ...values}
    setStep(step)
    _stepChange(step)
  }

  return (
    <>
      <Row>
        <BrokeStep broke={_step.broke} _brokeChange={brokeChange}/>
      </Row>
      <Row>
        <Label size="sm">每次循环的间隔: </Label>
        <Input style={{ width: '50px' }} size="sm" type="number" name="sleepTime" 
          value={!!values.sleepTime ? values.sleepTime : -1} onChange={stepValueChange} />

        <Label style={{ marginLeft: '10px' }} size="sm">最大尝试次数: </Label>
        <Input style={{ width: '50px' }} size="sm" type="number" name="maxCount" 
          value={!!values.maxCount ? values.maxCount : 0} onChange={stepValueChange} />
      </Row>
    </>
  )
}