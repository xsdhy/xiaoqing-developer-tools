const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

class Update {
    mainWindow
    constrcut(mainWindow) {
        this.mainWindow = mainWindow
        this.error()
        this.start()
        this.allow()
        this.unallowed()
        this.listen()
        this.download()
    }

    Message(type, data) {
        this.mainWindow.webContents.send('message', type, data)
    }

    error() { // 当更新发生错误的时候触发。
        autoUpdater.on('error', (err) => {
            this.Message(-1, err)
            console.log(err)
        })
    }

    start() { // 当开始检查更新的时候触发
        autoUpdater.on('checking-for-update', (event, arg) => {
            this.Message(0)
        })
    }
    allow() { // 发现可更新数据时
        autoUpdater.on('update-available', (event, arg) => {
            this.Message(1)
        })
    }
    unallowed() { // 没有可更新数据时
        autoUpdater.on('update-not-available', (event, arg) => {
            this.Message(2)
        })
    }
    listen() { // 下载监听
        autoUpdater.on('download-progress', () => {
            this.Message('下载进行中')
        })
    }
    download() { // 下载完成
        autoUpdater.on('update-downloaded', () => {
            this.Message(6)
            setTimeout(m => {
                autoUpdater.quitAndInstall()
            }, 1000)
        })
    }

    load() { // 触发器
        autoUpdater.checkForUpdates()
    }
}

module.exports = Update