import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateDoc, addDoc, collection, onSnapshot, query, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth, auth } from '../authService';

export default function ProfileScreen({ route }) {
    const { usrId } = route.params
    const [reviews, setReviews] = useState([]);
    console.log(usrId);
    // Fetch real-time feedback
    useEffect(() => {
    //const unsubscribe = db.collection('establishments').doc(place.id)
    const q = query(collection(db, 'Reviews_By_User_ID', usrId, 'Reviews'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ReviewsData = querySnapshot.docs.map(doc => doc.data());
        setReviews(ReviewsData);
      });

    return () => unsubscribe();
    }, [usrId]);
    
    return (
        <View style={styles.container}>
            <Text styles={styles.subtitle}>Username:</Text>
            <Text styles={styles.subtitle}>Reviews:</Text>
                {reviews.map((item, index) => (
                <Text key={index}>{item.establishmentName}: {item.rating} - {item.comment}</Text>
                ))}
        </View>
      );

}

const styles = StyleSheet.create({
    container: { flex: 1 },
    subtitle: { fontSize: 18, marginTop: 10 },
    input: { borderWidth: 1, padding: 5, marginVertical: 5 },
});