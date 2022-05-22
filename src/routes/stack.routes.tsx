import React from 'react'
import Financa from '../pages/Financa';
import Home from '../pages/Home';


import { createStackNavigator } from '@react-navigation/stack';

const stackRoutes = createStackNavigator();


const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        screenOptions={{
            headerShown:false,
            cardStyle: {
                backgroundColor: 'rgb(243,243,243)'
            }
        }}


    >
        <stackRoutes.Screen
            name="Home"
            component={Home}
        />


        <stackRoutes.Screen
            name="Financa"
            component={Financa}
        />

        

    </stackRoutes.Navigator>

)

export default AppRoutes;