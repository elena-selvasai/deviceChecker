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
initAudio((result) => {
    document.querySelector(".user_media_box").innerHTML = "getUserMedia : " + result;
})
window.addEventListener('resize', () => setTimeout(() => setWindowSize(), 300));

function handleDeviceChange(event) {
    setMediaInfo('Media devices changed:' + JSON.stringify(event));
    console.log('Media devices changed:', event);
    // You can check event for specific changes and take appropriate actions
}

// Add an event listener for device changes
navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

// Initial check for available media devices
navigator.mediaDevices.enumerateDevices()
    .then(function (devices) {
        setMediaInfo('Available media devices:' + JSON.stringify(devices));
        console.log('Available media devices:', devices);
    })
    .catch(function (error) {
        setMediaInfo('Error enumerating devices:' + JSON.stringify(error));
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

function initAudio(onCallback) {
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
            // First get ahold of the legacy getUserMedia, if present
            let getUserMedia =
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia ||
                navigator.oGetUserMedia;
            if (!navigator.cancelAnimationFrame)
                navigator.cancelAnimationFrame =
                    navigator.webkitCancelAnimationFrame ||
                    navigator.mozCancelAnimationFrame;
            if (!navigator.requestAnimationFrame)
                navigator.requestAnimationFrame =
                    navigator.webkitRequestAnimationFrame ||
                    navigator.mozRequestAnimationFrame;

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                return Promise.reject(
                    new Error("getUserMedia is not implemented in this browser")
                );
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        };
    }
    navigator.mediaDevices
        .getUserMedia({mediaSource: true, audio: true})
        .then(function (stream) {
            if (onCallback) onCallback(true);
        })
        .catch(function (e) {
            if (onCallback) onCallback(false);
        });
}