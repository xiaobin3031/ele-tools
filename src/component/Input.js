import '../css/input.css'

function Textarea(props){
  const _classList = ['x-input', 'multiline'];
  if(props.borderclear === 1){
    _classList.push('border-clear');
  }
  return (
    <textarea className={_classList.join(' ')} {...props}></textarea>
  )
}

export default function Input(props){
  if(props.multiline === 1){
    return (
      <Textarea {...props}/>
    )
  }else{
    const _props = {...props};
    if(!_props.type){
      _props.type = 'text';
    }
    const _classList = ['x-input']
    if(props.borderclear === 1){
      _classList.push('border-clear');
    }
    return (
      <input className={_classList.join(' ')} {..._props}/>
    )
  }
}