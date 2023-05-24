// 步骤预览
import Row from '../../component/Row';
import SvgIcon from '../../component/SvgIcon';
import { stepNames } from './data/data'
import './stepList.css'

function StepView({_step, _stepModify, _stepRemove}){

  //todo 测试
  _step.running = true;

  function getContentName(){
    let content;
    if(!!_step.name){
      content = _step.name;
    }else{
      const _stepName = stepNames.filter(a => a.name === _step.perform)[0];
      content = !!_stepName ? _stepName.desc : _step.perform;
    }
    return content;
  }

  return (
    <div>
      <div className="step-view">
        <div className='content'>{getContentName()}</div>
      </div>
      <div className='step-view-icons'>
        <SvgIcon iconType='pen'/>
        <SvgIcon iconType='ashbin'/>
      </div>
    </div>
  )
}

export default function StepList({_steps, _stepModify, _stepRemove}){

  return (
    <Row className="steps-view">
      {
        !!_steps && _steps.length > 0 &&
          _steps.map(a => {
            return <StepView key={a._id} _step={a} _stepModify={_stepModify} _stepRemove={_stepRemove}/>
          })
      }
    </Row>
  )
}