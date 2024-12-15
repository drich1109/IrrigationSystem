import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import HomeIcon from '../assets/svg/HomeIcon';

type Props = StackScreenProps<RootStackParamList, 'History'>;

const History: React.FC<Props> = ({ navigation }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistoryLogs = async () => {
      try {
        const snapshot = await firestore()
          .collection('WaterLogs')
          .orderBy('date', 'desc') // Order logs by date in descending order
          .get();

        const fetchedLogs = snapshot.docs.map((doc) => ({
          id: doc.id,
          date: new Date(doc.data().date.seconds * 1000).toLocaleString(), // Convert Firestore timestamp
          humLevel: doc.data().humLevel,
          tempLevel: doc.data().tempLevel,
          moistLevel: doc.data().moistLevel,
          method: doc.data().method
        }));
        setLogs(fetchedLogs);
      } catch (error) {
        console.error('Error fetching history logs:', error);
      }
    };

    fetchHistoryLogs();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#031527]">
      {/* Top Navigation */}
      <View className="absolute top-10 w-full px-5 flex-row justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HomeIcon className="h-6 w-6 text-white" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View className="px-6">
        <View className="items-center mt-16">
          <Text className="text-white text-2xl font-bold">History Logs</Text>
        </View>

      </View>
      {/* History Logs Section */}
      <ScrollView className="mt-6 px-6" style={{ maxHeight: 700 }} showsVerticalScrollIndicator={false}>
        {logs.map((log) => (
          <View key={log.id} className="mb-6">
            {/* Single History Item */}
            <View className="justify-between flex-row">
              <View className="flex-row items-center space-x-2">
                <Text className="text-white text-base font-bold">Method:</Text>
                <Text className="text-white text-base">{log.method}</Text>
              </View>
              <Text className="text-white text-base">{log.date}</Text>
            </View>
            <View className="mt-4 flex-row items-center justify-center space-x-8">
              <View className="items-center">
                <Text className="text-white text-lg font-bold">Moisture</Text>
                <Text className="text-white text-lg font-semibold">
                  {log.moistLevel}%
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-lg font-bold">Humidity</Text>
                <Text className="text-white text-lg font-semibold">
                  {log.humLevel}%
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-lg font-bold">Temperature</Text>
                <Text className="text-white text-lg font-semibold">
                  {log.tempLevel}°C
                </Text>
              </View>
            </View>
            {/* Border for multiple logs */}
            <View className="border-b-[1px] mx-1 border-white mt-8"></View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
