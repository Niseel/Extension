console.log('Js of new tab is running..');

const APIkeyOpenWeather = 'd3e6310d82291ea10f3829fa892b1a94'; // API key get form https://openweathermap.org/
//set local storage to save value options
const checkBoxClock = document.getElementById('checkClock');
const checkBoxWeather = document.getElementById('checkWeather');

var storedItem = chrome.storage.sync.get('isClock', function(data){
    checkBoxClock.checked = data.isClock;
    if (data.isClock){
        console.log('log clock: true')
        $('#currTime').show();
        $('#currDate').show();
    }
    else {
        console.log('log clock: false');
        $('#currTime').hide();
        $('#currDate').hide();
    }
});

var storedItem1 = chrome.storage.sync.get('isWeather', function(data){
    checkBoxWeather.checked = data.isWeather;
    if (data.isWeather){
        console.log('log weather: true')
        $('#currWeather').show();
    }
    else {
        console.log('log weather: false');
        $('#currWeather').hide();
    }
});

checkBoxClock.addEventListener('change', function(){
    if(this.checked) {
        $('#currTime').show();
        $('#currDate').show();
        chrome.storage.sync.set({'isClock': true}, function(){
            console.log('log: true')
        });
    }
    else {
        $('#currTime').hide();
        $('#currDate').hide();
        chrome.storage.sync.set({'isClock': false}, function(){
            console.log('log: false')
        });
    }
});

checkBoxWeather.addEventListener('change', function(){
    if(this.checked) {
        $('#currWeather').show();
        chrome.storage.sync.set({'isWeather': true}, function(){
            console.log('log weather: true')
        });
    }
    else {
        $('#currWeather').hide();
        chrome.storage.sync.set({'isWeather': false}, function(){
            console.log('log weather: false')
        });
    }
});

document.getElementById('arrowIcon').addEventListener('click', function() {
    if ($( "#arrowIcon" ).hasClass('arowwActive')) {
        $( "#arrowIcon" ).removeClass( 'arowwActive');
    } else {
      $( "#arrowIcon" ).addClass( 'arowwActive');
    }

    if($( "#option").hasClass('optionActive')) {
        $( "#option" ).removeClass( 'optionActive');
    } else {
      $( "#option" ).addClass( 'optionActive');
    }
});



//runtime nhận dữ liệu lời chào
chrome.storage.sync.get('greeting', function(data){
    $("#xjjs-hid-greeting").html(data.greeting);
});

chrome.runtime.sendMessage({todo: "setGreeting"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == 'setGreeting') {
        $("#xjjs-hid-greeting").html(request.contentGreeting);
    }
});

//runtime nhận dữ liệu hình nền
chrome.storage.sync.get('theme', function(data){
    url = `https://api.unsplash.com/search/photos?query=${data.theme}&client_id=_So06ADJZEzeYV5DeVjvMvSD4vZ32q8cEu-vTud3gyY`;
    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {    
        var url = myJson.results[ranNumber(10)].urls.full;
        //$("#testthem").html(url);
        document.body.style.backgroundImage = `url(${url})`;
    });
});

function ranNumber(maxNum) {
    return Math.floor(Math.random() * maxNum);
}

chrome.runtime.sendMessage({todo: "setTheme"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.todo == 'setTheme') {
        url = `https://api.unsplash.com/search/photos?query=${request.contentTheme}&client_id=_So06ADJZEzeYV5DeVjvMvSD4vZ32q8cEu-vTud3gyY`;
        //$("#testthem").html(url);
        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {    
            var url = myJson.results[ranNumber(10)].urls.full;
            //$("#testthem").html(url);
            document.body.style.backgroundImage = `url(${url})`;
        });
    }
});



const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let UITime = document.getElementById('currTime');
let UIDate = document.getElementById('currDate');

function updateClock() {


    const date = new Date();
    const hours =  date.getHours().toString().padStart(2, '0');
    const minutes =  date.getMinutes().toString().padStart(2, '0');
    const seconds =  date.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const currentDate = date.toLocaleDateString("en-US", options).toString();

    if (UITime.innerText !== currentTime) {
        UITime.innerText = currentTime;
    }
    if (UIDate.innerText !== currentDate) {
        UIDate.innerText = currentDate;
    }
}


function updateWeather() {
    return navigator.geolocation.getCurrentPosition(async function (data) {
        let lat = data.coords.latitude;
        let long = data.coords.longitude;
        url = `http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${long}&cnt=10&appid=${APIkeyOpenWeather}`;
        console.log(url);
        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {              
                var temp = parseInt(myJson.list[0].main.temp)/10;
                var fl = parseInt(myJson.list[0].main.feels_like)/10;
                //left
                $("#temp").html('&nbsp; ' + temp);
                $("#feelLike").html('Feel like: ' + fl);
            
                //right
                $("#cityName").html(myJson.list[0].name);
                $("#cloudiness").html(myJson.list[0].clouds.all);
                $("#humidity").html(myJson.list[0].main.humidity);
                $("#windspeed").html(myJson.list[0].wind.speed);
                $("#weatherdes").html(myJson.list[0].weather[0].description);
                //console
                console.log(myJson.list[0]);
            });
    });
}



updateClock();
updateWeather();
setInterval(updateClock, 1200);
setInterval(updateWeather, 30000);



