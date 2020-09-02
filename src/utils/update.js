const {dialog} = require('electron')
const {autoUpdater} = require('electron-updater')
const {log} = require('./log')

class Update {
    constructor() {
        autoUpdater.autoDownload = false
        this.error()
        this.start()
        this.allow()
        this.noUpdate()
        this.listen()
        this.download()
    }

    error() { // 当更新发生错误的时候触发。
        autoUpdater.on('error', (err) => {
            log.error(err)
        })
    }

    start() { // 当开始检查更新的时候触发
        autoUpdater.on('checking-for-update', (event, arg) => {
            log.info('开始检查更新')
        })
    }

    allow() { // 发现可更新数据时
        autoUpdater.on('update-available', (event, arg) => {
            log.info('检查到更新', JSON.stringify(event))
            dialog.showMessageBox({
                title: '提示',
                message: '检查到更新，是否立即更新',
                detail: event.releaseNotes,
                buttons: ['yes', 'cancel']
            }).then(async res => {
                switch (res.response) {
                    case 0:
                        await autoUpdater.downloadUpdate()
                        break
                    case 1:
                        break
                }
            })
        })
    }

    noUpdate() { // 没有可更新数据时
        autoUpdater.on('update-not-available', (event, arg) => {
            log.info('无可用更新')
        })
    }

    listen() { // 下载监听
        autoUpdater.on('download-progress', () => {
            log.info('开始下载更新')
        })
    }

    download() { // 下载完成
        autoUpdater.on('update-downloaded', () => {
            log.info('下载更新完成')
            setTimeout(m => {
                log.info('开始安装更新')
                autoUpdater.quitAndInstall()
            }, 1000)
        })
    }

    load() { // 触发器
        log.info('检查')
        autoUpdater.checkForUpdatesAndNotify().then(res => {
            log.info(`版本：${JSON.stringify(res)}`)
        })
    }
}

module.exports = Update