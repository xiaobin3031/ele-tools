const { Notification } = require('electron')
// see <a href="https://www.electronjs.org/docs/latest/api/notification">Notification</a>


function show({title='提醒', subTitle, body, silent, icon, timeoutType='default'}){
  const notify = new Notification({
    title: title,
    subtitle: subTitle,
    body: body,
    silent: silent,
    icon: icon,
    timeoutType: timeoutType
  });

  notify.show();
}

show({});

const notification = {
  show: show
}

module.exports = notification;