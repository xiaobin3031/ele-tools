
export default function Row({children, ...props}){
  const style = {
    "padding": "2px 5px",
    "margin": "2px 1px"
  }
  return (
    <div className="row" style={style} {...props}>
      { children }
    </div>
  )
}