import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './pages/Home'
import Point from './pages/Points'
import Detail from './pages/Detail'

const AppStack = createStackNavigator()

const Routes: React.FC = () => {
    return (
        <NavigationContainer>
            
            <AppStack.Navigator headerMode='none'>

                <AppStack.Screen name="home" component={Home} />
                <AppStack.Screen name="point" component={Point} />
                <AppStack.Screen name="detail" component={Detail} />
                    
            </AppStack.Navigator>

        </NavigationContainer>
    );
}

export default Routes;