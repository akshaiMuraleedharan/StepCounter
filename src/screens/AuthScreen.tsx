import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { AppleSignInButton } from '../components/AppleSignInButton';

export const AuthScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <GoogleSignInButton />
      <AppleSignInButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
