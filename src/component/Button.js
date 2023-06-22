import { useRef } from 'react';
import '../css/button.css'

let buttonGlobalId = 1;
const defaultProps = {
  text: '_text',
  type: '_type',
  color: '_color',
  outline: '_outline',
  value: '_value',
  clickBtn: '_clickBtn'
};
function CheckboxGroup({list, valuecheck, ...props}){
  const _props = {...defaultProps, ...props};

  function checkedButton(item){
    item.checked = !item.checked;
    valuecheck(
      list.filter(a => !!a.checked || (!!item.checked && a._id === item._id))
    );
  }

  return (
    list.map(a => {
      return <Button className={!!a.checked ? 'active' : ''} key={`x-button-group-button-${buttonGlobalId++}`} {...props}
        type={a[_props.type]}
        color={a[_props.color]}
        outline
        onClick={() => checkedButton(a)}
       >{a[_props.text]}</Button>
    })
  )
}

function RadioGroup({list, valuecheck, ...props}){
  const _props = {...defaultProps, ...props};

  function checkedButton(item){
    valuecheck(item);
  }

  return (
    list.map((a) => {
      return <Button className={!!a.checked ? 'active' : ''} key={`x-button-group-button-${buttonGlobalId++}`} {...props}
        type={a[_props.type]}
        color={a[_props.color]}
        outline
        onClick={() => checkedButton(a)}
       >{a[_props.text]}</Button>
    })
  )
}
function InnerButtonGroup({list, ...props}){

  const _props = {...defaultProps, ...props};

  return (
    list.map(a => {
      return <Button key={`x-button-group-button-${buttonGlobalId++}`}
        type={a[_props.type]}
        color={a[_props.color]}
        outline={a[_props.outline]}
        onClick={a[_props.clickBtn]}
       >{a[_props.text]}</Button>
    })
  )
}

export function Button({children, type="button", color, outline, size='md', className='', ...props}){

  const _classList = ['x-button', color, size];
  if(outline){
    _classList.push('outline');
  }
  if(!!className){
    Array.from(className.split(' ')).forEach(a => _classList.push(a));
  }

  return (
    <button className={_classList.join(' ')} type={type} {...props}>{children}</button>
  )
}

/**
 * @param groupType button(defualt), radio, checkbox 
 * @param valuecheck type=radio,checkbox时生效
 */
export function ButtonGroup({list, groupType = 'button', ...props}){
  console.log('btngrp', list)
  console.log('btngrp.props', props)
  return (
    <>
      {
        !!list && list.length > 0 && 
          <div className='x-button-group'>
            {
              groupType === 'button' && <InnerButtonGroup list={list} {...props}/>
            }
            {
              groupType === 'checkbox' && <CheckboxGroup list={list} {...props} />
            }
            {
              groupType === 'radio' && <RadioGroup list={list} {...props} />
            }
          </div>
      }
    </>
  )
}