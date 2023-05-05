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
function CheckboxGroup({list, ...props}){
  const _props = {...defaultProps, ...props};

  const _checks = useRef(list.map(() => false));

  function checkedButton(event, index){
    _checks.current[index] = !_checks.current[index];
    if(_checks.current[index]){
      event.target.classList.add('active');
    }else{
      event.target.classList.remove('active');
    }
    if(!!_props.valueCheck){
      _props.valueCheck(
        list.filter((_, index) => _checks.current[index])
      );
    }
  }

  return (
    list.map((a, index) => {
      return <Button key={`x-button-group-button-${buttonGlobalId++}`}
        type={a[_props.type]}
        color={a[_props.color]}
        outline
        onClick={(event) => checkedButton(event, index)}
       >{a[_props.text]}</Button>
    })
  )
}

function RadioGroup({list, ...props}){
  const _props = {...defaultProps, ...props};

  function checkedButton(event, item){
    if(!!_props.valueCheck){
      _props.valueCheck(item);
    }
    Array.from(event.target.parentNode.children).filter(a => a.classList.contains('active')).forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
  }

  return (
    list.map((a) => {
      return <Button key={`x-button-group-button-${buttonGlobalId++}`}
        type={a[_props.type]}
        color={a[_props.color]}
        outline
        onClick={(event) => checkedButton(event, a)}
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

export function Button({children, type="button", color, outline, size='md', ...props}){

  const _classList = ['x-button', color, size];
  if(outline){
    _classList.push('outline');
  }

  return (
    <button className={_classList.join(' ')} type={type} {...props}>{children}</button>
  )
}

/**
 * @param groupType button(defualt), radio, checkbox 
 * @param valueCheck type=radio,checkbox时生效
 */
export function ButtonGroup({list, groupType = 'button', ...props}){

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