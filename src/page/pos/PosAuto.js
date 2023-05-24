import React, { useEffect, useState } from 'react';
import { Button } from '../../component/Button';
import Row from '../../component/Row';
import globalId from '../../util/globalId';
import { stepNames } from './data/data';
import { initFlow } from './data/init';
import './posAuto.css'
import Step from './Step';
import { formatStepData, formatSteps } from './data/format'
import StepList from './StepList';

export default function PosAuto({}){
new Array
  const [steps, setSteps] = useState(window.posDb.readSteps({}));
  const [step, setStep] = useState(null);

  function addStep(){
    let _step = {perform: stepNames[0].name, _id: globalId()}
    _step = initFlow(_step);
    setStep(_step);
  }

  function delStep(_id){
    setStep(null);
    // setSteps(steps.filter(a => a._id !== _id))
  }

  function saveStep(_step){
    const tmpStep = formatStepData(_step);
    setStep(null);
    setSteps(steps.merge(tmpStep))
    window.posDb.saveOrUpdateStep({step: tmpStep});
  }

  return (
    <Row className="pos-auto">
      <Row>
        <Button onClick={addStep}>添加步骤</Button>
      </Row>
      {
        !!step && <Step key={step._id} _step={step} _delStep={delStep} _saveStep={saveStep} />
      }
      {
        !!steps && steps.length > 0 && <StepList _steps={steps} />
      }
    </Row>
  )
}