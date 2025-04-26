import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth } from '../authService';
import Slider from '@react-native-community/slider';

export default function HomeScreen({ navigation }) {

    // User's current location
    const [location, setLocation] = useState(null);

    // List of places the user can view
    const [places, setPlaces] = useState([]);

    // Filter applied to place search
    const [filter, setFilter] = useState('all');

    // Radius of search ring around the user's current location
    const [searchRadius, setSearchRadius] = useState(5);
    const [filterRadius, setFilterRadius] = useState(5);

    const { width } = Dimensions.get('window');


    // Get user's current location
    useEffect(() => {
        async function getCurrentLocation() {

        // Requesting permission from application
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
            // query reference for only showing locations that are within a certain distance of you.
            const deltaLat = searchRadius / 111;
            const deltaLng = searchRadius / (111.320 * Math.cos(location.latitude * (Math.PI / 180)));
            const latMax = location.latitude + deltaLat;
            const latMin = location.latitude - deltaLat;
            const lngMax = location.longitude + deltaLng;
            const lngMin = location.longitude - deltaLng;
            const q = query(collection(db, "establishments"),
                            where("latitude", "<=", latMax),
                            where("latitude", ">=", latMin),
                            where("longitude", "<=", lngMax),
                            where("longitude", ">=", lngMin))

            const querySnapshot = await getDocs(q);
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

    }, [filterRadius, location]);


    // Navigate to AddLocation screen on map press
    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        console.log(coordinate);
        navigation.navigate('AddLocation', { coordinate });
    }


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
                    onSlidingComplete={setFilterRadius}
                    value={5}
                />
                <Text style={styles.sliderValue}>{Math.round(searchRadius)}</Text>
            </View>
            {location && (
                <MapView style={styles.map} initialRegion={location} showsUserLocation={true} onPress={handleMapPress}>
                {filteredPlaces.map(place => (
                    <Marker
                        key={place.id}
                        coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                        title={place.name}
                        description={`Rating: ${place.rating || 'N/A'}`}
                        onPress={(e) => {
                            e.stopPropagation();
                            navigation.navigate('Detail', { place });
                        }}
                    />
                ))}
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