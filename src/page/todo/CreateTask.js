import SvgIcon from '../../component/SvgIcon';

function prepareAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.currentTarget;
    event.currentTarget.nextElementSibling.focus();
  }
  $target.style.display = 'none';
}

function finishAddGroup(event){
  let $target;
  if(event.target.tagName === 'INPUT'){
    $target = event.target.previousElementSibling;
  }else{
    $target = event.target;
  }
  $target.style.display = 'inline';
}

export default function CreateTask({_onKeyDown, _name, _placeholder}){

  return (
    <>
      <SvgIcon iconType='add' onClick={prepareAddGroup} style={{cursor: 'pointer'}}/>
      <input name={_name} placeholder={_placeholder} 
          onKeyDown={_onKeyDown}
          onFocus={prepareAddGroup} 
          onBlur={finishAddGroup}/>
    </>
  )
}