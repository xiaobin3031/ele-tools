import './database.css'

import Row from "../../../component/Row";
import {Button, ButtonGroup} from "../../../component/Button";
import Select2 from "../../../component/Select2";
import Label from "../../../component/Label";
import Input from "../../../component/Input";
import { useState } from "react";
import { globalId } from "../../../util/global";
import SvgIcon from '../../../component/SvgIcon';

const settingType = 'database'
const databaseType = [
  {
    type: 'mysql',
    name: 'mysql'
  }
]

export default function Database({}){

  const [settings, setSettings] = useState(window.setting.read(settingType))
  const [setting, setSetting] = useState(null)
  const [saveFlag, setSaveFlag] = useState([
    {_text: 'Save', _value: 'Save', _color: 'primary', checked: !!setting && !!setting.savePassword}
  ])

  function addNewSetting(){
    setSetting({
      _id: globalId(),
      type: databaseType[0].type,
      host: '',
      port: 3306,
      user: '',
      password: '',
      savePassword: false,
      database: '',
      url: ''
    })
  }

  function changeSaveFlag(item){
    saveFlag.forEach(a => a.checked = item.length === 1 && (a._value === item[0]._value));
    setSaveFlag([...saveFlag])
  }

  function valueChange(event){
    const name = event.target.name;
    if(name === 'savePassword'){
      setting[name] = event.target.checked;
    }else{
      setting[name] = event.target.value;
    }
    if(name === 'url'){
      changeUrl();
    }else{
      changeOther();
    }
    setSetting({...setting})
  }

  /**
   * url变化
   */
  function changeUrl(){
    if(!!setting.url){
      const find = setting.url.match(/jdbc:mysql:\/\/((?:\d{1,3}.){3}\d{1,3}):(\d+)\/([^?]+)(\?(.*))?/)
      if(find.length > 3){
        setting.host = find[1]
        setting.port = find[2]
        setting.database = find[3]
      }
    }
  }

  /**
   * 其他变化
   */
  function changeOther(){
    let url = `jdbc:mysql:${setting.host}:${setting.port}/${setting.database}`
    if(!!setting.url){
      const index = setting.url.indexOf('?')
      if(index > -1){
        url = `${url}${setting.url.substring(index)}`
      }
    }
    setting.url = url
  }

  function save(){
    settings.merge(setting, true);
    window.setting.sync(settingType, settings)
    setSettings([...settings])
    cancel()
  }

  function cancel(){
    setSetting(null)
    saveFlag.forEach(a => a.checked = false)
    setSaveFlag([...saveFlag])
  }

  function modifyDatabase(item){
    setSetting(item)
  }

  function removeDatabase(item){
    if(window.confirm('是否确认删除该连接')){
      setSettings(settings.filter(a => a._id !== item._id))
    }
  }

  return (
    <Row className="database">
      <Row><Button size="sm" onClick={addNewSetting}>添加连接</Button></Row>
      <Row className="content">
        {
          !!setting && 
            <>
              <div>
                <Select2 list={databaseType} _name="type" _desc="name" value={setting.type} onChange={valueChange}/>
              </div>
              <Row>
                <Label>Host: </Label>
                <Input style={{ width: '40%' }} name="host" value={setting.host} onChange={valueChange}/>

                <Label style={{ marginLeft: '20px' }}>Port: </Label>
                <Input style={{ width: '40%' }} name="port" value={setting.port} onChange={valueChange} />
              </Row>
              <Row>
                <Label>User: </Label>
                <Input style={{ width: '40%' }} name="user" value={setting.user} onChange={valueChange} />
              </Row>
              <Row>
                <Label>Password: </Label>
                <Input style={{ width: '40%' }} name="password" type="password" value={setting.password} onChange={valueChange} />

                <ButtonGroup style={{ marginLeft: '10px' }} groupType="checkbox" list={saveFlag} size="sm" valuecheck={changeSaveFlag} />
              </Row>
              <Row>
                <Label>Database: </Label>
                <Input style={{ 'width': '90%'}} name="database" value={setting.database} onChange={valueChange} />
              </Row>
              <Row>
                <Label>Url: </Label>
                <Input style={{ 'width': '90%'}} name="url" value={setting.url} onChange={valueChange} />
              </Row>
              <hr />
              <Row>
                <Button type="button" onClick={cancel}>取消</Button>
                <Button color="primary" type="button" onClick={save} >保存</Button>
              </Row>
            </>
        }
        {
          settings.length > 0 &&
            settings.map(a => {
              return (
                <Row key={a._id} className="view">
                  <Row>
                    <Label>{a.type}</Label>
                    <SvgIcon iconType='pen' onClick={() => modifyDatabase(a)}/>
                    <SvgIcon iconType='ashbin' onClick={() => removeDatabase(a)}/>
                  </Row>
                  <Row><Label>{a.url}</Label></Row>
                </Row>
              )
            })
        }
      </Row>
    </Row>
  )
}