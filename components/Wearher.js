import { Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import * as Font from 'expo-font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const getUserIP = async () => {
    const res = await fetch('https://api.ipify.org/?format=json');
    const data = await res.json();
    return data.ip;
}

const getCityName = async () => {
    const ip = await getUserIP();
    const res = await fetch(`https://ipinfo.io/${ip}?token=${IP_INFO_TOKEN}`);
    const data = await res.json()
    return data.city;
}


const getLonAndLat = async (name) => {
   const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=6&appid=${API_KEY}`);
   const data = await res.json();
   return data[0];
}

const getWeather = async () => {
    const cityName = await getCityName();
    const lonAndLat = await getLonAndLat(cityName);
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lonAndLat.lat}&units=metric&lon=${lonAndLat.lon}&appid=${API_KEY}`);
    const weatherData = await res.json();
    const dataArray = [];
    let i = 0;
    while (dataArray.length != weatherData.list.length) {
        let date = new Date(weatherData.list[i].dt_txt)
        const weatherObj = {
            feels_like: weatherData.list[i].main.feels_like,
            temp: weatherData.list[i].main.temp,
            temp_max: weatherData.list[i].main.temp_max,
            temp_min: weatherData.list[i].main.temp_min,
            weather: weatherData.list[i].weather,
            time: weatherData.list[i].dt_txt.match(/\d{2}:\d{2}/)[0],
            day: date.getDay()
        }
        dataArray.push(weatherObj);
        i++;
    }
    return dataArray;
}


export default function Weather() {
    const [currentWeather, setCurrentWeather] = useState([{temp: "6", temp_max: "14", temp_min: "12", feels_like: "10", weather: [{main: "Snow"}]}]);
    const [cityName, setCityName] = useState('');

    const days = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

    const weathersIcons = {
        Snow: 'weather-snowy-heavy',
        Drizzle: 'weather-partly-rainy',
        Rain: 'weather-rainy',
        Thunderstorm: 'weather-lightning-rainy',
        Mist: 'weather-fog',
        Fog: 'weather-fog',
        Smoke: 'weather-fog',
        Haze: 'weather-fog',
        Dust: 'weather-fog',
        Sand: 'weather-fog',
        Ash: 'weather-fog',
        Squall: 'weather-windy',
        Tornado: 'weather-tornado',
        Clear: 'white-balance-sunny',
        Clouds: 'cloud-outline',    
        default: 'error'
    };

    const BackgroundImages = {
        Drizzle: require(`../assets/img/Drizzle.jpg`),
        Rain: require(`../assets/img/Rain.jpg`),
        Snow: require(`../assets/img/Snow.jpg`),
        Thunderstorm: require(`../assets/img/Thunderstorm.jpg`),
        Fog: require(`../assets/img/Fog.jpg`),
        Mist: require(`../assets/img/Fog.jpg`),
        Smoke: require(`../assets/img/Fog.jpg`),
        Haze: require(`../assets/img/Fog.jpg`),
        Dust: require(`../assets/img/Fog.jpg`),
        Sand: require(`../assets/img/Fog.jpg`),
        Ash: require(`../assets/img/Fog.jpg`),
        Squall: require(`../assets/img/Wind.jpg`),
        Clear: require(`../assets/img/Sunny.jpg`),
        Clouds: require(`../assets/img/Clouds.jpg`),
        default: require(`../assets/img/default.jpg`)
    }

    useEffect(() => {
        loadFonts();
        const fetchWeather = async () => {
            const gettedCityName = await getCityName();
            setCityName(gettedCityName);
            try {
                const weatherData = await getWeather();
                setCurrentWeather(weatherData);
            } catch (e) {
                console.error(e);
            }
        };
        fetchWeather();
    }, []);

  return (
    <Main>
        <BackgroundImage source={BackgroundImages[currentWeather[0].weather[0].main] ? BackgroundImages[currentWeather[0].weather[0].main] : BackgroundImages['default']}>
            <WeatherHandler>
                <CityName>{cityName ? cityName : "LOL"}</CityName>
                <TempHandlerHeader>
                    <StyledTemp>
                        {currentWeather[0] ? `${Math.round(currentWeather[0].temp)}℃` : "? ℃`"}
                    </StyledTemp>
                    <MaterialCommunityIcons 
                    name={currentWeather[0] 
                        ? 
                        weathersIcons[currentWeather[0].weather[0].main] 
                        : 
                        weathersIcons.default} 
                        style={{fontSize: 70}}/>
                </TempHandlerHeader>

                <Hr/>

                <TempHandler>
                    <LowAndHighHandler>
                        <LowAndHigh>
                            {currentWeather[0] ? `L: ${Math.round(currentWeather[0].temp_max)}℃` : "? ℃`"}
                        </LowAndHigh>
                    </LowAndHighHandler>
                    <LowAndHighHandler>
                        <LowAndHigh>
                            {currentWeather[0] ? `H: ${Math.round(currentWeather[0].temp_min)}℃` : "? ℃`"}
                        </LowAndHigh>
                    </LowAndHighHandler>  
                </TempHandler>

                <View>
                    <LowAndHigh>
                        {currentWeather[0] ? `Ощущается как: ${Math.round(currentWeather[0].feels_like)}℃` : "? ℃`"}
                    </LowAndHigh>
                </View>
                <TimeWeatherHandler horizontal>
                    {currentWeather.map((item, index) => (
                        index != 0 ?   
                            <DailyTempHandler key={index}>

                                <DailyIconHandler>
                                    <MaterialCommunityIcons 
                                    name={item ? weathersIcons[item.weather[0].main] : weathersIcons.default} 
                                    style={
                                        item.weather[0].main == 'Clear' 
                                        ?
                                        {fontSize: 55, color: 'yellow'}
                                        :
                                        item.weather[0].main == 'Rain' && item.weather[0].main == 'Drizzle'
                                        ? 
                                        {fontSize: 55, color: 'rgb(72, 72, 248)'}
                                        :
                                        {fontSize: 55, color: 'white'}
                                    }
                                    />
                                </DailyIconHandler>

                                <DailyTempInfoHandler>
                                    <View>
                                        <DailyTemp>
                                            {item ? `${Math.round(item.temp)}℃` : "0 ℃"}
                                        </DailyTemp>
                                    </View>

                                    <View>
                                        <DailyTemp  >
                                            {item ? item.time : null}
                                        </DailyTemp >
                                    </View>

                                    <View>
                                        <DailyTemp  >
                                            {item ? days[item.day] : null}
                                        </DailyTemp >
                                    </View>
                                </DailyTempInfoHandler>
                                

                            </DailyTempHandler>
                        :
                        null    
                    ))}
                </TimeWeatherHandler>
            </WeatherHandler>
        </BackgroundImage>
    </Main>
  );
}

