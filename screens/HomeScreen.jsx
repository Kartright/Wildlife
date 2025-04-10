import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../authService';
import Slider from '@react-native-community/slider';

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchRadius, setSearchRadius] = useState(5);
  const { width } = Dimensions.get('window');

  // Get user's current location
  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });  
    }
    getCurrentLocation();
  }, []);


  // Fetch establishments from Firebase (simulated with sample data for now)
  useEffect(() => {
 
    const fetchPlaces = async () => {

      const querySnapshot = await getDocs(collection(db, "establishments"));
    
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
      
      const placesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),

      }));

      setPlaces(placesData);

    };

    fetchPlaces();

  }, []);


  // Filter places based on type
  const filteredPlaces = (filter === 'all') ? places : places.filter(place => place.type === filter);
  console.log(filteredPlaces);
  console.log("location" + location);

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={{ width: width - 50, height: 40}}
          minimumValue={0}
          maximumValue={25}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={setSearchRadius}
        />
        <Text style={styles.sliderValue}>{searchRadius}</Text>
      </View>
      {location && (
        <MapView style={styles.map} initialRegion={location}>
          {filteredPlaces.map(place => (
            <Marker
              key={place.id}
              coordinate={{ latitude: place.latitude, longitude: place.longitude }}
              title={place.name}
              description={`Rating: ${place.rating || 'N/A'}`}
              onPress={() => navigation.navigate('Detail', { place })}
            />
          ))}
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            image='../assets/images/icons8-person-64.png'
          />
          <Circle
            center={{ latitude: location.latitude, longitude: location.longitude }}
            radius={searchRadius * 1000}
          />
        </MapView>
      )}
      <View style={styles.filterBar}>
        <TouchableOpacity onPress={() => setFilter('all')}><Text>All</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('club')}><Text>Clubs</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('restaurant')}><Text>Restaurants</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { usrId: auth.currentUser.uid })}><Text>Profile</Text></TouchableOpacity>
      </View>
      <FlatList
        data={filteredPlaces}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Detail', { place: item })}>
            <Text style={styles.listItem}>{item.name} - {item.rating ? (item.rating / item.ratingCount).toFixed(1) : 'No ratings yet'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

}


const styles = StyleSheet.create({
  container: { flex: 1 },
  sliderContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-around'},
  sliderValue: { padding: 10, fontSize: 20, fontWeight: 'bold'},
  map: {
    width:'100%',
    height: 300,
  },
  filterBar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10 },
  listItem: { padding: 10, borderBottomWidth: 1 },
});