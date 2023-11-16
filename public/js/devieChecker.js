var system = {
    platform: undefined,
    mobile: undefined,
    // device: undefined,
    browser: undefined,
}
if (navigator && navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
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
    if(system.mobile === undefined || system.browser === undefined) {
        let md = new MobileDetect(navigator.userAgent);
        if (md.mobile() !== null) {
            system.mobile = true;
        }
        if (md.userAgent() !== null) {
            system.browser = md.userAgent();
        }
    }
    setResult();

}

function setResult(){
    document.querySelector(".text_box").innerHTML = `mobile:${system.mobile} mobile:${system.mobile} browser:${system.browser}`;
}