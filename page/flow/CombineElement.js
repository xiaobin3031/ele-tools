import SingleElement from "./SingleElement";

export default function CombineElement(props){

  function delCombineElement(){
    if(window.confirm('是否确认删除该元素')){
      props.props.handleEle(props.props.ele, 2);
    }
  }

  return (
    <fieldset className="combine-element" style={{
      width: '30%',
      float: 'left'
    }}>
      <legend>组合元素: {props.props.ele._id}</legend>
      <button type="button" style={{
        color: 'red',
        float: 'right'
      }} onClick={() => delCombineElement()}>删除</button>
      <SingleElement {...props} />
    </fieldset>
  )
}