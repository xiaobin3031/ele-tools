import React, { useState } from 'react';
import { Button } from '../../component/Button';
import Input from '../../component/Input';
import Row from '../../component/Row';
import Select from '../../component/Select';
import globalId from '../../util/globalId';
import { eleTypes } from './data/data';
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

const stepNames = [
  {
    name: "while",
    desc: "循环",
    render: () => {
      return <WhileStep />
    }
  },
  {
    name: "buildIn",
    desc: "内置函数",
    render: () => {
      return <BuildInStep />
    }
  },
  {
    name: "cache",
    showEle: true,
    desc: "存储",
    render: () => {
      return <CacheStep />
    }
  },
  {
    name: "check",
    showEle: true,
    desc: "检查",
    render: () => {
      return <CheckStep />
    }
  },
  {
    name: "click",
    showEle: true,
    desc: "点击",
    render: () => {
      return <ClickStep />
    }
  },
  {
    name: "input",
    showEle: true,
    desc: "输入",
    render: () => {
      return <InputStep />
    }
  },
  {
    name: "pressKey",
    desc: "按键",
    render: () => {
      return <PressKeyStep />
    }
  },
  {
    name: "recycleView",
    showEle: true,
    desc: "recycleView列表",
    render: () => {
      return <RecycleViewStep />
    }
  },
  {
    name: "sleep",
    desc: "睡眠",
    render: () => {
      return <SleepStep />
    }
  },
  {
    name: "swipe",
    showEle: true,
    desc: "滑动",
    render: () => {
      return <SwipeStep />
    }
  },
  {
    name: "wait",
    desc: "等待",
    render: () => {
      return <WaitStep />
    }
  }
]

function Card({_item, _updateStep}){

  const [values, setValues] = useState({
    step: {}
  });

  function changeStepName(event){
    const val = event.target.value;
    const step = stepNames.filter(a => a.name === val)[0] || {};
    setValues({...values, step: step})
  }

  function valueChange(event){
    values[event.target.name] = event.target.value;
    setValues(...values)
  }

  return (
    <div className='step-card' key={_item._id}>
      <div className='head'>
        <Row>
          <Input name="name" placeholder="请输入步骤名称" onChange={valueChange}/>
        </Row>
        <Row>
          <Input name="description" placeholder="请输入步骤描述" onChange={valueChange}/>
        </Row>
        <Row>
          <Select list={stepNames} onChange={changeStepName} showSelect={false}/>
          {
            !!values.step.showEle && <Select list={eleTypes} showSelect={false}/>
          }
        </Row>
      </div>
      <div className='body'>
        {
          !!values.step.render && values.step.render()
        }
      </div>
      <div className='foot'></div>
    </div>
  )
}

export default function PosAuto({}){

  const [steps, setSteps] = useState([]);

  function addStep(){
    setSteps([ ...steps, {_id: globalId()} ])
  }

  return (
    <React.Fragment key={globalId()}>
      <Row>
        <Button onClick={addStep}>添加步骤</Button>
      </Row>
      <div className="pos-auto">
        {
          steps.length > 0 &&
            steps.map(a => {
              return (
                <Card _item={a} />
              )
            })
        }
      </div>
    </React.Fragment>
  )
}