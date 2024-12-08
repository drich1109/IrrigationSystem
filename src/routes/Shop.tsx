import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import Menu from '../components/Menu';
import PowerUps from './PowerUps';
import Subscription from './Subscription';
import Currency from './Currency';
import Music from './Music';
import { RootStackParamList } from '../../types';
import { getPowerupImage, getUserPowerUps, getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { StackScreenProps } from '@react-navigation/stack';
import MusicIcon from '../assets/svg/MusicIcon';
import PotionIcon from '../assets/svg/PotionIcon';
import SubscriptionIcon from '../assets/svg/SubscriptionIcon';
import CurrencyIcon from '../assets/svg/CurrencyIcon';
import { QuestionDetails, UserPowerUp } from './type';
import * as Animatable from 'react-native-animatable';

type Props = StackScreenProps<RootStackParamList, 'Shop'>;

interface Shop {
  route: {
    params: {
      selectedItemDefault?: string;
    };
  };
}

type PowerUpURL = {
  id: number;
  url: string;
};

const Shop: React.FC<Props> = ({ route }) => {
  const selectedItemDefault = route.params.selectedItemDefault || 'Power Ups';
  const [selectedItem, setSelectedItem] = useState<string>(selectedItemDefault);
  const [vCoin, setVcoin] = useState<number>(0);
  const [quantityPower, setquantityPower] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [powerUps, setPowerUps] = useState<UserPowerUp[]>([]);
  const [powerUpUrls, setPowerUpUrl] = useState<PowerUpURL[]>([]);
  const [dictWord, setDictWord] = useState<string>("");
  const [showShop, setShop] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const languageID = await AsyncStorage.getItem('languageId');
      console.log(languageID);
      switch (languageID) {
        case "1": setDictWord("Tindahan"); break;
        case "2": setDictWord("Tindahan"); break;
        case "3": setDictWord("Tindahan"); break;
        default:
          setDictWord("Shop");
          break;
      }
      if (userID) {
        const result = await getUserVCoin(userID);
        if (result.isSuccess) {
          setVcoin(result.data);
        } else {
          setError('Failed to fetch vCoin');
        }
      } else {
        setError('No userID found');
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();

    // Toggle between 'Dictionary' and 'dictWord' every 3 seconds
    const interval = setInterval(() => {
      setShop((prev) => !prev);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPowerUps = async () => {
      try {
        const userID = await AsyncStorage.getItem('userID');
        if (userID) {
          const result = await getUserPowerUps(userID);
          if (result.isSuccess) {
            setPowerUps(result.data);
            const imageUrls = await Promise.all(
              result.data.map(async (powerUp) => {
                if (powerUp.itemId !== 0) {
                  const url = powerUp.filePath;
                  return { id: powerUp.itemId, url };
                }
                return null;
              })
            );

            setPowerUpUrl(imageUrls.filter((url) => url !== null));
          } else {
            setError('Failed to fetch PowerUps');
          }
        } else {
          setError('No userID found');
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchPowerUps();
  }, []);

  const renderContent = () => {
    switch (selectedItem) {
      case 'Power Ups':
        return <PowerUps vCoin={vCoin} setVcoin={setVcoin} userPowerUps={powerUps} setUserPowerUp={setPowerUps} />;
      case 'Subscription':
        return <Subscription vCoin={vCoin} setVcoin={setVcoin} />;
      case 'Currency':
        return <Currency vCoin={vCoin} setVcoin={setVcoin} />;
      default:
        return null;
    }
  };

  const getImageUrlByItemId = (itemId: number) => {
    const powerUpUrlObj = powerUpUrls.find((powerUp) => powerUp.id === itemId);
    return powerUpUrlObj ? powerUpUrlObj.url : null;
  };

  return (
    <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
      <View className="absolute top-0 right-0 mr-4 mt-4 bg-white rounded-xl py-2 px-3">
        <View className="flex flex-row gap-2">
          <Image source={require('../assets/Vcoin.png')} className="w-6 h-6" />
          <Text className="text-base font-black text-black">{vCoin}</Text>
        </View>
      </View>
      <View className="items-center mt-20 mb-3">
      <Animatable.Text
        animation="slideInDown" // Slide in from above
        duration={500}         // Animation duration (500ms)
        key={showShop ? 'Shop' : 'dictWord'} // Key ensures animation reruns on text change
        className="text-4xl font-black text-white"
      >
        {showShop ? 'Shop' : dictWord}
      </Animatable.Text>
      </View>
      <View>
        <View className="flex flex-row gap-x-2 items-center flex-wrap w-full">
          <TouchableOpacity
            className={`p-2 px-3 rounded-full ${selectedItem === 'Power Ups' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Power Ups')}>
            <PotionIcon className={`text-base h-8 w-8 font-${selectedItem === 'Power Ups' ? 'bold' : 'light'} ${selectedItem === 'Power Ups' ? 'text-[#6addd0]' : 'text-white'}`} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Subscription' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Subscription')}>
            <SubscriptionIcon className={`text-base h-8 w-8 font-${selectedItem === 'Subscription' ? 'bold' : 'light'} ${selectedItem === 'Subscription' ? 'text-[#6addd0]' : 'text-white'}`} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-2 px-3 rounded-full ${selectedItem === 'Currency' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedItem('Currency')}>
            <CurrencyIcon className={`text-white h-8 w-8 font-${selectedItem === 'Currency' ? 'bold' : 'light'} ${selectedItem === 'Currency' ? 'text-[#6addd0]' : 'text-white'}`} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal contentContainerStyle={{ padding: 4 }} className="mb-4 flex-1">
        {renderContent()}
      </ScrollView>

      <View className="absolute bottom-[10%] rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
        <View className="flex-row justify-center gap-2 w-[100%]">
          {powerUps.map((powerUp, index) => {
            const imageUrl = powerUp.filePath;

            return (
              <View className="py-2 px-1 items-center relative" key={index}>
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-10 h-10"
                  />
                ) : null}
                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1 z-10">
                  {powerUp.quantity}x
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <Menu activeScreen="Shop" />
    </LinearGradient>
  );
};

export default Shop;
