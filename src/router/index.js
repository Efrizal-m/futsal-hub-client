import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginPage, SignUp, LandingPage, Fields, Matches, Players, Request, DetailField } from "../screens";
import { LandingPageOwner, AddField, ListRequest, EditField } from "../screens/Owner"
import { FontAwesome5 } from "@expo/vector-icons";
import BottomTabNavigator from "../components/BottomTabNavigator";
import { getAccessToken } from "../utility/token"


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabNavigator {...props} />}>
      <Tab.Screen name="Home" component={LandingPage} />
      <Tab.Screen name="Fields" component={Fields} />
      <Tab.Screen name="Players" component={Players} />
      <Tab.Screen name="Matches" component={Matches} />
      <Tab.Screen name="Request" component={Request} />
    </Tab.Navigator>
  );
};

const OwnerApp = () => {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabNavigator {...props} />}>
      <Tab.Screen name="Home" component={LandingPageOwner} />
      <Tab.Screen name="Fields" component={AddField} />
      <Tab.Screen name="Request" component={ListRequest} />
    </Tab.Navigator>
  )
}

const Router = () => {
  const [isSignedIn, setIsSignedIn] = useState("")
  getAccessToken()
    .then(result => {
      setIsSignedIn(result)
    })
  return (
    <Stack.Navigator>
      {
        isSignedIn ? (
          <>
            <Stack.Screen name="OwnerApp" component={OwnerApp} options={{ headerShown: false }}/>
            <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }}/>
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
            <Stack.Screen name="EditField" component={EditField} options={{ headerShown: false }}/>
            <Stack.Screen name="DetailField" component={DetailField} options={{ headerShown: false }}/>
          </>
        ) : (
          <>
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
            <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }}/>
            <Stack.Screen name="OwnerApp" component={OwnerApp} options={{ headerShown: false }}/>
          </>
        )
      }
      
    </Stack.Navigator>
  );
};

export default Router;