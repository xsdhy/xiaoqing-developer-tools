const {app, ipcMain} = require('electron');
const Store = require('electron-store')
const store = new Store()

const LoginWindow = require('./windows/controller/login')
const HomeWindow = require('./windows/controller/home')

class XiaoQingDeveloperTools {
  constructor() {
    this.loginWindow = null
    this.homeWindow = null
  }

  init() {
    this.initApp()
    this.initIpc()
  }


  initApp() {
    app.on('ready', () => {
      // this.createLoginWindow();
      // this.createHomeWindow()
      if (store.get('token')) {
        this.createHomeWindow()
        this.homeWindow?.show()
        // this.loginWindow?.hide()
      }else  {
        this.createLoginWindow()
        this.loginWindow?.show()
      }
    });

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  initIpc() {
    //监听显示主页
    ipcMain.on('showHome', () => {
      // this.loginWindow?.hide()
      this.createHomeWindow()
      this.loginWindow.deInit()
      this.homeWindow.show()
    })

    ipcMain.on('logout',() => {
      store.delete('token')
      store.delete('user')
      this.createLoginWindow()
      this.homeWindow.deInit()
      this.loginWindow.show()
    })
  }

  createLoginWindow() {
    this.loginWindow = new LoginWindow()
  }

  createHomeWindow() {
    this.homeWindow = new HomeWindow()
  }

}

new XiaoQingDeveloperTools().init()
