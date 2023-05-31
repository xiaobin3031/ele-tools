import { useState } from "react"
import Row from "../../../component/Row"
import { ButtonGroup } from "../../../component/Button"
import Select from "../../../component/Select"
import { activities } from "../data/data"
import Ele from "../Ele"

export default function CheckStep({_step, _stepChange}){

  const [checkTypes, setCheckTypes] = useState([
    {
      _text: '校验页面',
      _color: 'primary',
      _value: 'activity'
    },
    {
      _text: '校验元素',
      _color: 'primary',
      _value: 'element'
    }
  ])

  function changeCheckType(item){
    checkTypes.forEach(a => a.checked = item._value === a._value)
    setCheckTypes([...checkTypes])
  }

  function changeActivity(event){
    _step.activity = event.target.value
    _stepChange({..._step})
  }

  function changeElement(ele){
    _step.element = ele
    _stepChange({..._step})
  }

  return (
    <div>
      <Row>
        <ButtonGroup list={checkTypes} size="sm" groupType="radio" valuecheck={changeCheckType} />
        {
          !!checkTypes[0].checked && <Select style={{ marginLeft: '10px' }} list={activities} onChange={changeActivity} name="activity" />
        }
        {
          !!checkTypes[1].checked && 
            <div style={{ display: 'inline-flex' }}>
              <Ele ele={_step.element} _eleChange={changeElement} />
            </div>
        }
      </Row>

    </div>
  )
}