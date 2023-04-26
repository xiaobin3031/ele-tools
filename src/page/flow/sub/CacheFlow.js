//缓存调用
import { useState } from "react"
import Tips from "../../../component/Tips";
import { uiBillField } from "../data/flowData"
import Select from "../../../component/Select";
import Row from "../../../component/Row";

export default function CacheFlow({props: {flow, handleFlow}}){

  const [valueMode, setValueMode] = useState(0);

  function handleCache(event){
    const name = event.target.getAttribute('realname');
    switch(name){
      case 'cacheKey':
      case 'index':
      case 'viewId':
        flow[name] = event.target.value;
        break;
      case 'uiBillField':
        flow[name] = Array.from(event.target.selectedOptions).map(a => a.value);
        break;
      default: break;
    }
    handleFlow(flow);
  }

  return (
    <Row>
      <Row>
        <label>缓存的标识</label><Tips title="重复会被覆盖" />
        <input name={`cacheKey-${flow._id}`} realname="cacheKey" onChange={handleCache} />
      </Row>
      <Row>
        <label>取值方式</label>
        <label><input type="radio" name={`valueMode-${flow._id}`} checked={valueMode === 0} onChange={() => setValueMode(0)} />下标 <Tips title={"当前view是RecycleView等列表时生效"} /></label>
        <label><input type="radio" name={`valueMode-${flow._id}`} checked={valueMode === 1} onChange={() => setValueMode(1)} />uiBillField</label>
      </Row>
      <Row>
        {
          valueMode === 0 &&
          (
            <Row>
              <input type="number" defaultValue={flow.index} realname="index" onChange={handleCache}/>
              <label style={{
                "marginLeft": "10px"
              }}>子元素的id</label>
              <input realname="viewId" onChange={handleCache} defaultValue={flow.viewId} />
            </Row>
          )
        }
        {
          valueMode === 1 &&
            <Select list={uiBillField} attr={{
              realname: 'uiBillField',
              multiple: true,
              onChange: handleCache
            }} />
        }
      </Row>
    </Row>
  )
}