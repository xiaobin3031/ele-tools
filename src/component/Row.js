
export default function Row({children, className, ...props}){
  const style = {
    "padding": "2px 5px",
    "margin": "2px 1px"
  }
  const _classList = ['row']
  if(!!className){
    const _class = className.split(' ');
    for(let i=0; i<_class.length;i++){
      _classList.push(_class[i])
    }
  }
  return (
    <div className={_classList.join(' ')} style={style} {...props}>
      { children }
    </div>
  )
}