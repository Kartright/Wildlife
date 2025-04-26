import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Dropdown, dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { db } from '../firebaseConfig';
import { updateDoc, addDoc, collection, onSnapshot, query, doc } from 'firebase/firestore';

export default function AddLocationScreen({ route, navigation }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const categories = [
    { label: 'Club', value: 'club'},
    { label: 'Restaurant', value: 'restaurant'},
  ];
  const coordinate = route.params.coordinate;

  console.log(route.params);

  // Category selection drop down menu
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === type && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };


  // Add location to firestore database
  const addLocation = async () => {
    const establishmentsRef = collection(db, 'establishments');
    await addDoc(establishmentsRef, {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      name: name,
      rating: 0,
      ratingCount: 0,
      type: type,
    });
  };


  // Check that proper information was given before adding location.
  const handleAddLocation = () => {
    if (type == '') {
      console.log("No Category Selected");
      return;
    } else if (name == '') {
      console.log("No name given");
      return;
    } else {
      addLocation();
      navigation.popToTop();
    };
  };


  return (
    <View style={styles.container}>
      <Text styles={styles.subtitle}>Esablishment Name:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text styles={styles.subtitle}>Category:</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Category"
        searchPlaceholder="Search..."
        value={type}
        onChange={item => {
          setType(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
        renderItem={renderItem}
      />
      <Button title='Add Location' onPress={handleAddLocation}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitle: { fontSize: 18, marginTop: 10 },
  input: { borderWidth: 1, padding: 5, marginVertical: 5 },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});