import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Alert, Image, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserDetails } from './repo';
import { UserProfileDto } from './type';
import BackIcon from '../assets/svg/BackIcon';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../components/Loader';
import { LineChart } from 'react-native-chart-kit';
import EditIcon from '../assets/svg/EditIcon';
import ProfileIcon from '../assets/svg/ProfileIcon';

type Props = StackScreenProps<RootStackParamList, 'UserProfile'>;
const screenWidth = Dimensions.get('window').width;
const fixedWith = screenWidth - (screenWidth / 10);

const UserProfile: React.FC<Props> = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        const result = await getUserDetails(Number(userID));
        setUserDetails(result.data);
        if (result.data.imagePath) {
          setFileUrl(result.data.imagePath);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error retrieving user data:', error);
      Alert.alert('An error occurred while fetching user details.');
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', fetchUserData);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <Loader isVisible={loading}/>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      {userDetails && (
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover">
        <View className="flex-1">
          <View className="flex-row justify-between w-full px-5 absolute top-10">
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
              <BackIcon className="h-8 w-8 text-white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <EditIcon className="h-6 w-6 text-white" />
            </TouchableOpacity>
          </View>
          
            <View className="items-center gap-4 mt-24">
              {fileUrl ? (
                <Image
                  source={{ uri: fileUrl }}
                  className="w-32 h-32 rounded-full mb-5 border-4 border-yellow-300" 
                  style={{ 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 2 }, 
                    shadowOpacity: 0.25, 
                    shadowRadius: 3.5, 
                  }} 
                />
              ) : (
                <ProfileIcon className="mb-5 text-white w-32 h-32" />
              )}
              <View className="items-center mb-5"> 
                <Text className="text-white text-2xl font-bold text-center">{userDetails.name}</Text>
                <Text className="text-white text-base text-center w-[90%]">{userDetails.email}</Text>
              </View>
            </View>

            {userDetails.isSubscribed ? 
    (      
        <View style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: [{ translateX: -95 }, { translateY: -20 }], 
            zIndex: 10  
        }}>
            <TouchableOpacity 
                style={{
                    backgroundColor: 'white',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 50,
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 3 }, 
                    shadowOpacity: 0.3, 
                    shadowRadius: 5,     
                    elevation: 5, 
                }}
                onPress={() => navigation.navigate('Shop', { selectedItemDefault: 'Subscription' })}
            >
                <Text className="text-[#f7c188] text-sm text-center">
                    {`Subscribed until ${userDetails.expirationDate ? new Date(userDetails.expirationDate).toLocaleDateString() : ""}`}
                </Text>
            </TouchableOpacity>
        </View>
    ) :
    (
        <View style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: [{ translateX: -60 }, { translateY: -20 }], 
            zIndex: 10  
        }}>
            <TouchableOpacity 
                style={{
                    backgroundColor: 'white',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderRadius: 50,
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 3 }, 
                    shadowOpacity: 0.3, 
                    shadowRadius: 5,     
                    elevation: 5, 
                }}
                onPress={() => navigation.navigate('Shop', { selectedItemDefault: 'Subscription' })}
            >
                <Text className="text-[#f7c188] font-bold text-lg text-center">
                    Subscribe
                </Text>
            </TouchableOpacity>
        </View>
    )
}


        <View className="flex-1 bg-white rounded-t-lg mt-10">
          <View className="flex-row justify-center items-center gap-5 mt-6">
            <View className="items-center bg-gray-300 p-2 rounded-xl">
              <Text className="text-[#f7c188] text-center font-bold text-2xl">{userDetails.unitsUnlocked || 0}</Text>
              <Text className="text-gray-500 text-xs font-bold w-4/5 text-center">Units Unlocked</Text>
            </View>

            <View className=" items-center bg-gray-300 p-2 rounded-xl">
            <Text className="text-[#f7c188] text-center font-bold text-2xl">{userDetails.totalScoreWeekly || 0}</Text>
            <Text className="text-gray-500 text-xs font-bold w-4/5 text-center">Total Weekly Score</Text>
            </View>

            <View className=" items-center bg-gray-300 p-2 rounded-xl">
            <Text className="text-[#f7c188] text-center font-bold text-2xl">{userDetails.highestScore || 0}</Text>
            <Text className="text-gray-500 text-xs font-bold w-4/5 text-center">High Score</Text>
            </View>
          </View>

          <ScrollView horizontal={true} className='ml-4 mt-2'>
              <LineChart
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  datasets: [
                    {
                      data: [
                        userDetails.weeklyScoreGraph["Monday"] || 0,
                        userDetails.weeklyScoreGraph["Tuesday"] || 0,
                        userDetails.weeklyScoreGraph["Wednesday"] || 0,
                        userDetails.weeklyScoreGraph["Thursday"] || 0,
                        userDetails.weeklyScoreGraph["Friday"] || 0,
                        userDetails.weeklyScoreGraph["Saturday"] || 0,
                        userDetails.weeklyScoreGraph["Sunday"] || 0,
                      ]
                    }
                  ]
                }}
                width={fixedWith} // from Dimensions
                height={250}
                yAxisLabel=""
                yAxisSuffix="pts"
                chartConfig={{
                  backgroundColor: "#f7c188",
                  backgroundGradientFrom: "#f7c188",
                  backgroundGradientTo: "#6addd0",
                  decimalPlaces: 0, 
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </ScrollView>


          </View>
        </View>
      </LinearGradient>
                )}

    </SafeAreaView>
  );
};

export default UserProfile;
