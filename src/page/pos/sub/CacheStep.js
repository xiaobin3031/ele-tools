import { useRef, useState } from "react";
import { ButtonGroup } from "../../../component/Button";
import Row from "../../../component/Row";
import Input from "../../../component/Input";
import Select2 from "../../../component/Select2";
import { uiBillFields } from "../data/data";


export default function CacheStep({_step, _stepChange}){

  const checked = !!_step.uiBillFields && _step.uiBillFields.length > 0;
  const _fields = [...uiBillFields]
  if(checked){
    _fields.forEach(a => a.checked = _step.uiBillFields.indexOf(a.name) > -1)
  }
  const uiBillFieldsRef = useRef(_fields)
  const [valuesType, setValuesType] = useState([
    {
      _text: '按列表',
      _value: 'byList',
      _color: 'primary',
      checked: !checked
    },
    {
      _text: '按订单字段',
      _value: 'byBill',
      _color: 'primary',
      checked: checked
    }
  ])
  const checkValueType = valuesType.filter(a => !!a.checked)[0];
  const [valueType, setValueType] = useState(!!checkValueType ? checkValueType._value : null)

  function changeValueType(item){
    setValueType(item._value);
    valuesType.forEach(a => a.checked = a._value === item._value)
    setValuesType([...valuesType])
    if(item._value === 'byList'){
      _step.uiBillFields = [];
    }else if(item._value === 'byBill'){
      _step.index = void 0;
      _step.viewId = void 0;
    }
    _stepChange({..._step})
  }
  
  function stepChange(event){
    _step[event.target.name] = event.target.value;
    _stepChange({..._step});
  }

  function uiBillFieldChange(items){
    _step.uiBillFields = items.map(a => a.name);
    _stepChange({..._step})
  }

  return (
    <Row>
      <Row style={{ display: 'flex', alignItems: 'center'}}>
        <ButtonGroup list={valuesType} groupType="radio" size="sm" valuecheck={changeValueType}/>
        <span style={{ marginLeft: '10px' }}>
          {
            valueType === 'byList' &&
              <>
                <Input style={{
                  width: '200px'
                }} placeholder='请输入第几个元素，从0开始' size='sm' name='index' type="number" onChange={stepChange} value={!!_step.index ? _step.index : ''}/>
                <Input style={{
                  width: '150px',
                  marginLeft: '10px'
                }} placeholder='请输入元素的id值' size='sm' name='viewId' onChange={stepChange} value={!!_step.viewId ? _step.viewId : ''}/>
              </>
          }
          {
            valueType === 'byBill' &&
              <Select2 list={uiBillFieldsRef.current} multiple onChange={uiBillFieldChange} />
          }
        </span>
      </Row>
    </Row>
    
  )
}