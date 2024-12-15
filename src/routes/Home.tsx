import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image, BackHandler, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { styled } from "nativewind";
import HistoryIcon from '../assets/svg/HistoryIcon';
import DropsIcon from '../assets/svg/DropsIcon';

const StyledView = styled(View);
const StyledText = styled(Text);

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [moistLevel, setMoistLevel] = useState<number | null>(null);
  const [humLevel, setHumLevel] = useState<number | null>(null);
  const [tempLevel, setTempLevel] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);

  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestore()
          .collection('CurrentLevel')
          .orderBy('date', 'desc') // Fetch the latest entry
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setMoistLevel(data.moistLevel);
          setHumLevel(data.humLevel);
          setTempLevel(data.tempLevel);
          setDate(new Date(data.date.seconds * 1000).toLocaleString()); // Convert Firestore Timestamp to readable date
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center p-4 bg-[#031527]">
        <View className="absolute top-6 w-full px-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-xl font-bold">{date || 'Loading...'}</Text>
            <TouchableOpacity className="items-center flex-row space-x-2" onPress={() => navigateToScreen('History')}>
              <HistoryIcon className="text-white h-6 w-6" />
              <Text className="text-base text-white font-bold">History</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="items-center">
          <StyledView className="flex-row space-x-8">
            <StyledView className="items-center">
              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={moistLevel || 0}
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
                fill={humLevel || 0}
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
              fill={tempLevel || 0}
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

          <TouchableOpacity 
            className="items-center mt-6 py-5 px-7 rounded-full" 
            style={{ backgroundColor: 'rgba(22, 185, 255, 0.3)' }}
            onPress={async () => {
              try {
                const now = firestore.Timestamp.now();
                await firestore().collection('WaterLogs').add({
                  isActive: true,
                  date: now,
                  moistLevel: moistLevel || 0,
                  humLevel: humLevel || 0,
                  tempLevel: tempLevel || 0,
                  method: 'manual',
                });
                console.log('Water action logged successfully with levels');
              } catch (error) {
                console.error('Error logging water action: ', error);
              }
            }}
          >
            <DropsIcon className="text-white w-8 h-8" />
            <Text className="text-base text-white font-bold">Water</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
