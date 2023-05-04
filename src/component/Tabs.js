import '../css/tab.css'
import Row from './Row';

let tabGlobalId = 1;
function Tab({list}){

  function clickLi(event){
    Array.from(event.target.parentNode.children)
      .filter(a => a.classList.contains('active'))
      .forEach(a => a.classList.remove('active'))
    event.target.classList.add('active')
  }

  return (
    <>
      <div>
        <ul className='x-tab-head'>
          {
            list.map(a => {
              return (
                <li key={`x-tab-head-${tabGlobalId++}`} onClick={clickLi}>
                  {a.name}
                </li>
              )
            })
          }
        </ul>
      </div>
      <div className='x-tab-body'>

      </div>
    </>
  )
}

function TabPane({}){

}

export function Tabs({list}){

  return (
    <div className='x-tabs'>
      <Tab list={list} />
    </div>
  )
}