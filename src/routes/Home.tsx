import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import firestore from '@react-native-firebase/firestore';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { styled } from "nativewind";
import DropsIcon from '../assets/svg/DropsIcon';
import HistoryIcon from '../assets/svg/HistoryIcon';
import DangerIcon from '../assets/svg/DangerIcon';

const StyledView = styled(View);
const StyledText = styled(Text);

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const POLL_INTERVAL = 1000; // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [moistLevel, setMoistLevel] = useState<number | null>(null);
  const [humLevel, setHumLevel] = useState<number | null>(null);
  const [tempLevel, setTempLevel] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [activeWater, setActiveWater] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const currentLevelSnapshot = await firestore()
        .collection('CurrentLevel')
        .orderBy('date', 'desc')
        .limit(1)
        .get();

      if (!currentLevelSnapshot.empty) {
        const data = currentLevelSnapshot.docs[0].data();
        setMoistLevel(data.moistLevel);
        setHumLevel(data.humLevel);
        setTempLevel(data.tempLevel);
        setDate(new Date(data.date.seconds * 1000).toLocaleString());
      }

      // Fetch the latest WaterLogs data for isActive
      const waterLogsSnapshot = await firestore()
        .collection('WaterLogs')
        .orderBy('date', 'desc')
        .limit(1)
        .get();

      if (!waterLogsSnapshot.empty) {
        const waterLogData = waterLogsSnapshot.docs[0].data();
        setActiveWater(waterLogData.isActive);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };


  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  async function pressWater() {
    try {
      if (activeWater == false && tempLevel && humLevel && moistLevel && ((tempLevel <= 31 && humLevel >= 60) || moistLevel >= 40)) {
        Alert.alert(
          'Are you sure?',
          'Are you sure you want to start/stop irrigating?',
          [
            {
              text: 'No',
              onPress: () => {
                console.log('Irrigation canceled');
                return;
              },
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: async () => {
                // Move the irrigation logic here
                const newActiveState = !activeWater; // Toggle the state
                setActiveWater(newActiveState);

                const now = firestore.Timestamp.now();
                await firestore().collection('WaterLogs').add({
                  isActive: newActiveState,
                  date: now,
                  moistLevel: moistLevel || 0,
                  humLevel: humLevel || 0,
                  tempLevel: tempLevel || 0,
                  method: 'Manual',
                });

                console.log('Water action logged successfully with levels');
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        const newActiveState = !activeWater; // Toggle the state
        setActiveWater(newActiveState);

        const now = firestore.Timestamp.now();
        await firestore().collection('WaterLogs').add({
          isActive: newActiveState,
          date: now,
          moistLevel: moistLevel || 0,
          humLevel: humLevel || 0,
          tempLevel: tempLevel || 0,
          method: 'Manual',
        });

        console.log('Water action logged successfully with levels');
      }
    } catch (error) {
      console.error('Error logging water action: ', error);
    }
  }


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
                  <StyledView className="items-center">
                    {fill <= 40 && <DangerIcon className="text-red-400 h-4 w-4" />}
                    <StyledText className="text-white text-sm font-bold">

                      {Math.round(fill)}%
                    </StyledText>
                  </StyledView>
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
                  <StyledView className="items-center">
                    {fill <= 60 && <DangerIcon className="text-red-400 h-4 w-4" />}
                    <StyledText className="text-white text-sm font-bold">
                      {Math.round(fill)}%
                    </StyledText>
                  </StyledView>
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
                <StyledView className="items-center">
                  {fill >= 32 && <DangerIcon className="text-red-400 h-6 w-6" />}
                  <StyledText className="text-white text-xl font-bold">
                    {Math.round(fill)}°
                  </StyledText>
                </StyledView>
              )}
            </AnimatedCircularProgress>
            <StyledText className="text-white text-lg mt-2">Temperature</StyledText>
          </StyledView>

          <TouchableOpacity
            className="items-center mt-6 py-5 px-7 rounded-full"
            style={{ backgroundColor: 'rgba(22, 185, 255, 0.3)' }}
            onPress={() => {
              pressWater();
            }}
          >
            <DropsIcon
              className={`w-8 h-8 ${activeWater ? 'text-red-400' : 'text-white'}`}
            />
            <Text className="text-base text-white font-bold">Water</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
