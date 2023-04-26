import '../css/x.css'

export default function Input(props){
  const _props = {...props};
  if(!_props.type){
    _props.type = 'text';
  }
  return (
    <input className="x-input" {..._props}/>
  )
}