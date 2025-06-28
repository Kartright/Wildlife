import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

const ReviewDisplayBox = ({ text, username, timestamp, rating }) => {
    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.seconds) {
          // Convert the Firebase Timestamp to a JavaScript Date object
          const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
          return date.toLocaleString(); // Format the date as a string
        }
        return ''; // If timestamp is not valid, return an empty string
      };

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(timestamp)}</Text>
            </View>
            <StarRating
                rating={rating}
                starSize={20}
                starStyle={{ marginHorizontal: 1 }}
                enableSwiping={false}
                onChange={() => {}}
                animationConfig={{ scale: 1 }}
            />
            <Text style={styles.text}>{text}</Text>
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