import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../authService';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import ReviewDisplayBox from '../components/ReviewDisplayBox'; 

export default function ProfileScreen({ route, navigation }) {
    const { usrId } = route.params;
    const [reviews, setReviews] = useState([]);
	const [image, setImage] = useState(null);
    console.log(usrId);

    // Fetch user's most recent reviews
    useEffect(() => {
        const q = query(collection(db, 'Reviews_By_User_ID', usrId, 'Reviews'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ReviewsData = querySnapshot.docs.map(doc => doc.data());
            setReviews(ReviewsData);
        });

        return () => unsubscribe();
    }, [usrId]);

	const pickImage = async () => {

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		
		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);
			uploadImageToFirebase(result.assets[0].uri);
		}
	};

	const uploadImageToFirebase = async (uri) => {
		console.log("attempt upload");
		try{
		const response = await fetch(uri);
		const blob = await response.blob();
		
		const imageRef = ref(storage, `profilePictures/${auth.currentUser.uid}.jpg`);
		
		await uploadBytes(imageRef, blob);
		const downloadURL = await getDownloadURL(imageRef);
		
		await updateProfile(auth.currentUser, {
			photoURL: downloadURL,
		});
		} catch (error) {
			console.log(error)
		}
		console.log('Uploaded!')
	}

    return (
        <View style={styles.container}>
			<Button title="Change profile picture" onPress={pickImage} />
            <Text style={styles.subtitle}>Username: {auth.currentUser.displayName}</Text>
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
