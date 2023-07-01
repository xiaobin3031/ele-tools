import React, { useEffect, useState } from 'react';
import { Button } from '../../component/Button';
import Row from '../../component/Row';
import { globalId } from '../../util/global';
import { stepNames } from './data/data';
import { initFlow } from './data/init';
import './posAuto.css'
import Step from './Step';
import { formatStepData } from './data/format'
import StepList from './StepList';

export default function PosAuto({}){

  useEffect(() => {
    window.posRemote.start();

    return () => {
      window.posRemote.stop();
    }
  }, [])
  
  const [steps, setSteps] = useState(window.posDb.readSteps({}));
  const [step, setStep] = useState(null);

  function addStep(){
    let _step = {perform: stepNames[0].name, _id: globalId()}
    _step = initFlow(_step);
    setStep(_step);
  }

  function delStep(_id){
    setStep(null);
    if(!!_id){
      const _steps = steps.filter(a => a._id !== _id);
      setSteps(_steps)
      window.posDb.saveSteps({list:_steps});
    }
  }

  function toModifyStep(_id){
    if(step != null){
      if(!window.confirm("当前流程正在修改，是否覆盖?")){
        return;
      }
    }
    const _step = steps.filter(a => a._id === _id)[0];
    if(!!_step){
      const stepName = stepNames.filter(a => a.name === _step.perform)[0];
      if(!!stepName){
        _step.showEle = stepName.showEle;
        _step.hasSubSteps = stepName.hasSubSteps;
      }
      _step._modify = true;
      setStep(_step);
    }
  }

  function saveStep(_step){
    const tmpStep = formatStepData(_step);
    setStep(null);
    setSteps(steps.merge(tmpStep))
    window.posDb.saveOrUpdateStep({step: tmpStep});
  }

  /**
   * 移动步骤的顺序，
   * @param  index 步骤的下标索引
   * @param  direction 0 上移，1 下移
   */
  function stepChangePosition(index, direction){
    if(index < 0 || index >= steps.length){
      return;
    }
    let _steps = steps.splice(index, 1);
    if(0 === direction){
      index = index - 1;
    }else if(1 === direction){
      index = index + 1;
    }
    if(index >= 0 && index <= steps.length && !!_steps){
      steps.splice(index, 0, _steps[0]);
      setSteps([...steps]);
      window.posDb.saveSteps({list: steps});
    }
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
        !!steps && steps.length > 0 && 
          <StepList _steps={steps} _stepRemove={delStep} _stepModify={toModifyStep} _stepChangePosition={stepChangePosition}/>
      }
    </Row>
  )
}