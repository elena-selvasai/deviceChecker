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
        system.browser = getBrowser(userAgent);
    }
    if (system.platform === undefined) {
        system.platform = getPlatform(userAgent);
    }
    setResult();

}

function getPlatform(agent) {
    let platform = undefined;
    if (/iphone|ipad/i.test(agent)) {
        platform = "iOS";
    } else if (/android/i.test(agent)) {
        platform = "android";
    } else if (/mac os/i.test(agent)) {
        platform = "mac";
    } else if (/linux/i.test(agent)) {
        platform = "linux";
    }

    if (platform === 'mac' && supportMultipleTouch()) {
        platform = "iOS";
    }
    return platform;
}

function supportMultipleTouch() {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
}

function getBrowser(agent) {
    let browser = undefined;
    if (agent.indexOf('trident') >= 0) {
        browser = 'IE';
    } else if (agent.indexOf('firefox') >= 0) {
        browser = 'FIREFOX';
    } else if (agent.indexOf('edg') >= 0) {
        browser = 'EDGE';
    } else if (agent.indexOf('chrome') >= 0) {
        browser = 'CHROME';
    } else if (agent.indexOf('safari') >= 0) {
        browser = 'SAFARI';
    }
    return browser;
}

function setResult() {
    document.querySelector(".text_box").innerHTML = `mobile:${system.mobile} platform:${system.platform} browser:${system.browser}`;
}