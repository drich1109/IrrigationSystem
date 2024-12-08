/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Modal, StyleSheet, Alert, TextInput, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addrating, deactivateVistaAccount, sendFeedback, sendReport } from './repo'; // Ensure sendFeedback is imported from the repo
import { Path, Svg } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import BackIcon from '../assets/svg/BackIcon';
import Menu from '../components/Menu';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [reportText, setReportText] = useState('');
  const [isRateModalVisible, setIsRateModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [activeScreen] = useState<keyof RootStackParamList | null>('Settings');

  const handleDeactivateAccount = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDeactivate = async () => {
    setIsModalVisible(false);
    const userID = await AsyncStorage.getItem('userID');
    const result = await deactivateVistaAccount(Number(userID));
    if (result.isSuccess) {
      Alert.alert('Account Deactivated', 'Your account has been deactivated successfully.');
      await handleSignOut();
    } else {
      Alert.alert(result.message);
    }
  };

  const handleCancelDeactivate = () => {
    setIsSubmit(true);
    setLoadingMessage("Please wait...");
    setIsModalVisible(false);
    setIsSubmit(false);
  };

  const handleSignOut = async () => {
    try {
      setIsRateModalVisible(true);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const handleSendFeedback = async () => {
    setIsSubmit(true);
    setLoadingMessage("Please wait...");
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter feedback before sending.');
      return;
    }
    try {
      const userID = await AsyncStorage.getItem('userID');
      const result = await sendFeedback(Number(userID), feedbackText);
      if (result.isSuccess) {
        Alert.alert('Feedback Sent', 'Your feedback has been sent successfully.');
        setFeedbackText('');
        setIsFeedbackModalVisible(false);
      } else {
        Alert.alert(result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback.');
    }finally{
      setIsSubmit(false);
    }
  };

  const handleCancelFeedback = () => {
    setIsFeedbackModalVisible(false);
  };

  const handleSendReport = async () => {
    setIsSubmit(true);
    setLoadingMessage("Please wait...");
    if (!reportText.trim()) {
      Alert.alert('Error', 'Please enter a report before sending.');
      return;
    }
    try {
      const userID = await AsyncStorage.getItem('userID');
      const result = await sendReport(Number(userID), reportText); // Assuming you use the same sendFeedback API for reports.
      if (result.isSuccess) {
        Alert.alert('Report Sent', 'Your report has been sent successfully.');
        setReportText('');
        setIsReportModalVisible(false);
      } else {
        Alert.alert(result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send report.');
    }finally{
      setIsSubmit(false);
    }
  };

  const handleCancelReport = () => {
    setIsReportModalVisible(false);
  };

  const handleSubmitRating = async () => {
    const userID = await AsyncStorage.getItem('userID');
    await addrating(Number(userID), rating);
    await AsyncStorage.removeItem('userID');
    await AsyncStorage.removeItem('userToken');
    setIsRateModalVisible(false);
    navigation.navigate('Home');
  };


  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
          <Text style={{ fontSize: 40, color: index < rating ? '#ffd700' : '#ccc' }}>
            {index < rating ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover">
        <View className="flex-row justify-between w-full px-5 absolute top-10">
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon className="h-8 w-8 text-white" />
          </TouchableOpacity> */}
        </View>
        <View className="flex-1 items-center justify-center space-y-4">
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={() => navigation.navigate("ChangePassword")}>
            <Text className="text-white text-center text-lg font-black">Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={handleDeactivateAccount}>
            <Text className="text-white text-center text-lg font-black">Deactivate Account</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={() => setIsFeedbackModalVisible(true)}>
            <Text className="text-white text-center text-lg font-black">Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={() => setIsReportModalVisible(true)}>
            <Text className="text-white text-center text-lg font-black">Send Report</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)' 
          }} onPress = {() => navigation.navigate("ChangeLanguage")}>
            <Text className="text-white text-center text-lg font-black">Change Language</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-4/5 p-3 bg-white rounded-xl" style={{
            backgroundColor: 'rgba(240, 240, 240, 0.4)'
          }} onPress={handleSignOut}>
            <Text className="text-white text-center text-lg font-black">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Confirmation Modal */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
        >
          <View className="flex-1 items-center justify-center bg-[#00000080]">
            <View className="bg-white p-6 w-[80%] rounded-xl items-center">
              <Text className="text-xl font-black text-black mb-3">Deactivate Account</Text>
              <Text className="text-base text-black mb-4 text-center">Are you sure you want to deactivate your account?</Text>
              <View className="flex-row justify-center items-center w-[100%] gap-x-4">
                <TouchableOpacity onPress={handleConfirmDeactivate}>
                  <LinearGradient
                    className="py-2 px-4 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text className="text-base font-bold text-white">Yes</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelDeactivate}>
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

        <Modal
          transparent={true}
          visible={isFeedbackModalVisible}
          animationType="slide"
        >
          <View className="flex-1 items-center justify-center bg-[#00000080]">
            <View className="bg-white p-6 w-[80%] rounded-xl items-center">
              <Text className="text-xl text-black font-black mb-3">Send Feedback</Text>
              <TextInput
                className="w-[100%] h-36 border border-gray-500 text-black rounded-md border-1 p-5 mb-4"
                multiline
                numberOfLines={4}
                placeholder="Enter your feedback here..."
                placeholderTextColor="#a9a9a9"
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <View className="flex-row items-center justify-center gap-x-4">
                <TouchableOpacity onPress={handleSendFeedback}>
                  <LinearGradient
                    className="py-2 px-6 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text className="text-base font-bold text-white">Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelFeedback}>
                  <LinearGradient
                    className="py-2 px-4 rounded-xl items-center" colors={['#DD816A', '#FF1F1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text className="text-base font-bold text-white">Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Report Modal */}
        <Modal
          transparent={true}
          visible={isReportModalVisible}
          animationType="slide"
        >
          <View className="flex-1 items-center justify-center bg-[#00000080]">
            <View className="bg-white p-6 w-[80%] rounded-xl items-center">
              <Text className="text-xl font-black mb-3 text-black">Send Report</Text>
              <TextInput
                className="w-[100%] h-36 border border-gray-500 text-black rounded-md border-1 p-5 mb-4"
                multiline
                numberOfLines={4}
                placeholder="Enter your report here..."
                placeholderTextColor="#a9a9a9"
                value={reportText}
                onChangeText={setReportText}
              />
              <View className="flex-row items-center justify-center gap-x-4">
                <TouchableOpacity onPress={handleSendReport}>
                  <LinearGradient
                    className="py-2 px-6 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text className="text-base font-bold text-white">Send</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelReport}>
                  <LinearGradient
                    className="py-2 px-4 rounded-xl items-center" colors={['#DD816A', '#FF1F1F']}
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
          visible={isRateModalVisible}
          animationType="slide"
        >
          <View className="flex-1 items-center justify-center bg-[#00000080]">
            <View className="bg-white p-6 w-[80%] rounded-xl items-center">
              <Text className="text-xl font-black text-black mb-3">Rate Our Platform</Text>
              <Text className="text-base mb-4 text-center text-black">Please rate your experience with our platform</Text>
              <View className="flex-row mb-4">{renderStars()}</View>
              <TouchableOpacity onPress={handleSubmitRating}>
                <LinearGradient
                  className="py-2 px-6 rounded-xl items-center" colors={['#6addd0', '#f7c188']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-base font-bold text-white">Submit Rating</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <LoaderModal isVisible={isSubmit} message={loadingMessage} />
        <Menu activeScreen={activeScreen} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Settings;
