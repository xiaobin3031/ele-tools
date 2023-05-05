import '../css/label.css'

export default function Label({children, ...props}){

  return (
    <label className={`x-label ${props.color}`} {...props}>{children}</label>
  )
}