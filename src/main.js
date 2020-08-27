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
  }


  initApp() {
    app.on('ready', () => {
      this.createLoginWindow();
      this.createHomeWindow()
      if (store.get('token')) {
        this.homeWindow?.show()
        this.loginWindow?.hide()
      }else  {
        this.homeWindow?.hide()
        this.loginWindow?.show()
      }
    });

    app.on('window-all-closed', function () {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    ipcMain.on('showHome', () => {
      this.loginWindow?.hide()
      this.homeWindow?.show()
    })

    // ipcMain.on('open-url', function (event, arg) {
    //   console.log("收到open-url")
    //   // console.log(arg);
    //   // webView.webContents.loadURL(arg);
    // });
  }

  createLoginWindow() {
    this.loginWindow = new LoginWindow()
  }

  createHomeWindow() {
    this.homeWindow = new HomeWindow()
  }

}

new XiaoQingDeveloperTools().init()
