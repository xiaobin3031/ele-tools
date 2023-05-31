// 步骤预览
import Row from '../../component/Row';
import SvgIcon from '../../component/SvgIcon';
import { stepNames } from './data/data'
import './stepList.css'

function StepView({_step, _stepModify, _stepRemove, _stepChangePosition, _index}){

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
    <div className='step-view-drag' stepid={_step._id}>
      <div className="step-view">
        <span className={`perform ${_stepName.name}`}>{performName}</span>
        <span className='content'>{!!_step.name ? _step.name : _step.perform}</span>
        <span className='log'></span>
        <span style={{ display: 'inline-flex' }}>
          <SvgIcon className='pointer' iconType='pen' color='-warning' onClick={() => _stepModify(_step._id)}/>
          <SvgIcon className='pointer' iconType='directionUp' onClick={() => _stepChangePosition(_index, 0)}/>
          <SvgIcon className='pointer' iconType='directionDown' onClick={() => _stepChangePosition(_index, 1)}/>
          <SvgIcon className='pointer' iconType='ashbin' color='-danger' onClick={removeStep}/>
        </span>
      </div>
    </div>
  )
}

export default function StepList({_steps, _stepModify, _stepRemove, _stepChangePosition}){

  return (
    <Row className="steps-view">
      {
        !!_steps && _steps.length > 0 &&
          _steps.map((a, index) => {
            return <StepView key={a._id} _step={a} _stepModify={_stepModify} _stepRemove={_stepRemove} _stepChangePosition={_stepChangePosition} _index={index}/>
          })
      }
    </Row>
  )
}