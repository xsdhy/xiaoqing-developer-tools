const {BrowserWindow, BrowserView, ipcMain, ipcRenderer} = require('electron')
const Store = require('electron-store')
const store = new Store()

const path = require('path')

class HomeWindow {

  isShown = false
  filter = {
    urls: ['*://*.xiaoqing.xyz/*'],
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
        preload: path.join(__dirname, 'preload.js')
      }
    })
    this.homeWindow.webContents.session.webRequest.onBeforeSendHeaders(this.filter, this.onBeforeSendHeaders);

    let webView = new BrowserView({
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js'),
        enableRemoteModule: true,
        worldSafeExecuteJavaScript: true,
      }
    })
    this.homeWindow.setBrowserView(webView)
    webView.setBounds({x: 0, y: 500, width: 1000, height: 700})
    // webView.setBounds({x: 0, y: 700, width: 1000, height: 100})
    webView.webContents.loadURL(`file://${path.join(__dirname, '../views/index.html')}`)
    webView.setAutoResize({width: true, height: true})
    webView.webContents.openDevTools({mode: "right", activate: false})

    // and load the index.html of the app.
    this.homeWindow.loadURL(`file://${path.join(__dirname, '../views/top.html')}`)
    ipcMain.on('open-url', (event, args) => {
      console.log(args)
      webView.webContents.loadURL(args)
    })

    webView.webContents.on('will-navigate', (event, url) => {
      this.homeWindow.webContents.send('urlChange', url)
    })

    webView.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      webView.webContents.loadURL(url);
    });
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

}

module.exports = HomeWindow
