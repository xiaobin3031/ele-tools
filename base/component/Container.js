import '../css/container.css'

function containerClass(size='sm'){
  switch(size){
    case 'fluid':
    case 'xxl':
    case 'xl':
    case 'lg':
    case 'md':
    case 'sm':
      return `container-${size}`
    default:
      return 'container-sm'
  }
}

export default function Container({size='sm', children}){

  return (
    <div className={containerClass(size)}>

    </div>
  )
}