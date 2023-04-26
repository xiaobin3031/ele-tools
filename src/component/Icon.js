const resource = require.context('../icon', false, /\.(png)$/)
const images = resource.keys().reduce((b, a) => {
  const _item = a.replace('./', '');
  b[_item.replace(/\..+?$/, '')] = resource(a);
  return b;
}, {});
const _initSize = 20;

export default function Icon({iconType, size = 'sm', ...props}){

  const _style = {};
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
  
  return (
    <img src={images[iconType]} style={_style} {...props}/>
  )
}