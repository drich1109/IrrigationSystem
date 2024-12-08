import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { getUserDetails, updatePassword } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileDto } from './type';
import { Path, Svg } from 'react-native-svg';
import BackIcon from '../assets/svg/BackIcon';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC<Props> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async () => {
    setIsSubmit(true);
    setLoadingMessage("Please wait...");
    if (newPassword === confirmPassword) {
      const userID = await AsyncStorage.getItem('userID');
      const userResult = await getUserDetails(Number(userID));
      setUserDetails(userResult.data);
      if (validatePassword(newPassword) && userResult.data.email) {
        const result = await updatePassword(userResult.data.email, newPassword, currentPassword);
        if (result.isSuccess) {
          navigation.navigate('LogIn');
        } else {
          Alert.alert('Update Password Failed');
        }
      } else {
        Alert.alert('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      }
    } else {
      Alert.alert('Passwords do not match');
    }
    setIsSubmit(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover items-center justify-center">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
        </View>
        <View className='flex items-center justify-center w-full'>
          <Text className="text-white text-2xl font-bold mb-6">Change Password</Text>
          <TextInput
            className="w-4/5 border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="Current Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <TextInput
            className="w-4/5 border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="New Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={(text) => {
              setNewPassword(text);
              setIsPasswordValid(validatePassword(text));
            }}
            value={newPassword}
          />
          <TextInput
            className="w-4/5 border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />

          <TouchableOpacity className="p-2 rounded-xl items-center w-[80%]" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={handleSubmit}>
            <Text className="text-white font-black text-lg">Submit</Text>
          </TouchableOpacity>

          {!isPasswordValid && (
            <Text className="text-red-500 mt-4 text-center">
              Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
            </Text>
          )}
        </View>
        <LoaderModal isVisible={isSubmit} message={loadingMessage} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ChangePassword;
