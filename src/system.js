const userAgent = window.navigator.userAgent

const isElectron = userAgent.indexOf('Electron') > -1
const isMac = !isElectron && userAgent.indexOf('Mac OS') > -1
const isWindow = !isElectron && userAgent.indexOf('Windows') > -1
const isLinux = !isElectron && userAgent.indexOf('Linux') > -1

export default {
  whenElectron: cb => {
    if(isElectron){
      cb()
    }
  },
  whenNotElectron: cb => {
    if(!isElectron){
      cb()
    }
  },
  whenMac: cb => {
    if(isMac){
      cb()
    }
  },
  whenNotMac: cb => {
    if(!isMac){
      cb()
    }
  },
  whenWindow: cb => {
    if(isWindow){
      cb()
    }
  },
  whenNotWindow: cb => {
    if(!isWindow){
      cb()
    }
  },
  whenLinux: cb => {
    if(isLinux){
      cb()
    }
  },
  whenNotLinux: cb => {
    if(!isLinux){
      cb()
    }
  }
}