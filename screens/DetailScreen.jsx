import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { updateDoc, addDoc, collection, onSnapshot, query, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../authService';
import StarRating from 'react-native-star-rating-widget';
import ReviewDisplayBox from '../components/ReviewDisplayBox';

export default function DetailScreen({ route, navigation }) {
    const { place } = route.params;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedback, setFeedback] = useState([]);


    // Fetch real-time feedback
    useEffect(() => {
        //const unsubscribe = db.collection('establishments').doc(place.id)
        const q = query(collection(db, 'establishments', place.id, 'feedback'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const feedbackData = querySnapshot.docs.map(doc => doc.data());
            setFeedback(feedbackData);
        });

        return () => unsubscribe();
    }, [place.id]);


    // Handle check-in and feedback submission
     const submitFeedback = async () => {
        //if (!auth.currentUser) {
        //  alert('Please log in to submit feedback.');
        //  return;
        //}

        // Store feedback in establishments collection 
        const feedbackRef = collection(db, 'establishments', place.id, 'feedback');
        await addDoc(feedbackRef, {
            displayName: auth.currentUser.displayName,
            userId: auth.currentUser.uid,
            rating: parseFloat(rating),
            comment,
            timestamp: new Date(),
        });


        // Store feedback in user collection
        const usersFeedbackRef = collection(db, 'Users', auth.currentUser.uid , 'Reviews');
        await addDoc(usersFeedbackRef, {
            establishmentName: place.name,
            rating: parseFloat(rating),
            comment,
            timestamp: new Date(),
            establishmentId: place.id
        });


        //Update establshemnts rating
        const placeRef = doc(db, 'establishments', place.id);
        await updateDoc(placeRef, {
            rating: place.rating + parseFloat(rating),
            ratingCount: place.ratingCount + 1
        });


        //Update user review count
        const usersRef = collection(db, 'Users', auth.currentUser.uid);
        await updateDoc(usersRef, {
            reviewCount: increment(1)
        }); 

        setRating('');
        setComment('');

    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{place.name}</Text>
            <Text>Average Rating: {place.rating ? (place.rating / place.ratingCount).toFixed(1) : 'N/A'}</Text>
            <StarRating
                rating={rating}
                onChange={setRating}
            />
            <TextInput
                placeholder="Comment"
                value={comment}
                onChangeText={setComment}
                style={styles.input}
            />
            <Button title="Check-In & Submit" onPress={submitFeedback} />
            <Text style={styles.subtitle}>Live Feedback:</Text>
            {feedback.map((item, index) => (
                <View key={index}>
                    <ReviewDisplayBox
                        text={item.comment}
                        username={item.displayName}
                        timestamp={item.timestamp}
                        rating={item.rating}
                        establishmentId={item.establishmentId}
                        userId={item.userId}
                        navigation={navigation}
                    />
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginTop: 10 },
  input: { borderWidth: 1, padding: 5, marginVertical: 5 },
});