import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Auth: undefined; // Auth screen doesn't take parameters
  Dashboard: {
    user: {
      name: AppleAuthentication.AppleAuthenticationFullName | null;
      email: string | null;
      userId: string;
    };
  };
};

// Props for screens
export type DashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
