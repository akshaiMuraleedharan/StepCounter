import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const GoogleSignInButton: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: '339321272963-k9744954ck40i5t5pjq85omgdb96o8f7.apps.googleusercontent.com',
    androidClientId: '339321272963-v9mo75op60sg3o3b6qbvrbbo4bp7sdnj.apps.googleusercontent.com',
    webClientId: '339321272963-0sgru210ruoebu4iku82bfsjjb6qj0fj.apps.googleusercontent.com',
    scopes: ['openid', 'profile', 'email'],
  });

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const fetchGoogleUser = async () => {
        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${response.authentication?.accessToken}` },
          });

          if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`);
          }

          const user = await res.json();
          console.log('Google User:', user);

          const userData = {
            name: { givenName: user.given_name, familyName: user.family_name },
            email: user.email,
            userId: user.id,
            picture: user.picture,
          };

          navigation.navigate('Dashboard', { user: userData });
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch Google user info.');
          console.error('Google Sign-In Error:', error);
        }
      };

      fetchGoogleUser();
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
};
