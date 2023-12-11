import { StatusBar, Text, View } from 'react-native';
import styled from 'styled-components/native';
import NavBar from './components/NavBar';
import Weather from './components/Wearher';


export default function App() {
  return (
    <View>
      <Weather/>
      <NavBar/>
    </View>
  );
}
