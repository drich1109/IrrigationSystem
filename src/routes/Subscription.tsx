import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { SubscriptionDto, UserProfileDto } from './type';
import { buySubscription, getSubscriptions, getUserDetails, getUserVCoin, paymongoRedirect, poolSubscription } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import CheckIcon from '../assets/svg/CheckIcon';
import LoaderModal from '../components/LoaderModal';

type SusbcriptionProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Subscription: React.FC<SusbcriptionProps> = ({ vCoin, setVcoin }) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedSubcription, setSelectedSubscription] = useState<SubscriptionDto | null>(null);
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [socket, setSocket] = useState<any>(null);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await getSubscriptions();
        setSubscriptions(result.data);

        const userID = await AsyncStorage.getItem('userID');

        if (userID) {
          const result = await getUserVCoin(userID);
          if (result.isSuccess) {
            setVcoin(result.data);
          } else {
            setError('Failed to fetch vCoin');
          }
        }
      } catch (err) {
        setError('Failed to fetch power-ups');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleOpenModal = (s: SubscriptionDto) => {
    setSelectedSubscription(s);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedSubcription) {
      setIsBuying(true);
      setLoadingMessage("Please wait...");
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        try {
          const result = await paymongoRedirect(selectedSubcription.price, selectedSubcription.subscriptionName);
          if (result.url) {
            Linking.openURL(result.url);
            setModalVisible(false);
            setLoading(true)
            setLoadingMessage("Please wait...")
            const maxPollingTime = setTimeout(() => {
              clearInterval(pollInterval);
              setError('Polling timed out. Please try again.');
            }, 100000);


            const pollInterval = setInterval(async () => {
              const poolResult = await poolSubscription(Number(userID));

              if (poolResult.data === true) {

                await buySubscription(userID, selectedSubcription.id);
                clearInterval(pollInterval);
                clearTimeout(maxPollingTime);
                Alert.alert(
                  "Congratulations",
                  "You are now a subscriber!",
                  [{ text: "OK" }]
                );
              }
            }, 1000);
          } else {
            setError('Failed to initiate payment');
          }
        } catch (err) {
          setError('Payment failed');
        } finally {
          setIsBuying(false)
        }
      }
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View className="flex flex-row gap-24 items-center p-[26px] mb-24">
      {subscriptions.map((subscription, index) => (
        <View key={index} className="items-center">
          <View className="items-center justify-center rounded-3xl p-6 mb-4 bg-gray-400">
            <Text className="text-lg font-black text-white w-32 text-center">{subscription.subscriptionName}</Text>
            <Text className="text-white font-black text-2xl text-center mt-2">₱ {subscription.price}</Text>
            <View className="border-b-2 border-white mx-2 px-12 mt-2 mb-2"></View>
            <View className="relative justify-center space-y-2 mt-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-white p-1 rounded-full">
                  <CheckIcon className="text-gray-400 h-4 w-4" />
                </View>
                <Text className="text-white text-base font-bold">Ad Free</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="bg-white p-1 rounded-full">
                  <CheckIcon className="text-gray-400 h-4 w-4" />
                </View>
                <Text className="text-white text-base font-bold">Unlock Premium Section</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <View className="bg-white p-1 rounded-full">
                  <CheckIcon className="text-gray-400 h-4 w-4" />
                </View>
                <Text className="text-white text-base font-bold">Unlimited Pronunciation Practice</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleOpenModal(subscription)}>
              <View className="rounded-xl py-3 px-4 mt-2" style={{
                backgroundColor: 'rgba(240, 240, 240, 0.4)'
              }}>
                <Text className="text-base font-black text-white">Buy</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>))}

      {selectedSubcription && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-2xl w-[80%]">
              <Text className="text-black text-xl font-black mb-4 text-center">Purchase {selectedSubcription.subscriptionName}</Text>

              <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-lg text-black font-bold">Total Price:</Text>
                <Text className="text-lg text-black">₱ {selectedSubcription.price}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleBuy}
                >
                  <LinearGradient
                    className="py-2 px-5 rounded-xl items-center" colors={['#F8F6F4', '#8399A2']}>
                    <Text className="text-base font-bold text-white">Buy</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                >
                  <LinearGradient
                    className="py-2 px-3 rounded-xl items-center" colors={['#DD816A', '#FF1F1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                    <Text className="text-base font-bold text-white">Cancel</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
};

export default Subscription;
