import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { updatePassword } from './repo';
import LinearGradient from 'react-native-linear-gradient';

type Props = StackScreenProps<RootStackParamList, 'SetNewPassword'>;

const SetNewPassword: React.FC<Props> = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validatePassword = (password: string) => {
    // Regular expression to check if password is strong
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async () => {
    if (newPassword === confirmPassword) {
      if (validatePassword(newPassword)) {
        const result = await updatePassword(email, confirmPassword, null)
        if (result.isSuccess == true)
          navigation.navigate('LogIn');
        else {
          Alert.alert("Update Password Failed")
        }
      } else {
        Alert.alert('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      }
    } else {
      Alert.alert('Passwords do not match');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover items-center justify-center">
        <View className="w-[100%] items-center">
          <Text className="text-2xl text-white mb-4 font-black">Set New Password</Text>

          <View className="w-full px-5 items-center">
            <TextInput
              className="w-4/5 h-13 border-2 border-white mb-5 px-2.5 rounded-lg bg-transparent text-white"
              placeholder="New Password"
              placeholderTextColor="white"
              secureTextEntry
              onChangeText={(text) => {
                setNewPassword(text);
                setIsPasswordValid(validatePassword(text));
              }}
              value={newPassword}
            />
            <TextInput
              className="w-4/5 h-13 border-2 border-white mb-5 px-2.5 rounded-lg bg-transparent text-white"
              placeholder="Confirm Password"
              placeholderTextColor="white"
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />

            <TouchableOpacity className="w-4/5 rounded-xl items-center p-3 mb-3" style={{
              backgroundColor: 'rgba(240, 240, 240, 0.4)'
            }} onPress={handleSubmit}>
              <Text className="text-white font-black text-xl">Submit</Text>
            </TouchableOpacity>
          </View>

          {!isPasswordValid && (
            <Text className="text-red-500 text-center mt-2">
              Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
            </Text>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SetNewPassword;
