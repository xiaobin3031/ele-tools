// 中断
import { useState } from "react";
import { ButtonGroup } from "../../../component/Button";
import Label from "../../../component/Label";
import Row from "../../../component/Row";
import Select from "../../../component/Select";
import { activities } from "../data/data";
import Ele from "../Ele";

export default function BrokeStep({_eleChange, _brokeChange, broke}){

  console.log('broke', broke);
  const type = (!!broke.activity || (!!broke.activities && broke.activities.length > 0)) ? 'byFunc' : 'byEle';
  const [brokeType, setBrokeType] = useState(type);
  const [brokeTypes, setBrokeTypes] = useState([
    {
      _id: "byEle",
      _text: "按元素",
      _color: 'primary',
      checked: type === 'byEle'
    },
    {
      _id: "byFunc",
      _text: '按页面',
      _color: 'primary',
      checked: type === 'byFunc'
    }
  ])

  function brokeTypeChange(item){
    setBrokeType(item._id);
    brokeTypes.forEach(a => a.checked = a._id === item._id);
    setBrokeTypes([...brokeTypes])
  }

  function activityChange(event){

  }

  function eleChange(ele){
    _brokeChange({...broke, element: ele})
  }

  return (
    <>
      <Row>
        <Label size="sm">中断方式</Label>
        <ButtonGroup list={brokeTypes} size="sm" groupType="radio" valuecheck={brokeTypeChange}/>
        {
          brokeType === 'byFunc' && <Select style={{ marginLeft: '10px' }} list={activities} showSelect={false} attr={{
            multiple: true,
            onChange: activityChange
          }}/>
        }
      </Row>
      {
        brokeType === 'byEle' && <Ele _eleChange={eleChange} ele={broke.element}/>
      }
    </>
  )
}