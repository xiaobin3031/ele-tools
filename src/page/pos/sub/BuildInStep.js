import { useState } from "react";
import Input from "../../../component/Input";
import Label from "../../../component/Label";
import Row from "../../../component/Row";
import Select from "../../../component/Select";
import { buildInMethods } from "../data/data";

const argNames = [
  {
    name: 'noMatchAndExist',
    desc: '未匹配到时不退出',
    argTypes: [
      {
        name: 'boolean'
      }
    ],
    argValues: {
      inputType: '2',   //2 选择, 其他输入
      values: [
        { name: 'true'},{ name: 'false'}
      ]
    }
  }
]

export default function BuildInStep({_step, _stepChange}){

  const [argTypes, setArgTypes] = useState([]);
  const [argValues, setArgValues] = useState([]);

  function valueChange(event){
    const _name = event.target.name;
    const _val = event.target.value;
    if(_name === 'argName'){
      const _argName = argNames.filter(a => a.name === _val)[0];
      if(!!_argName){
        setArgTypes(_argName.argTypes);
        setArgValues(_argName.argValues);
      }
    }
    _step[event.target.name] = event.target.value;
    _stepChange({..._step})
  }

  return (
    <>
      <Row>
          <Label size="sm">调用方法：</Label>
          <Select list={buildInMethods} attr={{
            name: "methodName",
            onChange: valueChange
          }} />
          {
            argNames.length > 0 &&
              <>
                  <Label size="sm" style={{ marginLeft: '30px' }}>设置变量：</Label>
                  <Select list={argNames} name='argName' onChange={valueChange} />
                  <Select list={argTypes} name='argType' onChange={valueChange} showSelect={false}
                   style={{ marginLeft: '10px', marginRight: '10px' }} />
                  {
                    argValues.inputType === '2' &&
                      <Select list={argValues.values} name='argValue' onChange={valueChange} showSelect={false}/>
                  }
                  {
                    argValues.inputType !== '2' && 
                      <Input size='sm' style={{ width: '100px'}} name="argValue" onChange={valueChange} placeholder='请输入字段值'/>
                  }
              </>
          }
      </Row>
    </>
  )
}