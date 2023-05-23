import React, { useEffect, useState } from 'react';
import { Button } from '../../component/Button';
import Row from '../../component/Row';
import globalId from '../../util/globalId';
import { stepNames } from './data/data';
import { initFlow } from './data/init';
import './posAuto.css'
import Step from './Step';
import { formatStepData, formatSteps } from './data/format'

export default function PosAuto({}){

  const [steps, setSteps] = useState({});

  useEffect(() => {
    const _steps = window.posDb.readSteps({});
    console.log('_steps', _steps);
    setSteps(_steps);
  }, [])

  function addStep(){
    let _step = {perform: stepNames[0].name, _id: globalId()}
    _step = initFlow(_step);
    setSteps([ ...steps, _step ])
  }

  function delStep(_id){
    setSteps(steps.filter(a => a._id !== _id))
  }

  function saveStep(_step){
    window.posDb.saveOrUpdateStep({step: formatStepData(_step)});
  }

  return (
    <div className="pos-auto-args">
      <Row>
        <Button onClick={addStep}>添加步骤</Button>
      </Row>
      <div className="pos-auto">
        {
          steps.length > 0 && 
            steps.map(a => {
              return <Step key={a._id} _step={a} _delStep={delStep} _saveStep={saveStep} />
            })
        }
      </div>
    </div>
  )
}