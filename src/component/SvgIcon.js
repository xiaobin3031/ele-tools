import svgs from "../icon/svg";

const _initSize = 20;
export default function SvgIcon({iconType, size='sm', props}){

  const _props = {...props};
  const _style = _props.style || {};
  switch(size){
    case 'md':
      _style.width = `${_initSize * 1.5}px`;
      _style.height = `${_initSize * 1.5}px`;
      break;
    case 'lg':
      _style.width = `${_initSize * 2}px`;
      _style.height = `${_initSize * 2}px`;
      break;
    default: 
      _style.width = `${_initSize}px`;
      _style.height = `${_initSize}px`;
      break;
  }

  const svg = svgs[iconType]
  
  return (
    <svg style={_style} {...props}/>
  )
}