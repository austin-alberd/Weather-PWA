//36.16184839116766, -85.4981945742203
const strLat=36.16184839116766
const strLong=-85.4981945742203
const urlAPIURLHourly = `https://api.open-meteo.com/v1/forecast?latitude=${strLat}&longitude=${strLong}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
const urlAPIURLCurrent = `https://api.open-meteo.com/v1/forecast?latitude=${strLat}&longitude=${strLong}1&current=temperature_2m,relative_humidity_2m,precipitation&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`

let objHourlyWeather = {}
let objCurrentWeather = {}

//Function to update the current weather data
function updateCurrentWeatherData(){
    const strTemperature = objCurrentWeather.current.temperature_2m
    const strHumidity = objCurrentWeather.current.relative_humidity_2m
    const strPrecipitation = objCurrentWeather.current.precipitation

    console.log(strTemperature)
    document.querySelector('#txtTemperature').innerHTML =`${strTemperature}&deg;F`
    document.querySelector('#txtHumidity').innerHTML = `${strHumidity}%`
    document.querySelector('#txtPrecipitation').innerHTML = `${strPrecipitation} in.`
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
            console.log(data)
            localStorage.setItem("hourlyWeather",JSON.stringify(data))
            localStorage.setItem("pullTime",strPullTime)
            objHourlyWeather = data
        })
    }else{
        objHourlyWeather = JSON.parse(sessionStorage.getItem("hourlyWeather"))
    }
})
        
