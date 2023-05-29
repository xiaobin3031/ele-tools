import { useEffect, useRef, useState } from 'react'
import '../css/select.css'
import { registCloseFunc, unRegistCloseFunc } from '../util/global'

function SingleSelect({list, name, desc, showSelect, onChange, ...props}){

  return (
    <select {...props} onChange={onChange}>
      {
        showSelect && <option value='' key="_select">请选择</option>
      }
      {
        !!list && list.length > 0 &&
          list.map(a => {
            return (
              <option value={a[name]} key={a[name]}>{a[desc] || a[name]}</option>
            )
          })
      }
    </select>
  )
}

function MultiSelect({list, name, desc, showSelect, onChange, size, ...props}){

  const closeSelectRegion = () => {
    if(hoverItemFlag.current || !selectRegionRef.current){
      return;
    }
    selectRegionShow.current = false;
    selectRegionRef.current.classList.remove('show')
    selectRegionRef.current.classList.add('hiding')
  }
  const [itemList, setItemList] = useState([...list])
  const hoverItemFlag = useRef(false);
  const selectRegionRef = useRef(null);
  const selectRegionShow = useRef(false);

  function clickSelectDiv(event){
    event.stopPropagation();
    if(!selectRegionRef.current.classList.contains('showing')){
      selectRegionRef.current.classList.add('showing')
      registCloseFunc(closeSelectRegion);
      selectRegionShow.current = true;
    }
  }

  function clickItem(item){
    item.checked = !item.checked;
    const newItemList = itemList.map(a => a[name] === item[name] ? item : a);
    setItemList(newItemList)
    if(!!onChange){
      onChange(newItemList.filter(a => !!a.checked))
    }
  }

  function selectRegionEnd(event){
    if(selectRegionShow.current){
      if(selectRegionRef.current.classList.contains('showing')){
        selectRegionRef.current.classList.remove('showing')
        selectRegionRef.current.classList.add('show')
      }
    }else{
      if(selectRegionRef.current.classList.contains("hiding")){
        selectRegionRef.current.classList.remove('hiding')
        selectRegionRef.current.classList.add('hide')
        unRegistCloseFunc(closeSelectRegion)
      }
    }
  }

  return (
    <div className={`select multiple ${size}`} {...props}>
      <div className='selected' onClick={clickSelectDiv}></div>
      <div className='select-region' ref={selectRegionRef} onAnimationEnd={selectRegionEnd}>
        {
          !!itemList && itemList.length > 0 &&
            itemList.map(a => {
              return <div className={`item ${!!a.checked ? 'checked' : ''}`} key={a[name]}
                onClick={() => clickItem(a)}
                onMouseEnter={() => hoverItemFlag.current = true} 
                onMouseLeave={() => hoverItemFlag.current = false}>{a[desc] || a[name]}</div>
            })
        }
      </div>
    </div>
  )
}

export default function Select2({list, name="name", desc="desc", size="sm", showSelect=true, onChange, ...props}){

  if(props.multiple){
    return <MultiSelect list={list} name={name} desc={desc} showSelect={showSelect} {...props}/>
  }else{
    return <SingleSelect  list={list} name={name} desc={desc} showSelect={showSelect} {...props} />
  }
}