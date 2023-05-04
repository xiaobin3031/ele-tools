// import logo from './logo.svg';
import './App.css';
import Scene from './page/flow/Scene';
import HttpReqCompare from './page/hankyu/HttpReqCompare';
import Order from './page/open-api/order/Order';

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
      {/* <Order /> */}
      <HttpReqCompare />
    </div>
  )
}

export default App;
