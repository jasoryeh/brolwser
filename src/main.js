const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron')
const nativeImage = require('electron').nativeImage
const path = require('path')
const url = require('url')

var child = require('child_process').execFile;

let win

function createWindow() {
    
    console.log("Creating window")
    
    win = new BrowserWindow({
        title: "brolwser",
        //icon: path.join(__dirname, 'assets/icon.png'),
        frame: false,
        transparent: true,
        //alwaysOnTop: true
    })
    
    console.log("Maximizing, and hiding unwanted UI")
    
    win.maximize()
    win.setMenuBarVisibility(false)
    
    console.log("Loading web pages")
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    
    // win.setIgnoreMouseEvents(true);
    
    /* load other external urls.
    win.loadURL(url.format({
        pathname: "jasoryeh.tk",
        protocol: 'https:',
        slashes: true
    }))*/
    
    //open dev-tools win.webContents.openDevTools()
    
    console.log("Registering close events")
    
    win.on('closed', () => {
        
        win = null
    
    })
    
    // add window mods here.
    
    //app.dock.hide()
    //win.setAlwaysOnTop(true, "floating")
    //win.setVisibleOnAllWorkspaces(true)
    //win.setFullScreenable(false)
    //app.dock.show()
    
    console.log("Reloading window properties")
    win.reload()
    
    console.log("Registering escape shortcut")
    /*globalShortcut.register('Escape', function(){
        win = null
        app.quit()
    })
    globalShortcut.register('1', function(){
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }))
    })
    globalShortcut.register('2', function(){
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'window.html'),
            protocol: 'file:',
            slashes: true
        }))
    })
    globalShortcut.register('3', function(){
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'overlay.html'),
            protocol: 'file:',
            slashes: true
        }))
    })*/
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if(win === null) {
        createWindow()
    }
})

var clickThrough = false;

ipcMain.on('setfs', (event, arg) => {
    /*if(args == "true") {
        win.setAlwaysOnTop(true, "floating")
        win.setVisibleOnAllWorkspaces(true)
        win.setFullScreenable(false)
    } else if(args == "false") {
        win.setAlwaysOnTop(false, "floating")
        win.setVisibleOnAllWorkspaces(false)
        win.setFullScreenable(true)
    }*/
    //console.log(arg);
    if(arg === "get") {
        event.returnValue = clickThrough.toString;
        return;
    }
    if(arg === "true") {
        clickThrough = true;
    } else if (arg === "false") {
        clickThrough = false;
    } else {
        clickThrough = !clickThrough;
    }
    if(win === null || win === undefined) return;
    win.setIgnoreMouseEvents(clickThrough, {forward: true});
})

ipcMain.on('pingelectron', (event, arg) => {
    console.log('Ping:' + arg)
    event.sender.send('pingback', 'pong');
});

ipcMain.on('log', (event, arg) => {
    console.log(arg)
    event.sender.send('logback', 'success');
});

ipcMain.on('load', (event, arg) => {
    console.log("Load:" + arg)
    if(arg == "1") {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }))
    } else if(arg == "2") {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'overlay.html'),
            protocol: 'file:',
            slashes: true
        }))
    } else if(arg == "3") {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'overlay.html'),
            protocol: 'file:',
            slashes: true
        }))
    }
    event.sender.send('loadback', 'success')
});

ipcMain.on('run-program', (event, arg) => {
    child(arg, "", (err, data) => {
        console.log(err);
        console.log(data);
    });
});