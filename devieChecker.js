var system = {
    platform: undefined,
    mobile: undefined,
    // device: undefined,
    browser: undefined,
}
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf('windows') >= 0) {
    system.platform = "windows";
    system.mobile = false;
    detect();
} else if (navigator && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
    navigator.userAgentData
        .getHighEntropyValues([
            "mobile",
            "model",
            "platform",
            "architecture",
        ])
        .then((values) => {
            system.platform = values.platform;
            if (values.mobile === true) {
                system.mobile = true;
            }
            detect();
        });
} else {
    detect();
}

function detect() {
    if (system.mobile === undefined) {
        let md = new MobileDetect(navigator.userAgent);
        if (md.mobile() !== null) {
            system.mobile = true;
        }
        if (md.userAgent() !== null) {
            system.browser = md.userAgent();
        }
    }
    if (system.browser === undefined) {
        getBrowser(userAgent);
    }
    if (system.platform === undefined) {
        getPlatform(userAgent);
    }
    setResult();
}

function getPlatform(agent) {
    if (/iphone|ipad/i.test(agent)) {
        system.platform = "iOS";
        system.mobile = true;
    } else if (/android/i.test(agent)) {
        system.platform = "android";
        system.mobile = true;
    } else if (/mac os/i.test(agent)) {
        system.platform = "mac";
    } else if (/linux/i.test(agent)) {
        system.platform = "linux";
    }

    if (system.platform === 'mac' && supportMultipleTouch()) {
        system.platform = "iOS";
        system.mobile = true;
    }
    if (system.platform === 'linux' && supportMultipleTouch()) {
        system.platform = "android";
        system.mobile = true;
    }
}

function supportMultipleTouch() {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
}

function getBrowser(agent) {
    if (agent.indexOf('trident') >= 0) {
        system.browser = 'IE';
    } else if (agent.indexOf('firefox') >= 0) {
        system.browser = 'FIREFOX';
    } else if (agent.indexOf('edg') >= 0) {
        system.browser = 'EDGE';
    } else if (agent.indexOf('chrome') >= 0) {
        system.browser = 'CHROME';
    } else if (agent.indexOf('safari') >= 0) {
        system.browser = 'SAFARI';
    }
}

function setResult() {
    document.querySelector(".text_box").innerHTML = `mobile:${system.mobile} platform:${system.platform} browser:${system.browser}`;
}