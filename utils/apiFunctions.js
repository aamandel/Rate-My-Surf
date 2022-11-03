const { Weather } = require('../models');
const fetch = require("node-fetch");
const loadData = async (longitude, latitude, _beach_id) => {
    // get current hour
    let curHour = new Date().getUTCHours();
    // initialize empty weather variable
    let weather = null;

    // attempt to retrieve weather data for this beach from database
    try {
        weather = await Weather.findOne({
            where: {
                beach_id: _beach_id
            }
        })
    } catch (err) {
        console.log(err);
    }

    let dbNeedsUpdate = false;
    // if weather data was found, check if it is up to date
    if (weather) {
        let tide_info = weather.dataValues.tide_info;
        // parse the iso formatted date into parts
        let apiTimeParts = tide_info[0].time.split('-');
        // slice off the time of day
        apiTimeParts[2] = apiTimeParts[2].slice(0, 2);
        // creation date timestamp:
        let creationDate = Date.UTC(apiTimeParts[0], apiTimeParts[1] - 1, apiTimeParts[2]);
        let todayDate = new Date();
        // current day timestamp:
        let curDay = Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
        // check if timestamps match
        if (creationDate != curDay) {
            // time to update the database
            console.log("time to update database");
            // delete out of date entry
            try {
                await Weather.destroy({
                    where: {
                        beach_id: _beach_id
                    }
                })
            } catch (err) {
                console.log(err);
            }
            // mark that db needs update
            dbNeedsUpdate = true;
        } else {
            // database is up to date
            console.log("database is up to date");
        }
        // if no weather data was found, the database has no entry for this beach and must be updated
    } else {
        console.log("empty database, updating...");
        // mark that db needs update
        dbNeedsUpdate = true;
    }

    // update database if needed
    if (dbNeedsUpdate) {
        // prompt api for fresh data
        let tideResponse = await promptApiTide(longitude, latitude);
        let weatherResponse = await promptApiWeather(longitude, latitude);
        // save the api response into the database
        if (tideResponse && weatherResponse) {
            try {
                weather = await Weather.create({
                    beach_id: _beach_id,
                    tide_info: tideResponse.data,
                    weather_info: weatherResponse.hours
                })
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("failed to load api data");
        }
    }

    // finalize data to return
    if (!weather) {
        console.log("weather was not retrieved");
        return null;
    }
    try {
        let finalData = {
            tide: weather.dataValues.tide_info[curHour],
            swellDirection: weather.dataValues.weather_info[curHour].swellDirection.noaa,
            swellHeight: weather.dataValues.weather_info[curHour].swellHeight.noaa,
            swellPeriod: weather.dataValues.weather_info[curHour].swellPeriod.noaa,
            waterTemp: weather.dataValues.weather_info[curHour].waterTemperature.noaa,
            windDirection: weather.dataValues.weather_info[curHour].windDirection.noaa
        };
        return finalData;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const promptApiTide = async (longitude, latitude) => {
    console.log("fetching tide data...");
    let response = null;
    try {
        //fetch the specific API endpoint for forecast
        response = await fetch(`https://api.stormglass.io/v2/tide/sea-level/point?lat=${latitude}&lng=${longitude}`, {
            headers: {
                'Authorization': '686ce9b4-c0fc-11eb-9cd1-0242ac130002-686cea2c-c0fc-11eb-9cd1-0242ac130002'
            }
        })
    } catch (err) {
        console.log(err);
    }
    if (!response) {
        return null;
    }
    return response.json();
}

const promptApiWeather = async (longitude, latitude) => {
    console.log("fetching weather data...");
    let response = null;
    try {
        //fetch the specific API endpoint for forecast
        response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=${'swellDirection,swellHeight,swellPeriod,waterTemperature,windDirection'}&source=${'noaa'}`, {
            headers: {
                'Authorization': 'd46c43f8-c327-11eb-8d12-0242ac130002-d46c4484-c327-11eb-8d12-0242ac130002'
            }
        })
    } catch (err) {
        console.log(err);
    }
    if (!response) {
        return null;
    }
    return response.json();
}

module.exports = { loadData };