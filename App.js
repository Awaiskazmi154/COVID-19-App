import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, TouchableHighlight} from 'react-native';
import { AsyncStorage } from 'react-native';
import Constants from 'expo-constants';

import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AssetExample from './components/AssetExample';

const useStats = (url, keyObj) => {
  const [getStats, setStats] = useState();

  useEffect(() => {
    async function fetchData() {
      console.log('Fecting Data...');

      const data = await fetch(url, keyObj).then((resp) => resp.json());

      setStats(data);
    }
    fetchData();
  }, []);
  return getStats;
}

const WorldStatistics = (props) => {
  const stats = useStats(props.url1, props.keyObj1);
  const pstats = useStats(props.url2, props.keyObj2);

  if (pstats && stats) var tpopulation = pstats.body.world_population;

  if (!stats && !pstats) return <View style={styles.container}><Text style={styles.result}>Loading....</Text></View>;

  return (
    <View style={styles.container}>
      <View ><Text style={styles.result}>Total Population : {tpopulation}</Text></View>
      <View >
      <Text style={styles.result}>
        Confirmed : {stats ? stats[0].confirmed : ''} Percentage :{' '}
        {stats ? ((stats[0].confirmed / tpopulation) * 100).toFixed(5) : ''}
         </Text>
      </View>
      
      <View >
      <Text style={styles.result}>
        Deaths : {stats ? stats[0].deaths : ''} Percentage :{' '}
        {stats ? ((stats[0].deaths / tpopulation) * 100).toFixed(5) : ''}
        </Text>
      </View >
      <View >
      <Text style={styles.result}>
        Recovered : {stats ? stats[0].recovered : ''} Percentage :{' '}
        {stats ? ((stats[0].recovered / tpopulation) * 100).toFixed(5) : ''}
        </Text>
      </View>
      <View >
      <Text style={styles.result}>
        Critical Cases : {stats ? stats[0].critical : ''} Percentage :{' '}
        {stats ? ((stats[0].critical / tpopulation) * 100).toFixed(5) : ''}
        </Text>
      </View>
      
      <View style={styles.result}><Text style={styles.result}>Last Updated : {stats ? stats[0].lastUpdate : ''}</Text></View>
            
      <View style={styles.buttons}>
     
      </View>
    </View> 
  );
}


const CustomButton = (props) => {
  if (props.pressed) {
    var btnColor = 'grey';
    var text = 'Saved'
  } else {
    btnColor = '#F194FF';
    text = 'Save'
  }
  return ( 
    <TouchableHighlight
      activeOpacity={0.5}
      onPress={props.onPressEvent}
      disabled={props.pressed}>
      <View style={{ ...styles.saveButton, backgroundColor: btnColor }}>
        <Text
          style={{
            fontSize: props.textSize,
            color: props.textColor,
            padding: 10,
          }}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const Countries = (props) => {

  const cnames = useStats(props.url2, props.keyObj2);
  const [getFavourites, setFavourites] = useState([]);


props.navigation.setOptions({
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <FontAwesome
          name="star"
          size={24}
          color="black"
          onPress={() => props.navigation.navigate('FavCountriesScreen', {getFavourites})}
        />
      </View>
    ),
  });


const saveToFav =  (country) => {

if(!getFavourites.includes(country))
setFavourites([...getFavourites,country])

}

useEffect(() => {
  if(!getFavourites)
props.navigation.navigate('FavCountriesScreen', {getFavourites} )
}, []);

  if (!cnames) return <View style={styles.container}><Text style={styles.result}>Loading....</Text></View>;

  return (
    <View>
      <ScrollView>
        {Object.entries(cnames.body.countries).map(([code, country]) => (
          <View style={styles.row}>
          <Text style={styles.result}
            onPress={() =>
              props.navigation.navigate('CountriesDetailsScreen', {
                country,
              }) 
            }>   
            {country} 
          </Text>
          <CustomButton 
        
        text={'Save'}
        textSize={12}
        textColor={'white'}
        onPressEvent={()=>saveToFav(country)}
        pressed={getFavourites.includes(country) ? true: false}
      />
</View>
        ))}  
        <Button
          title="fav"
          onPress={() => props.navigation.navigate('FavCountriesScreen', {getFavourites})}
        />
      </ScrollView>
    </View>
  );
}


const FavCountries = (props) => {

  const cnames = useStats(props.url2, props.keyObj2);

const [getcList, setcList] = useState(
    props.route.params.getFavourites
  );
  

  if (!cnames) return <View style={styles.container}><Text style={styles.result}>Loading....</Text></View>;

  return (
    <View>
      <ScrollView>
        {getcList? getcList.map((country) => (
          <View style={styles.container}>
          <Text style={styles.result}
            onPress={() =>
              props.navigation.navigate('CountriesDetailsScreen', {
                country,
              })
            }>
            {country}
          </Text>
</View>
        )):""}
      </ScrollView>
    </View>
  );
}

const CountryDetailsScreen = (props) => {
  if (props.route.params.country != 'United States') {
    var querryString1 =
      props.url1 + props.route.params.country + '&format=json';
  } else {
    querryString1 = props.url1 + 'USA' + '&format=json';
  }
  var querryString2 = props.url2 + props.route.params.country;

  console.log(querryString2);

  const cdata = useStats(querryString1, props.keyObj1);
  const pdata = useStats(querryString2, props.keyObj2);

  if (pdata) var cpopulation = pdata.body.population;

  if (pdata) console.log(pdata);

  if (!pdata) return <View style={styles.container}><Text style={styles.results}>Loading....</Text></View>;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.sView}>
        <View style={styles.list}>
          <View>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Country : {props.route.params.country}
            </Text>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Population: {pdata ? cpopulation : ''}
            </Text>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Confirmed : {cdata ? cdata[0].confirmed : ''} Percentage :{' '}
              {cdata
                ? ((cdata[0].confirmed / cpopulation) * 100).toFixed(5)
                : ''}
            </Text>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Deaths : {cdata ? cdata[0].deaths : ''} Percentage :{' '}
              {cdata ? ((cdata[0].deaths / cpopulation) * 100).toFixed(5) : ''}
            </Text>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Recovered : {cdata ? cdata[0].recovered : ''} Percentage :{' '}
              {cdata
                ? ((cdata[0].recovered / cpopulation) * 100).toFixed(5)
                : ''}
            </Text>
            <Text style={{ margin: 10, fontWeight: 'bold' }}>
              Critical Cases : {cdata ? cdata[0].critical : ''} Percentage :{' '}
              {cdata
                ? ((cdata[0].critical / cpopulation) * 100).toFixed(5)
                : ''}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttons}>
        <Button title="Back" onPress={() => props.navigation.goBack()} />
        
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

