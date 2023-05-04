import './httpReqCompare.css'
import Input from '../../component/Input'
import Label from '../../component/Label'
import React, { useRef, useState } from 'react'
import Select from '../../component/Select';
import { Button } from '../../component/Button';
import Http from '../../js/Http';
import globalId from '../../util/globalId';

const httpMethods = [
  {desc: 'POST', name: 'POST'},
  {desc: 'GET', name: 'GET'}
]

let httpReqCompareId = 1;

const tokenLabel = 'X-Ss-Mall-Token';

const ignoreKey = ['orderAnalyses', 'id', 'specialTypeDic'
  , 'goodsList' // 暂时跳过，商品中台还是连的杉杉的库
  , 'shop'  //一样的问题
];

function params2Json(_params){
  if(!_params){
    return {}
  }
  return _params.split('&')
    .reduce((a, b) => {
      const _s = b.split('=');
      a[_s[0]] = _s[1];
      return a;
    } , {});
}

function compareObj(_old, _new, _path){
  const _tmpOld = {..._old}, _tmpNew = {..._new};
  let path = void 0;
  let flag = Object.keys(_old)
    .some(a => {
      if(ignoreKey.indexOf(a) > -1){
        delete _tmpOld[a];
        delete _tmpNew[a];
      }else{
        if(_new[a] === undefined){
          delete _tmpOld[a];
          path = `${_path}/${a}, new: undefined`;
        }else{
          const _oldItem = _tmpOld[a], _newItem = _tmpNew[a];
          delete _tmpOld[a];
          delete _tmpNew[a];
          if(typeof _oldItem === 'object'){
            if(_oldItem instanceof Array){
              path = compareArray(_oldItem, _newItem, `${_path}/${a}`);
            }else{
              path = compareObj(_oldItem, _newItem, `${_path}/${a}`);
            }
          }else{
            if(_oldItem !== _newItem){
              path = `${_path}/${a}, old: ${_oldItem} | new: ${_newItem}`;
            }
          }
        }
      }
      return !!path;
    })
  if(!flag){
    const leftKeys = Object.keys(_tmpNew);
    flag = leftKeys.length > 0;
    if(flag){
      path = `${_path}/${leftKeys[0]}, old: hasNone, new: has`
    }
  }
  return path;
}
function compareArray(_old, _new, _path){
  if(_old.length !== _new.length){
    return _path;
  }
  // 顺序也不能变换
  let path;
  _old.some((a, i) => {
    if(typeof a === typeof _new[i]){
      if(typeof a === 'object'){
        path = compareObj(a, _new[i], `${_path}[${i}]`);
      }else{
        if(a !== _new[i]){
          path = `${_path}[${i}], old: ${a} | new: ${_new[i]}`
        }
      }
    }else{
      path = `${_path}[${i}]`
    }
    return !!path;
  });
  return path;
}
function compareResult(_old, _new){
  return compareObj(_old, _new, '');
}

export default function HttpReqCompare({}){

  const _values = useRef({
    httpMethod: httpMethods[0].name,
    token: 'f131244e-c32f-4d51-9ae2-272aae7ba318',
    oldUrl: 'http://115.238.181.86:13311',
    newUrl: 'http://127.0.0.1:8013'
  });

  const [httpReqList, setHttpReqList] = useState(window.fileOp.readHttpReq(1));

  function httpReqChange(event, item){
    item[event.target.name] = event.target.value;
    setHttpReqList(
      httpReqList.map(a => a._id === item._id ? item: a)
    )
  }

  function valueChange(event){
    _values.current[event.target.name] = event.target.value;
  }

  function sendReq(item){
    const reqData = params2Json(item.reqParam);
    const oldReq = Http(_values.current.oldUrl + item.oldReqPath, reqData, {type: item.httpMethod, header: {'X-Ss-Mall-Token': _values.current.token}})
    const newReq = Http(_values.current.newUrl + item.newReqPath, reqData, {type: item.httpMethod, header: {'X-Ss-Mall-Token': _values.current.token}})
    Promise.all([oldReq, newReq]).then(resList => {
      if(resList.length != 2){
        item.error = true;
        item.path = '/';
      }else{
        item.path = compareResult(resList[0], resList[1]);
        item.error = !!item.path;
      }
      setHttpReqList(
        httpReqList.map(a => a._id === item._id ? item: a)
      )
    });
    setTimeout(() => {
      const _list = httpReqList.map(a => {
        const _item = {...a};
        delete _item.error;
        delete _item.path;
        return _item;
      })
      window.fileOp.saveHttpReq(_list);
    }, 500)
  }

  function addNewReq(){
    if(httpReqList.some(a => !a.oldReqPath || !a.newReqPath)){
      return;
    }
    const _list = [...httpReqList, {_id: globalId()}]
    setHttpReqList(_list)
  }

  return (
    <>
      <div>
        <Label>{tokenLabel}</Label>
        <Input onChange={valueChange} name={tokenLabel} style={{ width: '50%'}} defaultValue={_values.current.token}/>
      </div>
      <hr />
      <div className='x-http-req-url'>
        <div>
          <Label>旧请求url</Label>
          <Input onChange={valueChange} name="oldReqUrl" style={{ width: '300px'}} defaultValue={_values.current.oldUrl}/>
        </div>
        <div>
          <Label>新请求url</Label>
          <Input onChange={valueChange} name="newReqUrl" style={{ width: '300px'}} defaultValue={_values.current.newUrl} />
        </div>
      </div>
      <hr />
      {
        httpReqList.map(a => {
          return (
            <React.Fragment key={`http-req-id-${a._id}`}>
              <div className='x-http-req-param'>
                <div>
                  <div>
                    <Select 
                    list={httpMethods} 
                    showSelect={false} 
                    defaultValue={a.httpMethod}
                    onChange={event => httpReqChange(event, a)}
                    name="httpMethod"
                    />
                  </div>
                  <div>
                    <Label>旧请求路径</Label>
                    <Input 
                      onChange={event => httpReqChange(event, a)} 
                      name="oldReqPath" 
                      defaultValue={a.oldReqPath}
                      style={{ width: '400px'}} />
                  </div>
                  <div>
                    <Label>新请求路径</Label>
                    <Input 
                      onChange={event => httpReqChange(event, a)} 
                      name="newReqPath" 
                      defaultValue={a.newReqPath}
                      style={{ width: '400px'}} />
                  </div>
                  <div>
                    <Button color='primary' onClick={() => sendReq(a)}>发送</Button>
                    <Button onClick={addNewReq}>新增</Button>
                  </div>
                </div>
                <div>
                  <div></div>
                  <div>
                    <Label>描述</Label>
                    <Input 
                      onChange={event => httpReqChange(event, a)} 
                      name="desc" 
                      defaultValue={a.desc}
                      style={{ width: '400px'}} />
                    </div>
                </div>
                <div style={{ 'marginTop': '10px'}}>
                  <div>
                  </div>
                  <div>
                    <textarea rows="3" 
                      onChange={event => httpReqChange(event, a)} 
                      name="reqParam" 
                      defaultValue={a.reqParam}
                      style={{
                        width: '90%',
                        'fontSize': '1.2em'
                      }}></textarea>
                  </div>
                </div>
                {
                  a.error === true && <Label>不匹配: {a.path}</Label>
                }
                {
                  a.error === false && <Label>匹配</Label>
                }
              </div>
              <hr />
            </React.Fragment>
          )
        })
      }
    </>
    
  )
}