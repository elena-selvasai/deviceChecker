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
    if(system.mobile === undefined) {
        let md = new MobileDetect(navigator.userAgent);
        if (md.mobile() !== null) {
            system.mobile = true;
        }
        if (md.userAgent() !== null) {
            system.browser = md.userAgent();
        }
    }
    if(system.browser === undefined) {
        system.browser = getBrowser(userAgent);
    }
    setResult();

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
function setResult(){
    document.querySelector(".text_box").innerHTML = `mobile:${system.mobile} platform:${system.platform} browser:${system.browser}`;
}