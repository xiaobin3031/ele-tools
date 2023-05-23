// 流程
import React, { useState } from 'react';
import { Button } from '../../component/Button';
import Input from '../../component/Input';
import Row from '../../component/Row';
import Select from '../../component/Select';
import globalId from '../../util/globalId';
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

function initRenderText(step, stepChange){
  switch(step.perform){
    case 'while':
      return <WhileStep _step={step} _stepChange={stepChange}/>
    case 'buildIn':
      return <BuildInStep _step={step} _stepChange={stepChange}/>
    case 'cache':
      return <CacheStep _step={step} _stepChange={stepChange}/>
    case 'check':
      return <CheckStep _step={step} _stepChange={stepChange}/>
    case 'click':
      return <ClickStep _step={step} _stepChange={stepChange}/>
    case 'input':
      return <InputStep _step={step} _stepChange={stepChange}/>
    case 'pressKey':
      return <PressKeyStep _step={step} _stepChange={stepChange}/>
    case 'recycleView':
      return <RecycleViewStep _step={step} _stepChange={stepChange}/>
    case 'sleep':
      return <SleepStep _step={step} _stepChange={stepChange}/>
    case 'swipe':
      return <SwipeStep _step={step} _stepChange={stepChange}/>
    case 'wait':
      return <WaitStep _step={step} _stepChange={stepChange}/>
  }
  return '';
}

export default function Step({_step, _delStep, _saveStep}){
  const [step, setStep] = useState(_step);
  const [renderText, setRenderText] = useState(initRenderText(_step, stepChange));
  const [steps, setSteps] = useState(_step.flows || []);

  function changeStepName(event){
    const val = event.target.value;
    const step = initFlow({perform: val, _id: _step._id});
    setStep(step);
    setRenderText(initRenderText(step, stepChange));
    if(!!step.hasSubSteps){
      setSteps([]);
    }
  }

  function stepChange(step){
    console.log('step.change', step);
    setStep(step);
  }

  function valueChange(event){
    step[event.target.name] = event.target.value;
    setStep({...step})
  }

  function eleChange(ele){
    setStep({...step, element: ele})
  }

  function addStep(){
    const step = initFlow({perform: stepNames[0].name, _id: globalId()})
    setSteps([...steps, step])
  }

  function saveStep(){
    !!_saveStep && _saveStep(step);
  }

  function delStep(){
    if(window.confirm("是否删除当前步骤?")){
      !!_delStep && _delStep(_step._id);
    }
  }

  function saveThisStep(__step, __steps){
    setStep(__step);
    setSteps(__steps);
  }

  function delThisStep(_id){
    setSteps(steps.filter(a => a._id !== _id))
  }

  return (
    <div className='step-card' key={_step._id}>
      <div className='head'>
        <Row>
          <Input size="sm" name="name" placeholder="请输入步骤名称" onChange={valueChange}/>
          <Input size="sm" name="description" placeholder="请输入步骤描述" onChange={valueChange}/>
        </Row>
        <Row>
          <Select list={stepNames} onChange={changeStepName} showSelect={false}/>
        </Row>
        {
          !!step.showEle && <Ele _eleChange={eleChange} ele={step.element}/>
        }
      </div>
      {
        !!renderText && 
        <>
          <hr />
          <div className='body'>{renderText}</div>
        </>
      }
      {
        !!steps && steps.length > 0 &&
          <>
            <hr />
            <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
              {
                steps.map(a => {
                  return <Step key={a._id} _step={a} _delStep={delThisStep} _saveStep={saveThisStep} />
                })
              }
            </div>
          </>
      }
      <hr />
      <div className='foot'>
        <div>
          {
            step.hasSubSteps && <Button size='sm' onClick={addStep}>添加步骤</Button>
          }
        </div>

        <div>
          <Button style={{marginLeft: '20px'}} size='sm' color='primary' onClick={saveStep}>保存</Button>
          <Button size='sm' color='danger' onClick={delStep}>删除</Button>
        </div>
      </div>
    </div>
  )
}