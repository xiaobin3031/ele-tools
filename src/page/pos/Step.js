// 流程
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../component/Button';
import Input from '../../component/Input';
import Row from '../../component/Row';
import Select2 from '../../component/Select2';
import { globalId } from '../../util/global';
import { stepNames } from './data/data';
import { initFlow } from './data/init';
import Ele from './Ele';
import './posAuto.css'
import BuildInStep from './sub/BuildInStep';
import CacheStep from './sub/CacheStep';
import CheckStep from './sub/CheckStep';
import ClickStep from './sub/ClickStep';
import InputStep from './sub/InputStep';
import PressKeyStep from './sub/PressKeyStep';
import RecycleViewStep from './sub/RecycleViewStep';
import SleepStep from './sub/SleepStep';
import SwipeStep from './sub/SwipeStep';
import WaitStep from './sub/WaitStep';
import WhileStep from './sub/WhileStep';
import { formatStepData } from './data/format'
import StepList from './StepList';
import Label from '../../component/Label';

export default function Step({_step, _delStep, _saveStep}){
  const [step, setStep] = useState({..._step});
  const [steps, setSteps] = useState(_step.flows || []);
  const [stepCanModify, setStepCanModify] = useState(!!_step._modify);
  const [matchSteps, setMatchSteps] = useState(_step.match ? _step.match.flows : [])
  const [mismatchSteps, setMismatchSteps] = useState(_step.mismatch ? _step.mismatch.flows : [])
  const [subStep, setSubStep] = useState(null)

  const setFlows = useRef(null);
  const flows = useRef(null);

  function saveValueFromOld(newStep){
    if(step != null){
      newStep.name = step.name;
      newStep.description = step.description;
    }
  }

  function changeStepName(event){
    const val = event.target.value;
    const step = initFlow({perform: val, _id: _step._id});
    saveValueFromOld(step)
    setStep(step);
    setSubStep(null)
    if(!!step.hasSubSteps){
      setSteps([]);
    }
  }

  function stepChange(_step){
    setStep({...step, ..._step});
  }

  function valueChange(event){
    step[event.target.name] = event.target.value;
    setStep({...step})
  }

  function eleChange(ele){
    setStep({...step, element: ele})
  }

  function addSubStep(_list){
    if(subStep != null) return;
    const step = initFlow({perform: stepNames[0].name, _id: globalId()})
    setSubStep(step)
    return true
  }
  function addStep(){
    if(addSubStep(steps)){
      flows.current = steps;
      setFlows.current = setSteps;
    }
  }

  function addMatchStep(){
    if(addSubStep(matchSteps)){
      flows.current = matchSteps;
      setFlows.current = setMatchSteps
    }
  }
  function addMismatchStep(){
    if(addSubStep(mismatchSteps)){
      flows.current = mismatchSteps;
      setFlows.current = setMismatchSteps;
    }
  }

  function saveStep(){
    !!_saveStep && _saveStep(step);
    setStepCanModify(false);
  }

  function delStep(){
    if(window.confirm("是否删除当前步骤?")){
      !!_delStep && _delStep(_step._id);
    }
  }

  function toModifyStep(){
    setStepCanModify(true);
  }

  function toModifySubStep(_id){
    if(subStep != null){
      if(!window.confirm("当前流程正在修改，是否覆盖?")){
        return;
      }
    }
    const _step = flows.current.filter(a => a._id === _id)[0];
    if(!!_step){
      const stepName = stepNames.filter(a => a.name === _step.perform)[0];
      if(!!stepName){
        _step.showEle = stepName.showEle;
        _step.hasSubSteps = stepName.hasSubSteps;
      }
      _step._modify = true;
      setSubStep(_step);
    }
  }

  function delSubStep(_id){
    setSubStep(null)
    if(!!_id){
      const _steps = flows.current.filter(a => a._id !== _id)
      setFlows.current(_steps)
    }
  }

  function saveSubStep(_step){
    const tmpStep = formatStepData(_step);
    setSubStep(null)
    setFlows.current(flows.current.merge(tmpStep))
  }

    /**
   * 移动步骤的顺序，
   * @param  index 步骤的下标索引
   * @param  direction 0 上移，1 下移
   */
    function subStepChangePosition(index, direction){
      if(index < 0 || index >= flows.current.length){
        return;
      }
      let _steps = flows.current.splice(index, 1);
      if(0 === direction){
        index = index - 1;
      }else if(1 === direction){
        index = index + 1;
      }
      if(index >= 0 && index <= flows.current.length && !!_steps){
        flows.current.splice(index, 0, _steps[0]);
        setFlows.current([...flows.current]);
      }
    }

  return (
    <div className='step-card' key={_step._id}>
      <div className='head'>
        <Row>
          <Input size="sm" name="name" placeholder="请输入步骤名称" onChange={valueChange} value={step.name}/>
          <Input size="sm" name="description" placeholder="请输入步骤描述" onChange={valueChange} value={step.description}/>
        </Row>
        <Row>
          <Select2 value={step.perform} list={stepNames} onChange={changeStepName} showSelect={false}/>
          {
            !!step.showEle && <Ele _eleChange={eleChange} ele={step.element}/>
          }
        </Row>
      </div>
      {
        <>
          {
            step.perform !== 'click' && <hr />
          }
          <div className='body'>
            {
              step.perform === 'while' && <WhileStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'buildIn' && <BuildInStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'cache' && <CacheStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'check' && <CheckStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'click' && <ClickStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'input' && <InputStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'pressKey' && <PressKeyStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'recycleView' && <RecycleViewStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'sleep' && <SleepStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'swipe' && <SwipeStep _step={step} _stepChange={stepChange}/>
            }
            {
              step.perform === 'wait' && <WaitStep _step={step} _stepChange={stepChange}/>
            }
          </div>
        </>
      }
      {
        !!subStep && 
          <Row>
            <Step key={subStep._id} _step={subStep} _delStep={delSubStep} _saveStep={saveSubStep} />
          </Row>
      }
      {
        !!step && step.hasSubSteps &&
        <>
          {
            !!steps && steps.length > 0 &&
              <>
                <hr />
                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <StepList _steps={steps} _stepRemove={delSubStep} _stepModify={toModifySubStep} _stepChangePosition={subStepChangePosition}/>
                </div>
              </>
          }
        </>
      }
      {
        !!step && 'check' === step.perform && 
          <>
            {
              !!matchSteps && matchSteps.length > 0 &&
                <>
                  <hr />
                  <Row> <Label size='sm'>匹配时的流程</Label></Row>
                  <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <StepList _steps={matchSteps} _stepRemove={delSubStep} _stepModify={toModifySubStep} _stepChangePosition={subStepChangePosition}/>
                  </div>
                </>
            }
            {
              !!mismatchSteps && mismatchSteps.length > 0 &&
                <>
                  <hr />
                  <Row> <Label size='sm'>不匹配时的流程</Label></Row>
                  <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <StepList _steps={mismatchSteps} _stepRemove={delSubStep} _stepModify={toModifySubStep} _stepChangePosition={subStepChangePosition}/>
                  </div>
                </>
            }
          </>
      }
      <hr />
      <div className='foot'>
        <div>
          {
            step.hasSubSteps && stepCanModify && <Button size='sm' onClick={addStep}>添加步骤</Button>
          }
          {
            'check' === step.perform && 
              <>
                <Button size='sm' onClick={addMatchStep}>匹配时的步骤</Button>
                <Button size='sm' onClick={addMismatchStep}>不匹配时的步骤</Button>
              </>
          }
        </div>

        <div>
          <Button size='sm' onClick={() => _delStep(0)}>取消</Button>
          {
            stepCanModify && <Button style={{marginLeft: '20px'}} size='sm' color='success' onClick={saveStep}>保存</Button>
          }
          {
            !stepCanModify && <Button style={{marginLeft: '20px'}} size='sm' color='primary' onClick={toModifyStep}>修改</Button>
          }
          <Button size='sm' color='danger' onClick={delStep}>删除</Button>
        </div>
      </div>
    </div>
  )
}