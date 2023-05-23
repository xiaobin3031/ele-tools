import '../css/label.css'

export default function Label({children, size='md', ...props}){

  return (
    <label className={`x-label ${props.color} ${size}`} {...props}>{children}</label>
  )
}