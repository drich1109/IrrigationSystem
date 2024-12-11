// types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  History:undefined;
  Setting:undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;
export type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;

export type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;




