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

setResult();

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