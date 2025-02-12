import React, { useContext } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const AppleSignInButton: React.FC = () => {
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const userData = {
        userId: credential.user,
        email: credential.email ?? 'N/A', // Apple may not return email after first login
        name: credential.fullName
          ? {
              givenName: credential.fullName.givenName ?? 'N/A',
              familyName: credential.fullName.familyName ?? '',
            }
          : { givenName: 'N/A', familyName: '' },
      };

      setUser(userData);

      console.log('Apple Sign-In Success:', userData);
      navigation.navigate('Dashboard', { user: userData }); // Ensure this matches your navigator
    } catch (error) {
      console.error('Apple Sign-In error:', error);
    }
  };

  return Platform.OS === 'ios' ? (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 200, height: 44 }}
      onPress={handleAppleSignIn}
    />
  ) : null;
};
