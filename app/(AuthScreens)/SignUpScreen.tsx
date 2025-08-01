import { Image } from 'expo-image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { auth } from '../../firebase'; // Adjust the path to your firebase.ts file



const SignUpScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/images/FlightScopeLogo.png')}
          contentFit="cover"
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TextInput
          textColor="black"
          style={styles.input}
          placeholder="Email"
          value={email}
          placeholderTextColor={Colors.light.placeholder}
          onChangeText={setEmail}
          autoCapitalize="none"
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
          buttonColor={Colors.light.primary}>
          Sign Up
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
      backgroundColor: Colors.light.background,
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
      backgroundColor: Colors.light.background,
    },
    error: {
      color: Colors.light.error,
      marginBottom: 10,
    },
});

export default SignUpScreen;
