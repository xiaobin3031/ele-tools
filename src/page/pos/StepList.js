// 步骤预览
import Row from '../../component/Row';
import SvgIcon from '../../component/SvgIcon';
import { stepNames } from './data/data'
import './stepList.css'

function StepView({_step, _stepModify, _stepRemove}){

  //todo 测试
  _step.running = true;
  const _stepName = stepNames.filter(a => a.name === _step.perform)[0];
  const performName = !!_stepName ? _stepName.desc : _stepName.perform;

  function removeStep(){
    if(window.confirm('是否删除该流程')){
      _stepRemove(_step._id);
    }
  }

  return (
    <Row>
      <div className="step-view">
        <span className={`perform ${_stepName.name}`}>{performName}</span>
        <span className='content'>{!!_step.name ? _step.name : ''}</span>
        <span className='log'></span>
        <SvgIcon iconType='pen' color='-warning' onClick={() => _stepModify(_step._id)}/>
        <SvgIcon iconType='ashbin' color='-danger' onClick={removeStep}/>
      </div>
    </Row>
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