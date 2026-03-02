const urlAPIURL = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,precipitation&current=temperature_2m,relative_humidity_2m,precipitation&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch"

// Load the data in on page load
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
})