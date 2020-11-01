function renderImage(content) {
    document.getElementById('content').innerHTML = content;
}

async function getGifUrl() {
    let tag = document.getElementById('tag').value;
    let url = 'https://api.giphy.com/v1/gifs/random?api_key=VFMynvOrI48QtFS2jNCRWe3JufaIlBFY&tag=' + tag;
    let result = await fetch(url);
    let jsonResult = await result.json();
    return jsonResult.data;
}

document.getElementById('getGif').addEventListener('click', async function() {
    var imageData = await getGifUrl();
    renderImage('<div class="space"></div><a href="' + imageData.url + '" target="_blank"><img class="image img-responsive img-rounded" src="' + imageData.fixed_height_small_url + '" /></a>');

});


//Lưu lời chào
chrome.storage.sync.get('greeting', function(data){
    var text = document.getElementById('greetingValue').value;
    if ( data.greeting === undefined) {
        text = '';
    }
    else 
    document.getElementById('greetingValue').value = data.greeting;
});

document.getElementById('saveGreeting').addEventListener('click', function() {
    const greeting = document.getElementById('greetingValue').value;
    chrome.storage.sync.set({'greeting': greeting}, function(){
        console.log('Save greeting: ', greeting);
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "setGreeting", contentGreeting: greeting});
    });
});

//Lưu từ khoá để lấy ảnh nền chủ đề
chrome.storage.sync.get('theme', function(data){
    var text = document.getElementById('themeKeyword').value;
    if ( data.theme === undefined) {
        text = '';
    }
    else 
    document.getElementById('themeKeyword').value = data.theme;
});

document.getElementById('saveTheme').addEventListener('click', function() {
    const theme = document.getElementById('themeKeyword').value;
    chrome.storage.sync.set({'theme': theme}, function(){
        console.log('Save theme: ', theme);
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "setTheme", contentTheme: theme});
    });
});