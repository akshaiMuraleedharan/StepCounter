import React, { useContext } from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export const AppleSignInButton: React.FC = () => {
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      setUser({
        userId: credential.user,
        email: credential.email ?? undefined,
        name: credential.fullName ? {
          givenName: credential.fullName.givenName ?? undefined,
          familyName: credential.fullName.familyName ?? undefined,
        } : undefined,
      });

      navigation.navigate('Dashboard');
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
