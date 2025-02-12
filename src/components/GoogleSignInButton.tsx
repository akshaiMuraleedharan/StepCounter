import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation'; // Adjust the import path as necessary

export const GoogleSignInButton: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  //const navigation = useNavigation();

  useEffect(() => {
    const fetchGoogleUser = async (idToken: string) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const user = await res.json();

        navigation.navigate('Dashboard', {
          user: {
            name: { givenName: user.given_name, familyName: user.family_name },
            email: user.email,
            userId: user.sub,
          },
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch Google user info.');
      }
    };

    if (response?.type === 'success') {
      fetchGoogleUser(response.params.id_token);
    }
  }, [response]);

  return <Button title="Sign in with Google" onPress={() => promptAsync()} />;
};
