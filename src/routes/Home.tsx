import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image, BackHandler, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeScreenNavigationProp, RootStackParamList } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { styled } from "nativewind";
import HistoryIcon from '../assets/svg/HistoryIcon';
import NotificationIcon from '../assets/svg/NotificationIcon';
import SettingIcon from '../assets/svg/SettingIcon';
import SettingsIcon from '../assets/svg/SettingsIcon';
import DropsIcon from '../assets/svg/DropsIcon';
import CircleIcon from '../assets/svg/CircleIcon';

const StyledView = styled(View);
const StyledText = styled(Text);

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  /*  const [test, setTest] = useState();
 
   const getData = async () => {
     const testCollection = await firestore().collection('Test').get();
     setTest(testCollection.docs[0].data())
   }
 
   useEffect(() => {
     getData();
   }, []); */
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const day = days[now.getDay()];

      const date = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });

      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      setCurrentDate(`${day}, ${date}`);
      setCurrentTime(time);
    };

    const intervalId = setInterval(updateDateTime, 1000);
    updateDateTime();

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();

  }, []);

  const openNotification = async () => {
    setNotificationVisible(true);
  };

  const closeNotification = async () => {
    setNotificationVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center p-4 bg-[#031527]">
        <View className="absolute top-6 w-full px-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-lg">{currentDate}</Text>
            </View>
            <Text className="text-white text-xl font-bold">{currentTime}</Text>
          </View>
        </View>
        <View className="items-center">
          <StyledView className="flex-row space-x-8">
            <StyledView className="items-center">
              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={35}
                tintColor="#00FF93"
                backgroundColor="#1E293B"
                lineCap="round"
                rotation={0}>
                {(fill) => (
                  <StyledText className="text-white text-sm font-bold">
                    {Math.round(fill)}%
                  </StyledText>
                )}
              </AnimatedCircularProgress>
              <StyledText className="text-white text-lg mt-2">Moisture</StyledText>
            </StyledView>

            <StyledView className="items-center">
              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={45}
                tintColor="#FF6666"
                backgroundColor="#1E293B"
                lineCap="round"
                rotation={0}>
                {(fill) => (
                  <StyledText className="text-white text-sm font-bold">
                    {Math.round(fill)}%
                  </StyledText>
                )}
              </AnimatedCircularProgress>
              <StyledText className="text-white text-lg mt-2">Humidity</StyledText>
            </StyledView>
          </StyledView>

          <StyledView className="items-center mt-8">
            <AnimatedCircularProgress
              size={120}
              width={10}
              fill={69}
              tintColor="#00FFAB"
              backgroundColor="#1E293B"
              lineCap="round"
              rotation={0}>
              {(fill) => (
                <StyledText className="text-white text-xl font-bold">
                  {Math.round(fill)}°
                </StyledText>
              )}
            </AnimatedCircularProgress>
            <StyledText className="text-white text-lg mt-2">Temperature</StyledText>
          </StyledView>
          <View className="flex-row items-center justify-center space-x-2 mt-8">
            <TouchableOpacity className="items-center p-4 rounded-xl" onPress={() => navigateToScreen('History')} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              <HistoryIcon className="text-white h-6 w-6" />
              <Text className="text-base text-white font-bold">History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 rounded-xl" onPress={openNotification} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              <NotificationIcon className="text-white h-6 w-6" />
              <Text className="text-base text-white font-bold">Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 rounded-xl" onPress={() => navigateToScreen('Setting')} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
              <SettingsIcon className="text-white h-6 w-6" />
              <Text className="text-base text-white font-bold">Settings</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="items-center mt-6 py-5 px-7 rounded-full" style={{ backgroundColor: 'rgba(22, 185, 255, 0.3)' }}>
            <DropsIcon className="text-white w-8 h-8" />
            <Text className="text-base text-white font-bold">Water</Text>
          </TouchableOpacity>
        </View>
        {/* <Text className="text-white text-xl">{test}</Text> */}
      </View>

      <Modal
        visible={notificationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeNotification}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
          onPress={closeNotification}
        >
          <View className="flex-1 justify-center items-center bg-opacity-50">
            <TouchableOpacity activeOpacity={1}>
              <View className="bg-[#031527] rounded-2xl py-3 px-6 shadow-lg">
                <Text className="text-white text-2xl text-center">Notifications</Text>
                <View className="mt-4 mb-4">
                  <View className="flex-row items-center space-x-2">
                    <CircleIcon className="text-blue-400 h-4 w-4" />
                    <Text className="text-white text-lg">Watered</Text>
                    <Text className="text-white text-base pl-8">1 Hour Ago</Text>
                  </View>
                </View>
                {/* mo gawas ra anag border if more than one na ang notif */}
                <View className="border-b-[1px] mx-1 border-white"></View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
