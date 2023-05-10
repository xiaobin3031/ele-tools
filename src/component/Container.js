import { useRef } from 'react'
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

function getBodySize(){
  const $body = document.body;
  return {
    width: $body.offsetWidth,
    height: $body.offsetHeight
  }
}
export default function Container({size='sm', children}){

  const containerRef = useRef(null);
  window.onresize = () => {
    if(containerRef.current == null){
      return;
    }
    const fullWidth = getBodySize();
    containerRef.current.style.width = `${fullWidth.width}px`
    containerRef.current.style.height = `${fullWidth.height}px`
  }
  const fullWidth = getBodySize();
  return (
    <div className={containerClass(size)} ref={containerRef} style={{
      width: `${fullWidth.width}px`,
      height: `${fullWidth.height}px`
    }}>
      {children}
    </div>
  )
}