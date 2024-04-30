var system = {
    platform: undefined,
    mobile: undefined,
    // device: undefined,
    browser: undefined,
}

var userAgent = navigator.userAgent.toLowerCase();
if (system.browser === undefined) {
    getBrowser(userAgent);
}
if (system.platform === undefined) {
    getPlatform(userAgent);
}

setWindowSize();
setResult();
window.addEventListener('resize', () => setTimeout(() => setWindowSize(), 300));

function handleDeviceChange(event) {
    console.log('Media devices changed:', event);
    setMediaInfo('Media devices changed:' + JSON.stringify(event));
    // You can check event for specific changes and take appropriate actions
}

// Add an event listener for device changes
navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

// Initial check for available media devices
navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
        setMediaInfo('Available media devices:' + devices);
        console.log('Available media devices:', devices);
    })
    .catch(function (error) {
        setMediaInfo('Error enumerating devices:'+ error);
        console.error('Error enumerating devices:', error);
    });

function getPlatform(agent) {
    if (/windows/i.test(agent)) {
        system.platform = "windows";
        system.mobile = false;
    } else if (/iphone|ipad/i.test(agent)) {
        system.platform = "iOS";
        system.mobile = true;
    } else if (/android/i.test(agent)) {
        system.platform = "android";
        system.mobile = true;
    } else if (/mac os/i.test(agent)) {
        if (supportMultipleTouch()) {
            system.platform = "iOS";
            system.mobile = true;
        } else {
            system.platform = "mac";
            system.mobile = false;
        }
    } else if (/linux/i.test(agent)) {
        if (supportMultipleTouch()) {
            system.platform = "android";
            system.mobile = true;
        } else {
            system.platform = "linux";
            system.mobile = false;
        }
    }
}

function supportMultipleTouch() {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
}

function getBrowser(agent) {
    if (agent.indexOf('trident') >= 0) {
        system.browser = 'ie';
    } else if (agent.indexOf('firefox') >= 0) {
        system.browser = 'firefox';
    } else if (agent.indexOf('edg') >= 0) {
        system.browser = 'edge';
    } else if (agent.indexOf('chrome') >= 0) {
        system.browser = 'chrome';
    } else if (agent.indexOf('safari') >= 0) {
        system.browser = 'safari';
    }
}

function setResult() {
    document.querySelector(".text_box").innerHTML = `mobile:${system.mobile} platform:${system.platform} browser:${system.browser}`;
}

function setWindowSize() {
    let text = "<h1>WindowSize</h1>";
    text += `window.innerWidth/innerHeight<br>width:${window.innerWidth} height:${window.innerHeight}`
        + `<br><br>document.documentElement.clientWidth/clientHeight<br>width:${document.documentElement.clientWidth} height:${document.documentElement.clientHeight}`
        + `<br><br>document.body.clientWidth/clientHeight<br>width:${document.body.clientWidth} height:${document.body.clientHeight}`
        + `<br><br>screen.width/height<br>width:${screen.width} height:${screen.height}`
    document.querySelector(".size_box").innerHTML = text;
}

function setMediaInfo(text) {
    document.querySelector(".media_box").innerHTML = text;
}