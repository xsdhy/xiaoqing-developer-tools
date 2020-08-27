const {app, Menu} = require('electron')
const name = app.getName()

class MenuUtils {

  static generateLoginMenu() {
    let menu = [
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
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
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
}

module.exports = MenuUtils
