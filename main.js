const { app, BrowserWindow } = require('electron')
const mode = process.argv[2];
const url = require('url')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  console.log('mode', mode)
  if(mode === 'dev'){
    win.loadURL('http://localhost:3000')
  }else{
    win.loadURL(url.format({
      pathname: path.join(__dirname, './build/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
}

app.whenReady().then(() => {
  createWindow()
})