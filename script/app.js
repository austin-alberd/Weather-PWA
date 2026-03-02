const urlAPIURLHourly = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"
const urlAPIURLCurrent = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,precipitation&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"

let objHourlyWeather = {}
let objCurrentWeather = {}

//Load the data
document.addEventListener("DOMContentLoaded",()=>{
    //check if there is a current weather in session storage. If there is not pull it from the API and do set it. If it is just use that
    if(!sessionStorage.getItem("currentWeather")){
        console.log("No Current Weather Data Found. Pulling From API")
        objCurrentWeather = fetch(urlAPIURLCurrent,{
            method:"GET"
        }).then(res=>{
            if(res.ok){
                return res.json()
            }else{
                throw new Error("Bad Response")
            }
        }).then(data=>{
            console.log(data)
            sessionStorage.setItem("currentWeather",JSON.stringify(data))
            return data
        })
    }else{
        objCurrentWeather = sessionStorage.getItem("currentWeather")
    }

    //Check if there is an hourly weather in the local storage if there is put in the the data variable if not pull it and put it in local storage
    const dateCurrentDate = new Date()
    const strPullTime=`${dateCurrentDate.getFullYear()}${dateCurrentDate.getMonth()}${dateCurrentDate.getDate()}` //A little code that shows the last time the data was pulled YYYYMMDD

    if(!localStorage.getItem("hourlyWeather") || !localStorage.getItem("pullTime") || strPullTime != localStorage.getItem("pullTime")){
        console.log("No Hourly Weather Data Found or Current Hourly Weather Data Found. Pulling From API")
        objHourlyWeather = fetch(urlAPIURLHourly,{
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
            return data
        })
    }else{
        objHourlyWeather = sessionStorage.getItem("hourlyWeather")
    }
})
// Load the data in on page load
/*
document.addEventListener("DOMContentLoaded", ()=>{
    fetch(urlAPIURL,{
        method:"GET"
    }).then(res=>{
        if(res.ok){
            return res.json()
        }else{
            throw new Error("Bad Response")
        }
    }).then(data=>{
        // Load in the very basic stuff
        const strTemperature = data.current.temperature_2m
        const strHumidity = data.current.relative_humidity_2m
        const strPrecipitation = data.current.precipitation

        document.querySelector('#txtTemperature').innerHTML =`${strTemperature}°F`
        document.querySelector('#txtHumidity').innerHTML = `${strHumidity}%`
        document.querySelector('#txtPrecipitation').innerHTML = `${strPrecipitation} in.`

        // Make the weather chart
        new Chart(
            document.querySelector("#canvasTempChart"),
            {
                type: 'line',
                data:{
                    labels: data.hourly.time.map(date=>{
                        var strTempDate = new Date(date)
                        var strReturnTime = `${strTempDate.getHours()}:${strTempDate.getMinutes()}`
                        return strReturnTime
                    }),
                    datasets:[
                        {
                            label: "Temperature",
                            data: data.hourly.temperature_2m
                        }
                    ]
                }
            }
        )
    })
})*/