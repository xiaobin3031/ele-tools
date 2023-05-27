
export default function Select({list, value="name", desc="desc", showSelect=true, key="key", ...props}){

  const style = {
    padding: '3px',
    borderRaduis: '3px'
  }

  return (
    <select style={style} {...props}>
      {
        showSelect && !props.multiple && <option value="">请选择</option>
      }
      {
        !!list && list.length &&
          list.map(a => {
            if(typeof a !== 'object'){
              return (<option value={a} key={!!a[key] ? a[key] : a[value]}>{a}</option>)
            }
            return (<option value={a[value]} key={!!a[key] ? a[key] : a[value]}>{a[desc] || a[value]}</option>)
          })
      }
    </select>
  )
}