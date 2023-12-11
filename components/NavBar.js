import { StatusBar, TouchableOpacity, Text, View } from 'react-native';
import { useState } from 'react';
import styled from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const NavBarHandler = styled.View`
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: black;
    border-bottom-style: solid;
    border-top-width: 1px;
    border-top-color: black;
    border-top-style: solid;
`;

const BarHandler = styled.TouchableOpacity`
    background-color: ${props => (props.isPressed == 1 ? 'gray' : 'rgba(0,0,0,0.1)')};
    width: 50%;
    height: 100%;
    border-right-color: black;
    border-right-style: solid;
    border-right-width: 1px;
    align-items: center;
`;

const Main = styled.View`
    height: 20%;
    width: 100%;
`

export default function NavBar() {

  const [isPressedAlarm, setIsPressedAlarm] = useState(false);
  const [isPressedWeather, setIsPressedWeater] = useState(false);
  return (
    <Main>
        <NavBarHandler>
            <BarHandler 
            onPress={() => {
                setIsPressedWeater(false);
                setIsPressedAlarm(1);
            }}
            isPressed={isPressedAlarm}
            >
                <MaterialCommunityIcons name='alarm' style={{fontSize: 50}}/>
            </BarHandler>
        
            <BarHandler
            onPress={() => {
                setIsPressedAlarm(false);
                setIsPressedWeater(1);
            }}
            isPressed={isPressedWeather}
            >
                <MaterialCommunityIcons name='weather-cloudy' style={{fontSize: 50}}/>
            </BarHandler>

        </NavBarHandler>

        <StatusBar theme="auto" />
    </Main>
  );
}
