import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { CoinBag } from './type';
import { buyCoinBag, getCoinBags, getUserVCoin, paymongoRedirect, poolCoinBag } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type CoinBagProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Currency: React.FC<CoinBagProps> = ({ vCoin, setVcoin }) => {
  const [coinBags, setCoinBags] = useState<CoinBag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBag, setSelectedBag] = useState<CoinBag | null>(null);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");


  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const result = await getCoinBags();
        setCoinBags(result.data);

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

  const handleOpenModal = (c: CoinBag) => {
    setSelectedBag(c);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedBag) {
      setIsBuying(true);
      setLoadingMessage("Please wait...");
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        try {
          const result = await paymongoRedirect(selectedBag.moneyPrice, selectedBag.coinBagName);
          if (result.url) {
            setModalVisible(false);
            setLoading(true)
            setLoadingMessage("Please wait...")
            const maxPollingTime = setTimeout(() => {
              clearInterval(pollInterval);
              setError('Polling timed out. Please try again.');
            }, 100000);


            const pollInterval = setInterval(async () => {
              const poolResult = await poolCoinBag(Number(userID), vCoin);

              if (poolResult.data === true) {
                clearInterval(pollInterval);
                clearTimeout(maxPollingTime);
                setVcoin((prev) => prev + selectedBag.quantity);
                Alert.alert(
                  "Congratulations",
                  "Purchase Succesful!",
                  [{ text: "OK" }]
                );
              }
            }, 1000);
          } else {
            setError('Failed to initiate payment');
          }
        } catch (err) {
          setError('Payment failed');
        }
        finally{
          setIsBuying(false);
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
    <View className="flex flex-row gap-16 items-center p-[66px] mb-24">
      {coinBags.map((bag, index) => (
        <View key={index} className="items-center">
          <View className="justify-center items-center">
            <Image source={require('../assets/Vcoin.png')} className="w-56 h-56 mb-4" />
            <Text className="text-2xl text-white font-black">{bag.coinBagName}</Text>
            <Text className="text-2xl text-white font-bold mb-4">{bag.quantity}</Text>
          </View>
          <TouchableOpacity onPress={() => handleOpenModal(bag)}>
            <LinearGradient colors={['#F8F6F4', '#8399A2']} className="rounded-xl py-3 px-4">
              <Text className="text-lg font-black text-white">₱ {bag.moneyPrice}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>))}

      {selectedBag && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-2xl w-[80%]">
              <Text className="text-xl text-black font-black mb-4">Purchase {selectedBag.coinBagName}</Text>
              <View className="flex-row items-center gap-x-2 mb-4">
              <Text className="text-lg text-black font-bold">Quantity:</Text>
              <Text className="text-lg text-black"> {selectedBag.quantity} VCoins</Text>
              </View>

              <View className="flex-row items-center gap-x-2 mb-4">
              <Text className="text-lg text-black font-bold">Total Price:</Text>
              <Text className="text-lg text-black">₱ {selectedBag.moneyPrice}</Text>
              </View>

              <View className="flex-row gap-2 items-center">
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
    <LoaderModal isVisible={isBuying} message={loadingMessage} />
    </View>
  );
};

export default Currency;
