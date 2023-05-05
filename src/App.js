// import logo from './logo.svg';
import './App.css';
import Calendar from './page/calendar/Calendar';
import Scene from './page/flow/Scene';
import HttpReqCompare from './page/hankyu/HttpReqCompare';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
      //<Scene />
  return (
    <div>
      <Calendar props={{calendar: {}}}/>
      {/* <Order /> */}
      {/* <HttpReqCompare /> */}
    </div>
  )
}

export default App;
