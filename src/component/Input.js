import '../css/input.css'

function formatClass(props, _classList){
  if(props.borderclear === 1){
    _classList.push('border-clear');
  }
  if(!!props.size){
    _classList.push(props.size);
  }
}

function Textarea(props){
  const _classList = ['x-input', 'multiline'];
  formatClass(props, _classList);

  return (
    <textarea className={_classList.join(' ')} {...props}></textarea>
  )
}

export default function Input(props){
  if(+props.multiline === 1){
    return (
      <Textarea {...props}/>
    )
  }else{
    const _props = {...props};
    if(!_props.type){
      _props.type = 'text';
    }
    const _classList = ['x-input']
    formatClass(props, _classList);
    return (
      <input className={_classList.join(' ')} {..._props}/>
    )
  }
}