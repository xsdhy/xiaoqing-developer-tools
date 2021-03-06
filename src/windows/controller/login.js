const {BrowserWindow, app, Menu} = require('electron')
const Update = require('../../utils/update')

const path = require('path');
const MenuUtils = require("../../utils/menu");
const name = app.getName()

class LoginWindow {

  // loginWindow = null
  isShown = false

  menu = [
    {
      label: name,
      submenu: [
        {
          label: `关于 ${name}`,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: '服务',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: `隐藏 ${name}`,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: '隐藏其它',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: '显示所有',
          role: 'unhide'
        },
        {
          type: 'separator'
        }, {
          label: '退出',
          accelerator: 'Command+Q',
          click: function () {
            app.quit()
          }
        }
      ]
    }
  ]

  constructor() {
    this.loginWindow = new BrowserWindow({
      width: 400,
      height: 400,
      title: '登录小青开发者工具',
      // resizable: false,
      center: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    })
    let update = new Update(this.loginWindow)
    update.load()
    this.loginWindow?.setIcon(process.platform === 'darwin'?`${path.join(__dirname,'../../../icons/mac.ico')}`:`${path.join(__dirname,'../../../icons/win.ico')}`)
    this.loginWindow.loadURL(`file://${path.join(__dirname, '../views/login.html')}`)
    this.addUpdateMenuItems(this.menu[0].submenu, 1)
    MenuUtils.generateLoginMenu()
  }

  addUpdateMenuItems(items, position) {
    if (process.mas) return
    const version = app.getVersion()
    let updateItems = [{
      label: `Version ${version}`,
      enabled: false
    }]
    items.splice.apply(items, [position, 0].concat(updateItems))
  }

  show() {
    this.loginWindow.show();
    this.isShown = true;
  }

  hide() {
    this.loginWindow.hide();
    this.isShown = false;
  }

  deInit() {
    this.loginWindow.destroy()
  }
}

module.exports = LoginWindow;
