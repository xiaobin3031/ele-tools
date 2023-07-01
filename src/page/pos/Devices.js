// 设备管理
import Label from '../../component/Label'
import SvgIcon from '../../component/SvgIcon'
import './device.css'

import { useState } from "react"

export default function Devices({}){

  const [deviceList, setDeviceList] = useState(window.adb.deviceList())

  return (
    <div className="pos-devices">
      <div className='content'>
        {
          deviceList.map(device => {
            return (
              <div className='device' key={device.deviceId}>
                {
                  Object.keys(device).sort((a, b) => a.localeCompare(b) <= 0)
                    .map(a => {
                      return (
                        <div key={`${device.deviceId}-${a}`}>
                          <Label>{a}: </Label>
                          <Label>{device[a]}</Label>
                        </div>
                      )
                    })
                }
                <div className='icon'>
                  <Label>connectBy: </Label>
                  {
                    !!device.usb && <SvgIcon iconType='usb' />
                  }
                  {
                    !device.usb && <SvgIcon iconType='wifi' />
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}