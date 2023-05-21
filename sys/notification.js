// const { Notification } = require('electron')
const Notification = require('./notification.js')
const electron = require('electron')
// see <a href="https://www.electronjs.org/docs/latest/api/notification">Notification</a>

const NOTIFICATION_TITLE = 'Title'
const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
const CLICK_MESSAGE = 'Notification clicked!'

new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
//   .onclick = () => { alert(CLICK_MESSAGE) }