import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ImageBackground, Image, View, StyleSheet, Modal, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { sendCodetoEmail, verifyCode } from './repo';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleSendCode = async () => {
    if (email) {
      setIsLoading(true);
      setLoadingMessage('Sending Verification Code. Please check your Email.');
      const result = await sendCodetoEmail(email);
      setIsLoading(false);
      if (result.isSuccess == true)
        setIsModalVisible(true);
      else {
        Alert.alert(result.message);
      }
    } else {
      console.warn('Please enter a valid email address.');
    }
  };

  const handleConfirmCode = async () => {
    if (confirmationCode) {
      const result = await verifyCode(email, confirmationCode);
      if (result.isSuccess == true) {
        setIsModalVisible(false);
        navigation.navigate('SetNewPassword', { email });
      }
      else {
        return;
      }
    } else {
      console.warn('Please enter the confirmation code.');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
        <Image source={require('../assets/White.png')} className="w-44 h-44" />

        <Text className="text-white text-4xl font-bold mb-6" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
          Vistalk
        </Text>

        <View className="w-[100%] px-5 items-center">
          <TextInput
            className="w-[90%] h-13 border-2 border-white mb-5 px-2.5 rounded-lg bg-transparent text-white"
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <TouchableOpacity className="w-[90%] rounded-xl items-center p-3 mb-3" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={handleSendCode}>
            <Text className="text-white font-bold text-xl">Send Code</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-3 w-[90%] rounded-xl items-center mb-4" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={() => navigation.navigate('Home')}>
            <Text className="text-white text-xl font-black">Go Back</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for entering confirmation code */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <View className="w-4/5 py-3 px-5 rounded-lg items-center bg-white">
              <Text className="text-xl font-black mb-4 text-black">Enter Confirmation Code</Text>

              <TextInput
                className="w-full h-12 border border-black border-2 mb-4 px-2 rounded-md bg-transparent text-black"
                placeholder="Confirmation Code"
                placeholderTextColor="white"
                onChangeText={setConfirmationCode}
                value={confirmationCode}
                keyboardType="numeric"
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
      </LinearGradient>
      <LoaderModal isVisible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
};

export default ForgotPassword;
