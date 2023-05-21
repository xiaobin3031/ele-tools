import './httpReqCompare.css'
import Input from '../../component/Input'
import Label from '../../component/Label'
import React, { useRef, useState } from 'react'
import Select from '../../component/Select';
import { Button } from '../../component/Button';
import Http from '../../js/Http';
import globalId from '../../util/globalId';
import Row from '../../component/Row';

const httpMethods = [
  {desc: 'POST', name: 'POST'},
  {desc: 'GET', name: 'GET'}
]

const tokenLabel = 'Satoken';

const ignoreKey = ['orderAnalyses', 'id', 'specialTypeDic', 'shipLogo'
  , 'userId', 'shopId'
  , 'shopCode', 'shopName'
  , 'returnAddress', 'returnConsignee', 'returnMobile', 'servicePhone'
  , 'oriOrderGoods', 'oriOrderPayList'   // 这两个杉杉有默认值，跳过校验
  , 'goodsList' // 暂时跳过，商品中台还是连的杉杉的库
  , 'shop'  //一样的问题
  , 'user'  //一样的问题
];

function params2Json(_params){
  if(!_params){
    return {}
  }
  if(_params.charAt(0) === '[' || _params.charAt(0) === '{'){
    return _params;
  }
  return _params.split('&')
    .reduce((a, b) => {
      const _s = b.split('=');
      a[_s[0]] = _s[1];
      return a;
    } , {});
}

function compareObj(_old, _new, _path, item){
  const _tmpOld = {..._old}, _tmpNew = {..._new};
  let path = void 0;
  let flag = Object.keys(_old)
    .some(a => {
      if(ignoreKey.indexOf(a) > -1 || (!!item.ignoreField && item.ignoreField.indexOf(a + ',') > -1)){
        delete _tmpOld[a];
        delete _tmpNew[a];
      }else{
        if(_new[a] === undefined){
          const _v = _tmpOld[a];
          delete _tmpOld[a];
          path = `${_path}/${a}=${_v}, new: undefined`;
        }else{
          const _oldItem = _tmpOld[a], _newItem = _tmpNew[a];
          delete _tmpOld[a];
          delete _tmpNew[a];
          if(typeof _oldItem === 'object'){
            if(_oldItem instanceof Array){
              path = compareArray(_oldItem, _newItem, `${_path}/${a}`, item);
            }else{
              path = compareObj(_oldItem, _newItem, `${_path}/${a}`, item);
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
    // 新的接口，允许返回多的字段
    const leftKeys = Object.keys(_tmpOld)
      .filter(a => ignoreKey.indexOf(a) === -1 || (!!item.ignorefield && item.ignoreField.indexOf(a + ',') === -1));
    flag = leftKeys.length > 0;
    if(flag){
      path = `${_path}/${leftKeys[0]}, old: has`
    }
  }
  return path;
}
function compareArray(_old, _new, _path, item){
  if(_old.length !== _new.length){
    return _path;
  }
  // 顺序也不能变换
  let path;
  _old.some((a, i) => {
    if(typeof a === typeof _new[i]){
      if(typeof a === 'object'){
        path = compareObj(a, _new[i], `${_path}[${i}]`, item);
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
function compareResult(_old, _new, item){
  return compareObj(_old, _new, '', item);
}

export default function HttpReqCompare({}){

  const _values = useRef({
    httpMethod: httpMethods[0].name,
    token: 'cX74pi4jsVPb0EZy2pCQO0BPpnys0jS8rM8i9blnnbTcdygOd2uO8phGap7wVqmF',
    oldUrl: 'http://10.0.13.93:19999',
    newUrl: 'http://127.0.0.1:8013'
  });
  const [headers, setHeaders] = useState([
    {_id: -999, tokenLabel: tokenLabel, token: 'cX74pi4jsVPb0EZy2pCQO0BPpnys0jS8rM8i9blnnbTcdygOd2uO8phGap7wVqmF'}
  ]);

  const [httpReqList, setHttpReqList] = useState(window.fileOp.readHttpReq(1));

  function httpReqChange(event, item){
    item[event.target.name] = event.target.value;
    if(event.target.name === 'ignoreField' && item.ignoreField.charAt(item.ignoreField.length - 1) !== ','){
      item.ignoreField += ',';
    }
    setHttpReqList(
      httpReqList.map(a => a._id === item._id ? item: a)
    )
  }

  function valueChange(event){
    _values.current[event.target.name] = event.target.value;
  }
  function headerChange(event, item){
    item[event.target.name] = event.target.value;
    setHeaders(headers.map(a => a._id === item._id ? item : a))
  }

  function sendReq(item){
    const req = {};
    req.type = item.httpMethod;
    const _headers = headers.reduce((a, b) => {
      a[b.tokenLabel] = b.token;
      return a;
    }, {});
    console.log("header", _headers);
    req.header = _headers;

    const reqData = params2Json(item.reqParam);
    const oldReq = Http(_values.current.oldUrl + item.oldReqPath, reqData, {...req, Origin: _values.current.oldUrl})
    const newReq = Http(_values.current.newUrl + item.newReqPath, reqData, {...req, Origin: _values.current.newUrl})
    Promise.all([oldReq, newReq]).then(resList => {
      if(resList.length != 2){
        item.error = true;
        item.path = '/';
      }else if(resList[0].errcode !== 0 || resList[1].errcode !== 0){
        item.error = true;
        item.path = '请求失败';
      }
      else{
        item.path = compareResult(resList[0], resList[1], item);
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

  function setReqPathNew(event, item){
    if(!item.newReqPath){
      item.newReqPath = event.target.value.replace('mplaza', 'admin/order');
    }
    httpReqChange(event, item);
  }

  function addHead(){
    setHeaders([
      ...headers,
      {_id: globalId()}
    ])
  }
  function delHead(item){
    setHeaders(headers.filter(a => a._id !== item._id))
  }

  return (
    <>
      {
        headers.map((a, i)=> {
          return <Row key={a._id}>
            <Input onChange={event => headerChange(event, a)} name='tokenLabel' style={{ width: '100px'}} value={a.tokenLabel ? a.tokenLabel : ''}/>
            <Input onChange={event => headerChange(event, a)} name='token' style={{ width: '50%'}} value={a.token ? a.token : ''}/>
            <Button color='primary' onClick={addHead}>新增</Button>
            {
              i > 0 && <Button color='danger' onClick={() => delHead(a)}>删除</Button>
            }
          </Row>
        })
      }
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
                      onChange={event => setReqPathNew(event, a)} 
                      name="oldReqPath" 
                      value={a.oldReqPath}
                      style={{ width: '400px'}} />
                  </div>
                  <div>
                    <Label>新请求路径</Label>
                    <Input 
                      onChange={event => httpReqChange(event, a)} 
                      name="newReqPath" 
                      value={a.newReqPath}
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
                      value={a.desc}
                      style={{ width: '400px'}} />
                  </div>
                  <div>
                    <Label>忽略字段</Label>
                    <Input 
                      onChange={event => httpReqChange(event, a)} 
                      name="ignoreField" 
                      value={!a.ignoreField ? '' : a.ignoreField}
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
                  a.error === true && <Label color='danger'>不匹配: {a.path}</Label>
                }
                {
                  a.error === false && <Label color='success'>匹配</Label>
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