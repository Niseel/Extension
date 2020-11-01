console.log('background running...');

function handleCreated() {
    console.log("Đã tạo 1 tab mới")

}

chrome.tabs.onCreated.addListener(handleCreated);


