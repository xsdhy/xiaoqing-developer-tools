const {BrowserWindow, BrowserView, ipcMain, dialog, app, Menu} = require('electron')
const Update = require('../../utils/update')
const Store = require('electron-store')
const store = new Store()
const {log} = require('../../utils/log')
// const icon = require('../../../icons/win.ico')

const path = require('path')
const name = app.getName()

class HomeWindow {

  isShown = false
  filter = {
    urls: ['*://*.xiaoqing.xyz/*','*://*.xqtx.top/*'],
    // urls: []
  };

  constructor() {
    this.homeWindow = new BrowserWindow({
      width: 1000,
      height: 800,
      minHeight: 500,
      minWidth: 700,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js'),
        devTools: false
      }
    })
    this.homeWindow?.setIcon(process.platform === 'darwin'?`${path.join(__dirname,'../../../icons/mac.ico')}`:`${path.join(__dirname,'../../../icons/win.ico')}`)
    this.homeWindow.webContents.session.webRequest.onBeforeSendHeaders(this.filter, this.onBeforeSendHeaders);

    this.webView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: true,
        worldSafeExecuteJavaScript: true,
      },
    })
    this.homeWindow.setBrowserView(this.webView)
    this.webView.setBounds({x: 0, y: 60, width: this.homeWindow.getBounds().width-16, height: 740})
    // webView.setBounds({x: 0, y: 700, width: 1000, height: 100})
    this.webView.webContents.loadURL(`file://${path.join(__dirname, '../views/index.html')}`)
    this.webView.setAutoResize({width: true, height: true})
    this.webView.webContents.openDevTools({mode: "right", activate: true})
    // this.homeWindow.openDevTools({mode: "right", activate: true})
    this.initAction()
    this.createMenu()
    // and load the index.html of the app.

  }

  async initAction() {
    await this.homeWindow.loadURL(`file://${path.join(__dirname, '../views/top.html')}`)
    ipcMain.on('open-url', (event, args) => {
      this.webView.webContents.loadURL(args)
    })

    ipcMain.on('go-back',(event,args)=>{
        if (this.webView.webContents.canGoBack()) {
            this.webView.webContents.goBack()
        }
    })

    ipcMain.on('go-forward',(event,args)=>{
      if (this.webView.webContents.canGoForward()) {
        this.webView.webContents.goForward()
      }
    })

    this.webView.webContents.on('did-navigate', (event, url) => {
      this.homeWindow.webContents.send('urlChange', url)
    })

    this.webView.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      this.webView.webContents.loadURL(url);
    });
  }

  createMenu() {
    let menu = [
      {
        label: '编辑',
        submenu: [{
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        }, {
          label: '重作',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        }, {
          type: 'separator'
        }, {
          label: '剪切',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        }, {
          label: '复制',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        }, {
          label: '粘贴',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        }, {
          label: '全选',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }]
      },
      {
        label: '查看',
        submenu: [{
          label: '重载',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              // 重载以后, 刷新并关闭全部的次要窗体
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach(function (win) {
                  if (win.id > 1) {
                    win.close()
                  }
                })
              }
              focusedWindow.reload()
            }
          }
        }, {
          label: '切换全屏',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F'
            } else {
              return 'F11'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }
        }, {
          label: '切换开发者工具',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: (item, focusedWindow) => {
            this.webView.webContents.toggleDevTools()
            // if (focusedWindow) {
            //     focusedWindow.toggleDevTools()
            // }
          }
        },
          {
          type: 'separator'
        }]
      },
      {
        label: '窗口',
        role: 'window',
        submenu: [{
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }, {
          type: 'separator'
        }, {
          label: '从新打开窗口',
          accelerator: 'CmdOrCtrl+Shift+T',
          enabled: false,
          key: 'reopenMenuItem',
          click: function () {
            app.emit('activate')
          }
        }]
      }
    ]
    if (process.platform === 'darwin') {
      menu.unshift({
        label: name,
        submenu: [{
          label: `关于 ${name}`,
          role: 'about'
        }, {
          type: 'separator'
        }, {
          label: '服务',
          role: 'services',
          submenu: []
        }, {
          type: 'separator'
        }, {
          label: `隐藏 ${name}`,
          accelerator: 'Command+H',
          role: 'hide'
        }, {
          label: '隐藏其它',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        }, {
          label: '显示所有',
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          label: '退出',
          accelerator: 'Command+Q',
          click: function () {
            app.quit()
          }
        }]
      })
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
  }

  show() {
    this.homeWindow.show();
    this.isShown = true;
  }

  hide() {
    this.homeWindow.hide();
    this.isShown = false;
  }

  onBeforeSendHeaders(details, callback) {
    if (details.requestHeaders) {
      let token = store.get('token')
      details.requestHeaders['Authorization'] = "Bearer " + token;
    }
    callback({requestHeaders: details.requestHeaders});
  }

  deInit() {
    this.homeWindow.destroy()
  }

}

module.exports = HomeWindow
