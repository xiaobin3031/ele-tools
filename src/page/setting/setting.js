import { useRef, useState } from 'react';
import Row from '../../component/Row';
import Database from './content/database';

export default function Setting({}){

  const [navs, setNavs] = useState([
    {
      id: "databasee",
      content: "数据库"
    }
  ])

  const [render, setRender] = useState(null)

  function showNav(nav){
    setRender(<Database />)
  }

  return (
    <Row className="setting">
      <Row className="navs">
        {
          navs.length > 0 &&
            navs.map(a => {
              return (
                <div onClick={() => showNav(a)} className='pointer' key={a.id}>
                  {a.content}
                </div>
              )
            })
        }
      </Row>
      <Row className="content">
        {render}
      </Row>
    </Row>
  )
}