const StackNavigator1 = () => {
  return (
<Stack.Navigator initialRouteName={'CountriesScreen'}>
        
        <Stack.Screen
          name="CountriesScreen"
          options={{ title: 'Countries', headerTitleAlign: 'center' }}>
          {(props) => (
            <Countries
              {...props}
             
              url2={'https://world-population.p.rapidapi.com/allcountriesname'}
              keyObj2={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'world-population.p.rapidapi.com',
                },
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="FavCountriesScreen"
          options={{ title: 'Favourite Countries', headerTitleAlign: 'center' }}>
          {(props) => (
            <FavCountries
              {...props}
             
              url2={'https://world-population.p.rapidapi.com/allcountriesname'}
              keyObj2={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'world-population.p.rapidapi.com',
                },
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CountriesDetailsScreen"
          options={{ title: 'Country Details', headerTitleAlign: 'center' }}>
          {(props) => (
            <CountryDetailsScreen
              {...props}
              url1={'https://covid-19-data.p.rapidapi.com/country?name='}
              url2={
                'https://world-population.p.rapidapi.com/population?country_name='
              }
              keyObj1={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
                },
              }}
              keyObj2={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'world-population.p.rapidapi.com',
                },
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
  )
  }


const StackNavigator2 = () => {
  const stack =  StackNavigator1;
  return ( 
<Stack.Navigator initialRouteName={'FavCountriesScreen'}>    
      {stack}
      </Stack.Navigator>
   )
  }

 
const Drawer = createDrawerNavigator();

 const DrawerNavigator = () => {
  return (
      <Drawer.Navigator initialRouteName="World Statistics">
        <Drawer.Screen name="World Statistics" options={{ headerShown: true }}>
          {(props) => (
            <WorldStatistics
              {...props}
              url1={'https://covid-19-data.p.rapidapi.com/totals?format=json'}
              keyObj1={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
                },
              }}
              url2={'https://world-population.p.rapidapi.com/worldpopulation'}
              keyObj2={{
                method: 'GET',
                headers: {
                  'x-rapidapi-key':
                    '19449ad71bmsh6ef1edc74267936p131d7ajsn96f451de877a',
                  'x-rapidapi-host': 'world-population.p.rapidapi.com',
                },
              }}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Country Statistics" component={StackNavigator1} />
        <Drawer.Screen name="Favourite Countries" component={StackNavigator1} />
      </Drawer.Navigator>
  );
}
 
export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  buttons: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
   saveButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    elevation: 2,
  },
   result: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
    paddingBottom: '5%',
  },
  row: {
    flexDirection: 'row',
    fontSize: 15,
    padding: '5%',
    justifyContent: 'space-between',
  }
});
