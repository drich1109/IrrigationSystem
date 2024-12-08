import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Menu from '../components/Menu';
import SearchIcon from '../assets/svg/SearchIcon';
import ArrowIcon from '../assets/svg/ArrowIcon';
import { useNavigation } from '@react-navigation/native';
import { DictionaryMeaningScreenNavigationProp, RootStackParamList } from '../../types';
import { Content, Languages, UserProfileDto } from './type';
import { getContent, getUserLanguage } from './repo';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const Dictionary: React.FC = () => {
  const [searchString, setSearchText] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigation = useNavigation<DictionaryMeaningScreenNavigationProp>();
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');
  const [languageDetails, setLanguageDetails] = useState<Languages>();
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [userId, setUserID] = useState<string>("");
  const [dictWord, setDictWord] = useState<string>("");
  const [showDictionary, setShowDictionary] = useState<boolean>(true);

  const fetchContents = async (reset = false) => {
    setLoading(true);
    try {
      const userID = await AsyncStorage.getItem('userID');
      const languageID = await AsyncStorage.getItem('languageId');
      console.log(languageID)
      switch (languageID) {
        case "1": setDictWord("Diksyonaryo"); break;
        case "2": setDictWord("Diksyonaryo"); break;
        case "3": setDictWord("Diksyonaryu"); break;
        default:
          setDictWord("DICTIONARY");
          break;
      }
      setUserID(userID ?? "");
      const result1 = await getUserLanguage(Number(userID));
      setLanguageDetails(result1.data);
      const result = await getContent(result1.data.languageID, searchString, offset, 10);
      const newContents = result.data;
      if (reset) {
        setContents(newContents);
        setOffset(0);
      } else {
        setContents((prevContents) => [...prevContents, ...newContents]);
      }


      if (newContents.length < 10) {
        setHasMore(false);
      }


      if (newContents.length === 10) {
        setOffset((prevOffset) => prevOffset + 10);
      }
    } catch (error) {
      setError('Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();

    // Toggle between 'Dictionary' and 'dictWord' every 3 seconds
    const interval = setInterval(() => {
      setShowDictionary((prev) => !prev);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchContents(true);
  }, [searchString]);

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchContents();
    }
  };

  const navigateToMeaning = (contentId: number) => {
    navigation.navigate('DictionaryMeaning', { contentId });
  };

  return (
    <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center resize-cover">
      <View className="items-center mb-3 mt-8">
      <Animatable.Text
        animation="slideInDown" // Slide in from above
        duration={500}         // Animation duration (500ms)
        key={showDictionary ? 'Dictionary' : 'dictWord'} // Key ensures animation reruns on text change
        className="text-4xl font-black text-white"
      >
        {showDictionary ? 'Dictionary' : dictWord}
      </Animatable.Text>
      </View>
      <View className="flex flex-row items-center justify-start bg-white rounded-lg px-4 mb-5 w-4/5 h-10">
        <TextInput
          className="flex-1 h-full text-[#999] text-base"
          placeholder="Search for a word"
          placeholderTextColor="#000"
          value={searchString}
          onChangeText={setSearchText}
        />
        <SearchIcon className="w-7 h-7" />
      </View>
      <View className="flex flex-row items-center mb-4 gap-16">
        <Text className="text-white text-2xl px-4 py-2 rounded-2xl" style={{
          backgroundColor: 'rgba(240, 240, 240, 0.4)'
        }}>Native</Text>
        <Text className="text-white text-2xl px-4 py-2 rounded-2xl" style={{
          backgroundColor: 'rgba(240, 240, 240, 0.4)'
        }}>English</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
            loadMoreData();
          }
        }}
        scrollEventThrottle={16}
      >
        {loading && offset === 0 ? (
          <ActivityIndicator size="large" />
        ) : contents.length > 0 ? (
          contents.map((c, index) => (
            <TouchableOpacity key={index} onPress={() => navigateToMeaning(c.contentID)}>
              <LinearGradient colors={['#f7c188', '#6addd0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // Left to right gradient
                className="rounded-lg py-3 px-5 mb-3 border border-[#FAF9F6]"
              >
                <View className="flex flex-row items-center gap-x-4">
                  <Text className="text-xl text-center text-white w-[30%] font-bold">{c.contentText}</Text>
                  <ArrowIcon className="w-8 h-8 text-white" />
                  <Text className="text-xl text-center text-white w-[30%] font-bold italic">{c.englishTranslation}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-white text-lg text-center">No words found</Text>
        )}
        {loading && offset > 0 && (
          <ActivityIndicator size="large" className="mt-4" />
        )}
      </ScrollView>
      <Menu activeScreen={activeScreen} />
    </LinearGradient>
  );
};

export default Dictionary;
