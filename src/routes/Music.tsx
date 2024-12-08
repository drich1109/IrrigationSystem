import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import PlayIcon from '../assets/svg/PlayIcon';
import PauseIcon from '../assets/svg/PauseIcon';  // Import the pause icon
import { Musics } from './type';
import { buyMusic, getBackgroundMusic, getMusic, getUserVCoin } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import LinearGradient from 'react-native-linear-gradient';

type FileUrl = {
  id: number;
  url: string;
};

type MusicProps = {
  vCoin: number;
  setVcoin: React.Dispatch<React.SetStateAction<number>>;
};

const Music: React.FC<MusicProps> = ({ vCoin, setVcoin }) => {
  const [music, setMusic] = useState<Musics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [sound, setSound] = useState<Sound | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMusic, setSelectedMusic] = useState<Musics | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);  // Track if sound is playing
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);  // Track the current playing track

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const result = await getMusic();
        setMusic(result.data);

        const audioUrls = await Promise.all(
          result.data.map(async (music: Musics) => {
            if (music.isActive) {
              const url = getBackgroundMusic(music.filePath);
              return { id: music.itemID, url };
            }
            return null;
          })
        );

        setFileUrls(audioUrls.filter((url) => url !== null) as FileUrl[]);

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
        setError('Failed to fetch music');
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const toggleSound = (fileUrl: string, trackId: number) => {
    if (currentTrack === trackId && isPlaying) {
      sound?.pause();
      setIsPlaying(false);
    } else {
      if (sound) {
        sound.stop();
        sound.release();
      }

      const newSound = new Sound(fileUrl, '', (error: Error | null) => {
        if (error) {
          console.error('Failed to load sound', error);
          return;
        }

        newSound.setVolume(1.0);
        newSound.play(() => {
          setIsPlaying(false);
          setCurrentTrack(null);
          newSound.release();
        });
      });

      setSound(newSound);
      setIsPlaying(true);
      setCurrentTrack(trackId);
    }
  };

  const handleOpenModal = (music: Musics) => {
    setSelectedMusic(music);
    setQuantity(1);
    setTotalPrice(music.vcoinPrice);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    if (selectedMusic && quantity > 0 && totalPrice <= vCoin) {
      const userID = await AsyncStorage.getItem('userID');
      if (userID)
        buyMusic(userID, selectedMusic.itemID, quantity).then(() => {
          setVcoin(prev => prev - totalPrice);
          setModalVisible(false);
        });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }


  return (
    <View className="flex flex-row gap-12 items-center p-[65px] mb-24">
      {fileUrls.length > 0 && (
        music.map((m, index) => (
          <View className="items-center">
            <View className="items-center mb-4" key={index}>
            <Image source={require('../assets/Disk.png')} className="w-56 h-56" />
              <TouchableOpacity onPress={() => toggleSound(fileUrls[index].url, m.itemID)}>
                {isPlaying && currentTrack === m.itemID ? (
                  <PauseIcon className="w-8 h-8 text-black bg-white p-4 rounded-full mb-2" />
                ) : (
                  <PlayIcon className="w-8 h-8 text-black bg-white p-4 rounded-full mb-2" />
                )}
              </TouchableOpacity>
              <Text className="text-2xl text-white font-black mb-2">{m.musicTitle}</Text>
              {/* <Text className="text-lg text-white font-light mb-6">{m.musicGenre}</Text> */}
            </View>
            <View className="flex flex-row gap-4">
              <TouchableOpacity className={`${m.isAlreadyBought == 1 ? 'opacity-50' : ''}`} onPress={() => handleOpenModal(m)} disabled={m.isAlreadyBought == 1}>
                <LinearGradient colors={['#F8F6F4', '#8399A2']} className="rounded-xl py-3 px-4">
                  <View className="flex flex-row gap-2">
                    <Image
                      source={require('../assets/Vcoin.png')}
                      className="w-6 h-6"
                    />
                    <Text className="text-lg font-black text-white">{m.vcoinPrice}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
      {selectedMusic && (
        <Modal visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View className="flex items-center justify-center flex-1 bg-[#00000080]">
            <View className="bg-white items-center p-6 rounded-2xl w-[80%]">
              <Text className="text-xl text-black font-black mb-4">Buy {selectedMusic.musicTitle}</Text>
              <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-lg text-black font-bold">Price:</Text>
                <Text className="text-lg text-black">{totalPrice} vCoins</Text>
              </View>

              <View className="flex-row gap-2 items-center">
                <TouchableOpacity
                  className={`${quantity === 0 || totalPrice > vCoin ? 'opacity-50' : ''}`}
                  onPress={handleBuy}
                  disabled={quantity === 0 || totalPrice > vCoin}
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

export default Music;
