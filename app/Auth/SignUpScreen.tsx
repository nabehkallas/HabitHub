import { Image } from 'expo-image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

// 1. Import 'db' and Firestore methods
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const SignUpScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step A: Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step B: Create the user document in Firestore
      // We use user.uid as the document ID so they are linked
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(), // Best practice for portfolio projects
        currency: "USD",
        monthlyGoal: 0,
        totalSpent: 0
      });

      console.log("User and Profile created successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/images/HabitHub_Logo.png')}
          contentFit="cover"
        />
        
        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          textColor="black"
          style={styles.input}
          placeholder="Display Name"
          value={displayName}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setDisplayName}
          autoCapitalize="none"
          theme={{ colors: { primary: Colors.light.primary } }}
        />

        <TextInput
          textColor="black"
          style={styles.input}
          placeholder="Email"
          value={email}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          theme={{ colors: { primary: Colors.light.primary } }}
        />

        <TextInput
          textColor="black"
          style={styles.input}
          placeholder="Password"
          value={password}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setPassword}
          secureTextEntry
          theme={{ colors: { primary: Colors.light.primary } }}
        />

        <Button
          style={styles.button}
          labelStyle={styles.buttonLabel}
          mode="contained"
          onPress={handleSignUp}
          loading={loading} // Show spinner on the button
          disabled={loading}
          buttonColor={Colors.light.primary}>
          Sign Up
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

// ... keep your styles as they are

const styles = StyleSheet.create({
   image: {
      ...Platform.select({
        web: {
          top: -50,
          flex: 0.8,
          width: '40%',
        },
        default: {
          top: -50,
          flex: 0.4,
          width: '100%',
        },
      }),
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#FFFFFF',
    },
    button: {
      width: '40%',
      marginTop: 20,
      paddingVertical: 4,
    },
    buttonLabel: {
      fontSize: 14,
      color: 'white',
    },
    input: {
      width: '100%',
      marginBottom: 10,
      backgroundColor: '#FFFFFF',
    },
    error: {
      color: '#D32F2F',
      marginBottom: 10,
    },
});

export default SignUpScreen;
