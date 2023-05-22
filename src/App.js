// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import SvgIcon from './component/SvgIcon';
import './css/x.css'
import Calendar from './page/calendar/Calendar';
import Scene from './page/flow/Scene';
import HttpReqCompare from './page/hankyu/HttpReqCompare';
import Todo from './page/todo/Todo';
import Todo2 from './page/todo/Todo2';
import globalId from './util/globalId';

const apps = [
  {
    _id: 'todo', 
    name: 'To-Do',
    render: () => {
      return (
        <div key={globalId()}>
          <Todo />
        </div>
      )
    }
  }
]
function App() {
  const [renderText, setRenderText] = useState('')
  const [appOpen, setAppOpen] = useState(false);

  function openApp(item){
    setRenderText(item.render())
    setAppOpen(true);
  }

  function closeApp(){
    if(window.confirm('是否关闭当前应用')){
      setRenderText('')
      setAppOpen(false)
    }
  }

  return (
    <div className="App">
      {
        !appOpen && 
          <div style={{ padding: '10px' }}>
            {
              apps.map(a => {
                return (
                  <div key={a._id} className='app-icon pointer' onDoubleClick={() => openApp(a)}>
                    <span>{a.name}</span>
                  </div>
                )
              })
            }
          </div>
      }
      {
        !!appOpen && [renderText]
      }
      {
        !!appOpen && 
          <div className='app-close pointer' onClick={closeApp}>
            <SvgIcon iconType='poweroff' color='red' size='md' />
          </div>
      }
    </div>
  );
      //<Scene />
  // return (
  //   <div>
  //     <Todo />
  //     {/* <Calendar props={{calendar: {}}}/> */}
  //     {/* <Order /> */}
  //     {/* <HttpReqCompare /> */}
  //   </div>
  // )
}

export default App;
