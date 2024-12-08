import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { PowerUp, UserPowerUp } from './type';
import { getPowerupImage, getPowerUps, buyPowerUp, getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddIcon from '../assets/svg/AddIcon';
import MinusIcon from '../assets/svg/MinusIcon';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type FileUrl = {
  id: number;
  url: string;
};

type PowerUpsProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
  userPowerUps: UserPowerUp[]
  setUserPowerUp: React.Dispatch<React.SetStateAction<UserPowerUp[]>>;
};

const PowerUps: React.FC<PowerUpsProps> = ({ vCoin, setVcoin, userPowerUps, setUserPowerUp }) => {
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Define gradient colors for different items
  const gradientColors = [
    ['rgba(255, 255, 255, 0.45)', 'rgba(255, 0, 4, 0.45)'],  // Red
    ['rgba(255, 255, 255, 0.45)', 'rgba(0, 187, 255, 0.45)'],  // Blue
    ['rgba(255, 255, 255, 0.45)', 'rgba(0, 128, 128, 0.45)'],  // Teal
    ['rgba(255, 255, 255, 0.45)', 'rgbargba(238, 190, 20, 0.45)'],  // Yellow
    ['rgba(255, 255, 255, 0.45)', 'rgbargba(183, 0, 255, 0.45)']   // Purple
  ];

  useEffect(() => {
    const fetchPowerUps = async () => {
      try {
        const result = await getPowerUps();
        setPowerUps(result.data);

        const imageUrls = await Promise.all(
          result.data.map(async (powerUp: PowerUp) => {
            if (powerUp.isActive) {
              const url = powerUp.filePath;
              return { id: powerUp.itemID, url };
            }
            return null;
          })
        );

        setFileUrls(imageUrls.filter((url) => url !== null) as FileUrl[]);

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

    fetchPowerUps();
  }, []);

  const getImageUrlById = (id: number) => {
    const fileUrl = fileUrls.find((url) => url.id === id);
    return fileUrl ? fileUrl.url : null;
  };

  const handleOpenModal = (powerUp: PowerUp) => {
    setSelectedPowerUp(powerUp);
    setQuantity(1);
    setTotalPrice(powerUp.vcoinPrice);
    setModalVisible(true);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 0 && quantity <= 1) {
      return;
    }

    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + value;

      if (newQuantity >= 1) {
        setTotalPrice(newQuantity * (selectedPowerUp?.vcoinPrice || 0));
        return newQuantity;
      }

      return prevQuantity;
    });
  };

  const handleBuy = async () => {
    if (selectedPowerUp && quantity > 0 && totalPrice <= vCoin) {
      setIsBuying(true); // Start loading
      setLoadingMessage("Please wait...");
      try {
        const userID = await AsyncStorage.getItem('userID');
        if (userID) {
          await buyPowerUp(userID, selectedPowerUp.itemID, quantity);

          setVcoin((prev) => prev - totalPrice);

          setUserPowerUp((prevUserPowerUps) => {
            const updatedPowerUps = [...prevUserPowerUps];
            const powerUpIndex = updatedPowerUps.findIndex(
              (powerUp) => powerUp.itemId === selectedPowerUp.itemID
            );

            if (powerUpIndex !== -1) {
              // Update the quantity of the existing power-up
              updatedPowerUps[powerUpIndex].quantity += quantity;
            } else {
              // Add the new power-up to the list
              updatedPowerUps.push({
                itemId: selectedPowerUp.itemID,
                name: selectedPowerUp.name,
                quantity: quantity,
                filePath: selectedPowerUp.filePath,
                userPlayerId: Number(userID),
                description: selectedPowerUp.description
              });
            }

            return updatedPowerUps;
          });

          setModalVisible(false);
        }
      } catch (error) {
        console.error('Error buying power-up:', error);
      } finally {
        setIsBuying(false);
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
    <View className="flex flex-row gap-16 items-center p-[50px] mb-24">
      {powerUps.map((powerUp, index) => (
        <View key={index} className="items-center">
          <LinearGradient
            colors={gradientColors[index % gradientColors.length]} // Dynamically apply colors based on index
            className="items-center py-3 rounded-2xl border border-white"
          >
            <Text className="text-2xl text-white font-black mb-4">{powerUp.name}</Text>
            <Image
              source={{ uri: getImageUrlById(powerUp.itemID) || '' }}
              className="w-64 h-64 mb-4"
            />
            <TouchableOpacity onPress={() => handleOpenModal(powerUp)}>
              <LinearGradient colors={['#F8F6F4', '#8399A2']} className="rounded-xl py-3 px-16">
                <View className="flex flex-row gap-2">
                  <Image
                    source={require('../assets/Vcoin.png')}
                    className="w-6 h-6"
                  />
                  <Text className="text-lg font-black text-white">{powerUp.vcoinPrice}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ))}

      {selectedPowerUp && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-2xl w-[80%]">
              <Text className="text-xl text-black font-black mb-4">Buy {selectedPowerUp.name}</Text>
              <View className="flex-row items-center gap-x-2 mb-2">
                <Text className="text-lg font-bold text-black">Price:</Text>
                <Text className="text-lg text-black">{selectedPowerUp.vcoinPrice} vCoins each</Text>
              </View>
              <View className="flex flex-row items-center mb-4">
                <TouchableOpacity onPress={() => handleQuantityChange(-1)}>
                  <MinusIcon className="h-4 w-4 text-black" />
                </TouchableOpacity>
                <Text className="mx-4 text-white font-bold text-lg bg-gray-400 rounded-lg py-1 px-3">{quantity}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(1)}>
                  <AddIcon className="h-4 w-4 text-black" />
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-lg font-bold text-black">Total Price:</Text>
                <Text className="text-lg text-black">{totalPrice} vCoins</Text>
              </View>

              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  className={`${quantity === 0 || totalPrice > vCoin ? 'opacity-50' : ''}`}
                  onPress={handleBuy}
                  disabled={quantity === 0 || totalPrice > vCoin}
                >
                  <LinearGradient
                    className="py-2 px-5 rounded-xl items-center"
                    colors={['#F8F6F4', '#8399A2']}
                  >
                    <Text className="text-base font-bold text-white">Buy</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <LinearGradient
                    className="py-2 px-3 rounded-xl items-center"
                    colors={['#DD816A', '#FF1F1F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
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

export default PowerUps;
