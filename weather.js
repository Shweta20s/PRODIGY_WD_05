const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab;
const API_KEY =  "4db1571c4573d6ff0dabeecb1b9e13b4";
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");  

       if(!searchForm.classList.contains("active"))
       {
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active");
       }

      else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // clicked tab is not searchWeather tab 
        // that means clicked tab is yourWeather tab  for that we have to show weatherinfo  
        // for that first we have to check coordinates from local  storage
        getFromSessionStorage();
           }
}
}
userTab.addEventListener("click" ,  () => {
    switchTab(userTab);
});
searchTab.addEventListener("click" , () => {
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
// make grantAccesscontainer invisible
    grantAccessContainer.classList.remove("active");
// make loader visible
    loadingScreen.classList.add("active");

    // API calling
    try{
        const response = await fetch( 
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const  data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(e){ 
        loadingScreen.classList.remove("active");
            } 
}

function renderWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");
 
     console.log(weatherInfo);
    cityName.innerText = weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${ weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser");
    }
}

function showPosition(position){

     const userCoordinates = {
     lat: position.coords.latitude,
     lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit" ,(e) =>{
    e.preventDefault();
    let cityName = searchInput.value ;

    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);

});


async function fetchSearchWeatherInfo(city){
grantAccessContainer.classList.remove("active");
userInfoContainer.classList.remove("active");
loadingScreen.classList.add("active");

try{
    const response = await fetch(
         `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    
}
catch(e){ 
    
}


}


