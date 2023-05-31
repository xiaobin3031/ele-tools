import { useRef, useState } from 'react'
import '../css/select.css'
import { globalId, registCloseFunc, unRegistCloseFunc } from '../util/global'
import SvgIcon from './SvgIcon'

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
    setShowSelectRegion(false);
    unRegistCloseFunc(closeSelectRegion)
  }
  const [itemList, setItemList] = useState([...list])
  const hoverItemFlag = useRef(false);
  const selectRegionRef = useRef(null);

  const [showSelectRegion, setShowSelectRegion] = useState(false);

  function clickSelectDiv(event){
    event.stopPropagation();
    if(showSelectRegion){
      setShowSelectRegion(false);
      unRegistCloseFunc(closeSelectRegion)
    }else{
      setShowSelectRegion(true);
      registCloseFunc(closeSelectRegion);
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

  function clearAll(event){
    event.stopPropagation();
    itemList.forEach(a => a.checked = false);
    setItemList([...itemList])
    if(!!onChange){
      onChange([])
    }
  }

  const selectedItemList = itemList.filter(a => !!a.checked);
  return (
    <div className={`select multiple ${size}`} {...props}>
      <div className='selected' onClick={clickSelectDiv}>
        {
          selectedItemList.length > 0 && 
            selectedItemList.slice(0, 2).map(a => {
              return (
                <span className='item' key={a._id}>
                  <span>{a.name}</span>
                  <SvgIcon iconType='close' style={{
                    width: '13px',
                    height: '13px'
                  }}/>
                </span>
              )
            })
        }
        {
          selectedItemList.length > 2 && 
            <span className='item' key={globalId()}>
              <span>...{selectedItemList.length - 2}</span>
            </span>
        }
      </div>
      <span className='icon' key={globalId()}>
        <SvgIcon iconType='closeFill' style={{ width: '15px', height: '15px' }} onClick={clearAll}/>
      </span>
      <div className={`select-region ${showSelectRegion ? 'show' : 'hide'}`} ref={selectRegionRef}>
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