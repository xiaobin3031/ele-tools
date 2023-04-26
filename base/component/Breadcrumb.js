import '../css/breadcrumb.css'

let breadCrumbGlobalId = 1;
export default function Breadcrumb({list, text = "_text", link = "_link", separate = "/"}){

  return (
    <div>
      {
        !!list && list.length > 0 &&
          <ul className="x-bread-crumb">
            {
              list.filter(a => !!a[text]).map(a => {
                return (
                  <li key={`x-bread-crumb-li-key-${breadCrumbGlobalId++}`} separate={separate}>
                    {
                      !!a[link] && <a href={a[link]}>{a[text]}</a>
                    }
                    {
                      !a[link] && <span>{a[text]}</span>
                    }
                  </li>
                )
              })
            }
          </ul>
      }
    </div>
  )
}