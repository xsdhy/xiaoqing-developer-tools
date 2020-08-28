// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron')
const Store = require('electron-store');
const store = new Store();

var button_to_start=document.getElementById('button_to_start');
var token=document.getElementById('token');
var url=document.getElementById('url');

button_to_start.onclick=toStart;
console.log("获取到到token",store.get('token'))
token.value=store.get('token')

function toStart(){
    // console.log(token.value)
    console.log(url.value)
    ipcRenderer.send('open-url', url.value)
    store.set('token',token.value);
    // window.location.href=url.value
}
