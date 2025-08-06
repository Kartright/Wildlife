import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { collection, onSnapshot, orderBy, query, doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../authService';
import ReviewDisplayBox from '../components/ReviewDisplayBox'; 

export default function UserDetailsScreen({ route, navigation }) {
    const { usrId } = route.params;
    const [reviews, setReviews] = useState([]);
    const [userInfo, setUserInfo] = useState([]); 
	const [image, setImage] = useState(null);

    
    // Fetch user's most recent reviews and their username
    useEffect(() => {
        const q = query(collection(db, 'Users', usrId, 'Reviews'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ReviewsData = querySnapshot.docs.map(doc => doc.data());
            setReviews(ReviewsData);
        });

        
        const getUserInfo = async () => {
            try {
                const userInfoRef = doc(db, 'Users', usrId);
                const userDoc = await getDoc(userInfoRef);
                if (userDoc.exists()) {
                    setUserInfo(userDoc.data());
                } else {
                    console.log('No such user!');
                }
            } catch (error) {
                console.error('Error getting user info:', error);
            }
        };

        getUserInfo()

        return () => unsubscribe();
    }, [usrId]);

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Username: {userInfo.displayName}</Text>
            <Text style={styles.subtitle}>Reviews:</Text>
			<ScrollView style={{ flexGrow: 1 }}>
            	{reviews.map((item, index) => (
                	<View key={index}>
						<Text>
                    	{item.establishmentName}:
                		</Text>
						<ReviewDisplayBox
							text={item.comment}
							username={auth.currentUser.displayName}
							timestamp={item.timestamp}
							rating={item.rating}
							establishmentId={item.establishmentId}
							userId={usrId}
							navigation={navigation}
						/>
					</View>
            ))}
			</ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    subtitle: { fontSize: 18, marginTop: 10 },
    input: { borderWidth: 1, padding: 5, marginVertical: 5 },
	image: { width: 200, height: 200, },
});
