import { useEffect, useState } from 'react';
import { ButtonGroup } from '../../component/Button';
import Input from '../../component/Input';
import Row from '../../component/Row';
import Select from '../../component/Select';
import { eleTypes } from './data/data';

export default function Ele({_eleChange, ele}){

  const [eleType, setEleType] = useState(!ele.id && !!ele.text ? 'text': 'id');
  const [eleBtnGroup, setEleBtnGroup] = useState([])

  useEffect(() => {
    setEleBtnGroup([
    {
      _id: 'notInRoot',
      _text: '不在页面上',
      _color: 'primary',
      checked: !!ele.notInRoot
    },
    {
      _id: 'optional',
      _text: '可选',
      _color: 'primary',
      checked: !!ele.optional
    },
    {
      _id: 'multi',
      _text: '重复',
      _color: 'primary',
      checked: !!ele.multi
    }
  ])
  }, [ele])

  function eleTypeChange(event){
    setEleType(event.target.value);
  }

  function valueChange(event){
    if("id" == eleType){
      ele.id = event.target.value;
      ele.text = '';
    }else{
      ele.id = '';
      ele.text = event.target.value;
    }
    _eleChange({...ele})
  }

  function eleAttrChange(vals){
    eleBtnGroup.forEach(a => {
      a.checked = !!vals.filter(b => a._id === b._id)[0];
      ele[a._id] = a.checked;
    })
    _eleChange({...ele})
    setEleBtnGroup([...eleBtnGroup])
  }

  return (
    <Row>
      <Select list={eleTypes} showSelect={false} name="eleType" onChange={eleTypeChange} />
      <Input style={{
        marginLeft: '10px',
        fontSize: '0.7em',
        width: '120px'
      }} name="eleId" placeholder={`请输入元素的${eleType === 'text' ? '文本' : 'id'}值`} onChange={valueChange} value={!ele.id && !!ele.text ? ele.text : ele.id} />
      <span style={{marginLeft: '10px'}}>
        <ButtonGroup size="sm" list={eleBtnGroup} groupType="checkbox" valuecheck={eleAttrChange} />
      </span>
    </Row>
  )
}