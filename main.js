// Modules to control application life and create native browser window
// const {app, BrowserWindow} = require('electron')
const path = require('path')

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const Menu = electron.Menu
const app = electron.app

const Store = require('electron-store');
const store = new Store();

const filter = {
    // urls: ['http://*.kakayang.cn/*']
    urls: []
};

var mainWindow

let template = [
    {
        label: '开放平台',
        submenu: [
            {
                label: '主页',
                click: function (item, focusedWindow) {
                    mainWindow.loadFile('index.html')
                }
            }
        ]
    },
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
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            }
        }, {
            type: 'separator'
        }, {
            label: '应用程序菜单演示',
            click: function (item, focusedWindow) {
                if (focusedWindow) {
                    const options = {
                        type: 'info',
                        title: '应用程序菜单演示',
                        buttons: ['好的'],
                        message: '此演示用于 "菜单" 部分, 展现如何在应用程序菜单中建立可点击的菜单项.'
                    }
                    electron.dialog.showMessageBox(focusedWindow, options, function () {
                    })
                }
            }
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


function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(filter, onBeforeSendHeaders);

    // let view = new BrowserView()
    // mainWindow.setBrowserView(view)
    // view.setBounds({ x: 0, y: 100, width: 500, height: 500 })
    // view.webContents.loadFile('index.html')

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

function addUpdateMenuItems(items, position) {
    if (process.mas) return
    const version = electron.app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }]
    items.splice.apply(items, [position, 0].concat(updateItems))
}

function findReopenMenuItem() {
    const menu = Menu.getApplicationMenu()
    if (!menu) return

    let reopenMenuItem
    menu.items.forEach(function (item) {
        if (item.submenu) {
            item.submenu.items.forEach(function (item) {
                if (item.key === 'reopenMenuItem') {
                    reopenMenuItem = item
                }
            })
        }
    })
    return reopenMenuItem
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


if (process.platform === 'darwin') {
    const name = electron.app.getName()
    template.unshift({
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

    // 窗口菜单.
    template[3].submenu.push({
        type: 'separator'
    }, {
        label: '前置全部',
        role: 'front'
    })
    addUpdateMenuItems(template[0].submenu, 1)
}

if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
}

app.on('ready', function () {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('browser-window-created', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
    let reopenMenuItem = findReopenMenuItem()
    if (reopenMenuItem) reopenMenuItem.enabled = true
})


function onBeforeSendHeaders(details, callback) {
    if (details.requestHeaders) {
        var token = store.get('token')
        details.requestHeaders['Authorization'] = "Bearer " + token;
    }
    callback({requestHeaders: details.requestHeaders});
}
