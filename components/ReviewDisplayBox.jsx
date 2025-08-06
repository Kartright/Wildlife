import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Touchable } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const ReviewDisplayBox = ({ text, username, timestamp, rating, establishmentId, userId, navigation }) => {
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
          // Convert the Firebase Timestamp to a JavaScript Date object
          const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
          return date.toLocaleString(); // Format the date as a string
        }
        return ''; // If timestamp is not valid, return an empty string
      };

    const navToEstablishment = async () => {
        const docRef = doc(db, "establishments", establishmentId);
        const docSnap = await getDoc(docRef);
        navigation.navigate('Detail', {place: {id: establishmentId, ...docSnap.data()}} );
    }

    return (
        <View style={styles.container}>
        <TouchableOpacity onPress={() =>{navigation.navigate('UserDetails', {usrId: userId});}}>
            <View style={styles.rowContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={navToEstablishment}>
            <StarRating
                rating={rating}
                starSize={20}
                starStyle={{ marginHorizontal: 1 }}
                enableSwiping={false}
                onChange={() => {}}
                animationConfig={{ scale: 1 }}
            />
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
        </View>
    ) 
}

const styles = StyleSheet.create({
    container: { 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 4,
        padding: 10,
        margin: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginTop: 10,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 14,
        color: 'gray',
        lineHeight: 18,
    }
});

export default ReviewDisplayBox;