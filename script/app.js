//36.16184839116766, -85.4981945742203
const strLat=36.16184839116766
const strLong=-85.4981945742203
const urlAPIURLHourly = `https://api.open-meteo.com/v1/forecast?latitude=${strLat}&longitude=${strLong}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m,precipitation_probability&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
const urlAPIURLCurrent = `https://api.open-meteo.com/v1/forecast?latitude=${strLat}&longitude=${strLong}&current=temperature_2m,relative_humidity_2m,weather_code,precipitation&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`

let objHourlyWeather = {}
let objCurrentWeather = {}

//Function to update the current weather data
function updateCurrentWeatherData(){
    const strTemperature = objCurrentWeather.current.temperature_2m
    const strHumidity = objCurrentWeather.current.relative_humidity_2m
    const strPrecipitation = objCurrentWeather.current.precipitation

    //set the basic stuff
    document.querySelector('#txtTemperature').innerHTML =`${strTemperature}&deg;F`
    document.querySelector('#txtHumidity').innerHTML = `${strHumidity}%`
    document.querySelector('#txtPrecipitation').innerHTML = `${strPrecipitation} in.`

    //do the weathercode stuff
    const intWeatherCode = objCurrentWeather.current.weather_code
    const objWeatherCodeMap={0:"Clear Sky", 1:"Mainly Clear", 2:"Partly Cloudy", 3:"Overcast", 45:"Fog", 48:"Depositing Rime Fog", 51:"Light Drizzle", 53:"Moderate Drizzle", 55:"Heavy Drizzle", 56:"Light Freezing Drizzle", 57:"Heavy Freezing Drizzle",61:"Slight Rain", 63:"Moderate Rain", 65:"Heavy Rain", 66:"Light Freezing Rain", 67:"Heavy Freezing Rain", 71:"Slight Snow Fall", 73:"Moderate Snow Fall", 75:"Heavy Snow Fall", 77:"Snow Grains", 80:"Slight Rain Showers", 81:"Moderate Rain Showers", 82:"Heavy Rain Showers", 85:"Slight Snow Showers", 86:"Heavy Snow Showers",95:"Thunderstorms",96:"Thunderstorms with Slight Hail", 97:"Thunderstorms with Heavy Hail"}
    const strWeatherCodeText = objWeatherCodeMap[intWeatherCode]
    let strWeatherIcon = ""
    //set the current weather conditions
    document.querySelector("#txtWeatherConditions").innerHTML = strWeatherCodeText

    //set the weather code icon
    if(intWeatherCode==0){
        strWeatherIcon='<i class="bi bi-brightness-high" aria-roledescription="clear sky"></i>'
    }

    if([1,2,3].includes(intWeatherCode)){
        strWeatherIcon=`<i class="bi bi-cloud-sun" aria-roledescription="${strWeatherCodeText} indicator" alt="${strWeatherCodeText}"></i>`
    }

    if([48,45].includes(intWeatherCode)){
        strWeatherIcon=`<i class="bi bi-cloud-fog" aria-roledescription="${strWeatherCodeText} indicator" alt="${strWeatherCodeText}"></i>`
    }

    if([51,53,55,61,63,65,80,81,82].includes(intWeatherCode)){
        strWeatherIcon=`<i class="bi bi-cloud-rain" aria-roledescription="${strWeatherCodeText} indicator" alt="${strWeatherCodeText}"></i>`
    }

    if([56,57,66,67,71,73,75,77,85,86].includes(intWeatherCode)){
        strWeatherIcon=`<i class="bi bi-cloud-snow" aria-roledescription="${strWeatherCodeText} indicator" alt="${strWeatherCodeText}"></i>`
    }

    if([95,96,99].includes(intWeatherCode)){
        strWeatherIcon=`<i class="bi bi-cloud-lightning-rain" aria-label="${strWeatherCodeText} indicator" alt="${strWeatherCodeText}"></i>`
    }

    //actually set the icon
    document.querySelector("#txtWeatherIcon").innerHTML = strWeatherIcon


}

function updateHourlyWeather(){
    const arrLabels = objHourlyWeather.hourly.time.map(strTime=> strTime.split("T")[1])
    const arrPrecipitation = objHourlyWeather.hourly.precipitation
    const arrTemperature = objHourlyWeather.hourly.temperature_2m

    new Chart(document.querySelector("#canTempChart"),{
        type:'bar',
        data:{
            labels:arrLabels,
            datasets:[{
                backgroundColor: '#0a314d',
                label:"Hourly Temperature in Farenheit",
                data:arrTemperature
            }]
        }
    })

    new Chart(document.querySelector("#canPrecipChart"),{
        type:'bar',
        data:{
            labels:arrLabels,
            datasets:[{
                backgroundColor: '#0a4d15',
                label:"Chance of Precipitation",
                data:arrPrecipitation
            }]
        }
    })

}

document.addEventListener("DOMContentLoaded",async ()=>{
    //Load the data from the API or session storage
    //check if there is a current weather in session storage. If there is not pull it from the API and do set it. If it is just use that
    if(!sessionStorage.getItem("currentWeather")){
        console.log("No Current Weather Data Found. Pulling From API")
        fetch(urlAPIURLCurrent,{
            method:"GET"
        }).then(res=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error("Bad Response")
            }
        }).then(data=>{
            sessionStorage.setItem("currentWeather",JSON.stringify(data))
            objCurrentWeather = data
            updateCurrentWeatherData()
        })
    }else{
        objCurrentWeather = JSON.parse(sessionStorage.getItem("currentWeather"))
        updateCurrentWeatherData()
    }

    //Check if there is an hourly weather in the local storage if there is put in the the data variable if not pull it and put it in local storage
    const dateCurrentDate = new Date()
    const strPullTime=`${dateCurrentDate.getFullYear()}${dateCurrentDate.getMonth()}${dateCurrentDate.getDate()}` //A little code that shows the last time the data was pulled YYYYMMDD

    if(!localStorage.getItem("hourlyWeather") || !localStorage.getItem("pullTime") || strPullTime != localStorage.getItem("pullTime")){
        console.log("No Hourly Weather Data Found or Current Hourly Weather Data Found. Pulling From API")
        fetch(urlAPIURLHourly,{
            method:"GET"
        }).then(res =>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error("Bad Response")
            }
        }).then(data=>{
            localStorage.setItem("hourlyWeather",JSON.stringify(data))
            localStorage.setItem("pullTime",strPullTime)
            objHourlyWeather = data
            updateHourlyWeather()
        })
    }else{
        objHourlyWeather = JSON.parse(localStorage.getItem("hourlyWeather"))
        updateHourlyWeather()
    }
})
        
