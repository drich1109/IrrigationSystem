import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ImageBackground, Image, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { loginUser, reActivateVista, sendCodetoEmail, verifyCode } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'LogIn'>;

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Email');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');
  const [resendModal, setResendModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodePlaceHolder, setConfirmationCodePlaceHolder] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);

      if (response.isSuccess === true) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userID', response.data.id);
        await AsyncStorage.setItem('languageId', response.data.languageId);

        navigation.navigate('Dashboard')
      } else {
        if (response.message === 'Inactive') {
          Alert.alert(
            'Login Failed',
            'Do you want to reactivate your account?',
            [
              {
                text: 'No',
                onPress: () => console.log('Reactivation declined'),
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => handleSendCode(email),
              },
            ],
            { cancelable: false }
          );
        }
        else
          Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  async function handleSendCode(email: string) {
    if (email) {
      setResendModal(false);
      setLoadingMessage('Sending Verification Code. Please check your Email.');
      setIsLoading(true);
      const result = await sendCodetoEmail(email);
      setIsLoading(false);
      if (result.isSuccess == true) setIsModalVisible(true);
    } else {
      console.warn('Please enter a valid email address.');
    }
  }

  const handleConfirmCode = async () => {
    if (confirmationCode) {
      setResendModal(false);
      const result = await verifyCode(email, confirmationCode);
      setConfirmationCode('');
      if (result.isSuccess == true) {
        setIsModalVisible(false);
        const result2 = await reActivateVista(email);
        if (result2.isSuccess == true)
          handleLogin();
      } else {
        setResendModal(true);
      }
    } else {
      console.warn('Please enter the confirmation code.');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
        <View className="items-center mb-8">
          <Image source={require('../assets/White.png')} className="w-44 h-44" />
          <Text className="text-white text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
            Vistalk
          </Text>
        </View>
        <TextInput
          className="w-4/5 h-13 border-2 border-white mb-5 px-3 rounded-xl bg-transparent text-white"
          placeholder={emailPlaceholder}
          placeholderTextColor="white"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          onFocus={() => setEmailPlaceholder('')}
          onBlur={() => setEmailPlaceholder('Email')}
        />

        <TextInput
          className="w-4/5 h-13 border-2 border-white mb-5 px-3 rounded-xl bg-transparent text-white"
          placeholder={passwordPlaceholder}
          placeholderTextColor="white"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          onFocus={() => setPasswordPlaceholder('')}
          onBlur={() => setPasswordPlaceholder('Password')}
        />

        <TouchableOpacity className="p-3 w-[80%] rounded-xl items-center mb-4" style={{
          backgroundColor: 'rgba(240, 240, 240, 0.4)'
        }} onPress={handleLogin}>
          <Text className="text-white text-xl font-black">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 w-[80%] rounded-xl items-center mb-4" style={{
          backgroundColor: 'rgba(240, 240, 240, 0.4)'
        }} onPress={() => navigation.navigate('Home')}>
          <Text className="text-white text-xl font-black">Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-4/5 items-end"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className="text-white mt-0 text-right font-bold text-base">Forgot password?</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >

        <View className="flex-1 justify-center items-center bg-[#00000080]">
          <View className="w-4/5 p-5 bg-white rounded-xl items-center">
            <Text className="text-xl font-black mb-4 text-black">Enter Confirmation Code</Text>

            <TextInput
              className="w-full h-12 border border-gray-500 border-2 mb-4 px-2 rounded-md bg-transparent text-black"
              placeholder="Confirmation Code"
              placeholderTextColor="white"
              onChangeText={setConfirmationCode}
              value={confirmationCode}
              keyboardType="numeric"
              onFocus={() => setConfirmationCodePlaceHolder('')}
              onBlur={() => setConfirmationCodePlaceHolder('Confirmation Code')}
            />

            <View className="flex-row items-center justify-center w-[100%] gap-x-2">
              <TouchableOpacity onPress={handleConfirmCode}>
                <LinearGradient
                  className="py-2 px-4 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-base font-bold text-white">Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <LinearGradient className="flex py-2 px-5 rounded-xl items-center" colors={['#DD816A', '#FF1F1F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-base font-bold text-white">Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={resendModal}
        animationType="slide"
        onRequestClose={() => setResendModal(false)}
      >

        <View className="flex-1 justify-center items-center bg-[#00000080]">
          <View className="w-4/5 p-5 rounded-lg items-center">
            <Text className="text-xl font-bold mb-4 text-white">An error occurred while sending the code. Please try resending it.
            </Text>

            <View className="flex-row items-center justify-center w-[100%] gap-2">
              <TouchableOpacity onPress={() => handleSendCode(email)}>
                <LinearGradient
                  className="py-2 px-4 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-base font-bold text-white">Resend</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setResendModal(false)}>
                <LinearGradient
                  className="py-2 px-4 rounded-xl items-center" colors={['#DD816A', '#FF1F1F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-base font-bold text-white">No</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoaderModal isVisible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
};

export default LogIn;