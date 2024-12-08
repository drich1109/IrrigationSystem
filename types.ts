// types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserDto } from './src/routes/type';
import { UseHandlerContext } from 'react-native-reanimated';

export type RootStackParamList = {
  Home: undefined;
  LogIn: undefined;
  Register:undefined;
  Languages: { userDto?: UserDto };
  Dashboard:undefined;
  Shop:{selectedItemDefault:string};
  Dictionary:undefined;
  DictionaryMeaning:{contentId:number};
  Practice:undefined;
  ForgotPassword:undefined;
  SetNewPassword:{email:string};
  UserProfile:undefined;
  Settings:undefined;
  EditProfile:undefined;
  ChangePassword:undefined;
  Unit:{sectionId:number, sectionName:string};
  UnitContent: {unitId:number, sectionId:number,  sectionName:string};
  Leaderboard:undefined;
  AllTimeLeaderboard:undefined;
  History: {contentId:number};
  ChangeLanguage:  undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type LanguagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Languages'>;
export type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
export type ShopScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'Shop'>;
export type PracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Practice'>;
export type DictionaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dictionary'>;
export type DictionaryMeaningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DictionaryMeaning'>;
export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
export type SetNewPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SetNewPassword'>;
export type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
export type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;
export type UnitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Unit'>;
export type UnitContentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UnitContent'>;
export type LeaderboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Leaderboard'>;
export type AllTimeLeaderboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllTimeLeaderboard'>;
export type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;
export type ChageLanguageScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChangeLanguage'>;

export type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;