export const loadFonts = async () => {
    await Font.loadAsync({
    'Cabin-Bold': require('../assets/fonts/Cabin-Bold.ttf'),
    'Cabin-Regular': require('../assets/fonts/Cabin-Regular.ttf'),
    'Cabin_Condensed-Regular': require('../assets/fonts/Cabin_Condensed-Regular.ttf'),
    'Cabin_Condensed-Bold': require('../assets/fonts/Cabin_Condensed-Regular.ttf')
    });
};

const DailyTemp = styled(Text)`
    color: white;
    font-size: 30px;
    font-family: Cabin_Condensed-Bold;
`
const DailyTempHandler = styled.View`
    background-color: rgb(59, 59, 59);
    border-radius: 20px;
    width: 80px;
    height: 220px;
    margin-left: 10px;
    margin-right: 10px;
`

const DailyIconHandler = styled.View`
    align-items: center;
    padding-top: 10px;
    padding-bottom: 15px; 
`

const DailyTempInfoHandler = styled.View`
    align-items: center;
`

const TimeWeatherHandler = styled.ScrollView`
    margin-top: 30px;
    flex-direction: row;
`;

const Main = styled.View`
    width: 100%;
    height: 87%;
`;
const BackgroundImage = styled.ImageBackground`
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const WeatherHandler = styled.View`
    width: 100%;
    height: 100%;
    background-image: url('../assets/img/winter.jpg');
    background-size: cover;
    display: flex;
    align-items: center;
`;


const TempHandler = styled.View`
    flex-direction: row;
    width: 100%;
`
const TempHandlerHeader = styled.View`
    align-items: center;
`

const StyledTemp = styled(Text)`
    font-size: 60px;
    color: black;
    font-family: Cabin_Condensed-Bold;
    align-items: center;
`

const CityName = styled(Text)`
    padding-top: 5%;
    font-size: 70px;
    font-family: Cabin_Condensed-Regular;
    color: black;
`

const Hr = styled.View`
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    border-style: solid;
    border-color: black;
    border-width: 1px;
`

const LowAndHigh = styled(Text)`
    font-size: 30px;
    font-family: Cabin_Condensed-Bold;
    color: black;
`
const LowAndHighHandler = styled.View`
    width: 50%;
    justify-content: space-around;
    flex: 1;
    justify-content: center;
    align-items: center;
`

