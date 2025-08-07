import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import { collection, onSnapshot, orderBy, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../authService';
import ReviewDisplayBox from '../components/ReviewDisplayBox'; 

export default function UserDetailsScreen({ route, navigation }) {
    const { usrId } = route.params;
    const [reviews, setReviews] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [isFollowing, setIsFollowing] = useState(null); 
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

    // check if following user
    useEffect(() => {
        const checkIfFollowing = async () => {
            const docRef = doc(db, 'Users', auth.currentUser.uid, "Follows", usrId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setIsFollowing(true);
            } else {
                setIsFollowing(false);
            }
        };

        checkIfFollowing();

    }, [usrId])

    // Check if currently signed in user is following the user whose information is currently displayed
    const checkIfFollowing = async () => {
        const docRef = doc(db, 'Users', auth.currentUser.uid, "Follows", usrId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Following");
            return true;
        } else {
            return false;
        }
    }

    // add user to current users following list and add current user to users follower list
    const followUser = async () => {
        const followsRef = doc(db, "Users", auth.currentUser.uid, "Follows", usrId);
        await setDoc(followsRef, {
            userId: usrId,
            timestamp: new Date()
        });

        const followersRef = doc(db, "Users", usrId, "Followers", auth.currentUser.uid);
        await setDoc(followersRef, {
            userId: auth.currentUser.uid,
            timestamp: new Date()
        })

        setIsFollowing(true);
    }

    // remove users from following and follows lists when the current user unfollows the displayed user
    const unFollowUser = async () => {
        try {
            const followsRef = doc(db, "Users", auth.currentUser.uid, "Follows", usrId);
            await deleteDoc(followsRef);

            const followersRef = doc(db, "Users", usrId, "Followers", auth.currentUser.uid);
            await deleteDoc(followersRef);

            setIsFollowing(false);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    return (
        <View style={styles.container}>
            <Button style={{ opacity: isFollowing ? 0.5 : 1 }} title={isFollowing ? "Following" : "Follow"} onPress={isFollowing ? unFollowUser : followUser}/>
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
							username={userInfo.displayName}
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
