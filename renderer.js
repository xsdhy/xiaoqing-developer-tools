// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const Store = require('electron-store');
const store = new Store();

var button_to_start=document.getElementById('button_to_start');
var token=document.getElementById('token');
var url=document.getElementById('url');

button_to_start.onclick=toStart;

function toStart(){
    console.log(token.value)
    console.log(url.value)
    store.set('token',token.value);
    window.location.href=url.value
}
