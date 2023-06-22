import { useRef, useState } from "react";
import Row from "../../../component/Row";
import { ButtonGroup } from "../../../component/Button";
import Input from "../../../component/Input";

export default function RecycleViewStep({_step, _stepChange}){

  const [indexTypes, setIndexTypes] = useState([
    {
      _color: 'primary',
      _text: '指定',
      _value: 'index',
      checked: _step.indexType === 'index'
    },
    {
      _color: 'primary',
      _text: '随机',
      _value: 'random',
      checked: _step.indexType === 'random'
    },
    {
      _color: 'primary',
      _text: '范围',
      _value: 'range',
      checked: _step.indexType === 'range'
    },
  ])
  
  const indexType = useRef(_step.indexType)

  function indexTypeChange(item){
    indexType.current = item._value;
    indexTypes.forEach(a => a.checked = a._value === item._value);
    setIndexTypes([...indexTypes])
    _step.indexType = item._value;
    _stepChange({..._step})
  }

  function valueChange(event){
    let _val = event.target.value;
    const name = event.target.name;
    if(name === 'indexes' && !!_val){
      _val = _val.split(',')
    }
    _step[event.target.name] = _val
    _stepChange({..._step})
  }

  return (
    <Row>
      <ButtonGroup groupType="radio" list={indexTypes} size="sm" valuecheck={indexTypeChange} />
      {
        indexType.current === 'index' && 
          <Input style={{marginLeft: '10px', width: '150px'}} value={_step.indexes}
            size="sm" name="indexes" placeholder="请输入下标 0,1,2,3..." onChange={valueChange} />
      }
      {
        indexType.current === 'random' && 
          <Input style={{marginLeft: '10px', width: '100px'}} value={_step.randomCount}
            size="sm" name="randomCount" placeholder="随机次数" onChange={valueChange} />
      }
      {
        indexType.current === 'range' &&
          <>
            <Input style={{marginLeft: '10px', width: '100px'}} value={_step.rangeBegin}
              size="sm" name="rangeBegin" placeholder="开始下标" onChange={valueChange} />
            <Input style={{marginLeft: '10px', width: '100px'}} 
              size="sm" name="rangeEnd" placeholder="结束结束" onChange={valueChange} />
          </>
      }
    </Row>
  )
}