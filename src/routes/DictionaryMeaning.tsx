import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchIcon from "../assets/svg/SearchIcon";
import { useEffect, useState } from "react";
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import { RootStackParamList } from "../../types";
import { Path, Svg } from "react-native-svg";
import { StackScreenProps } from "@react-navigation/stack";
import { getContentById, getContentDefinitionById, getContentExampleById, getContentPronunciation, getContentSyllableById, getSyllablePronunciation } from "./repo";
import { Content, ContentDefinition, ContentExample, ContentSyllable } from "./type";
import Sound from 'react-native-sound';
import LinearGradient from "react-native-linear-gradient";
import BackIcon from "../assets/svg/BackIcon";

type Props = StackScreenProps<RootStackParamList, 'DictionaryMeaning'>;

const DictionaryMeaning: React.FC<Props> = ({ route, navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [activeScreen, setActiveScreen] = useState<keyof RootStackParamList | null>('Dictionary');
  const { contentId } = route.params;
  const [content, setContentById] = useState<Content>();
  const [contentSyllables, setContentSyllables] = useState<ContentSyllable[]>();
  const [contentDefinitions, setContentDefinitions] = useState<ContentDefinition[]>();
  const [contentExamples, setContentExamples] = useState<ContentExample[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [sound, setSound] = useState<Sound | null>(null);
  const [syllableFileUrls, setSyllableFileUrls] = useState<string[]>([]);


  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const contentResult = await getContentById(contentId);
        setContentById(contentResult.data);

        if (contentResult.data.audioPath) {
          const newFileUrl = contentResult.data.audioPath;
          setFileUrl(newFileUrl);
        }

        const syllableResult = await getContentSyllableById(contentId);
        if (syllableResult.data)
          setContentSyllables(syllableResult.data);

        const syllableUrls = syllableResult.data.map(syllable => syllable.audioPath);
        if (syllableUrls)
          setSyllableFileUrls(syllableUrls);

        const definitionResult = await getContentDefinitionById(contentId);
        if (definitionResult.data)
          setContentDefinitions(definitionResult.data);

        const exampleResult = await getContentExampleById(contentId);
        if (exampleResult)
          setContentExamples(exampleResult.data);
      } catch (err) {
        console.error('Failed to fetch content:', err);
        setError('Failed to fetch contents');
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
      stopAndReleaseSound();
    }
  }, [contentId]);


  const playSound = (fileUrl: string | null) => {
    if (!fileUrl) return;
    console.log(fileUrl)
    const sound = new Sound(fileUrl, '', (error: Error | null) => {
      if (error) {
        console.error('Failed to load sound', error);
        return;
      }

      sound.setVolume(1.0); // Set volume to max
      sound.play(() => {
        // Callback when sound playback ends
        sound.release(); // Release the sound instance after playback
      });
    });

    setSound(sound); // Optionally track the sound instance
  };

  const stopAndReleaseSound = () => {
    if (sound) {
      sound.stop();
      sound.release();
      setSound(null);
    }
  };

  const playSyllableSound = (syllableIndex: number) => {
    const syllableAudioUrl = syllableFileUrls[syllableIndex];
    if (!syllableAudioUrl) return;

    const syllableSound = new Sound(syllableAudioUrl, '', (error) => {
      if (error) {
        console.error('Failed to load the syllable sound', error);
        return;
      }

      syllableSound.play();
    });
  };

  return (
    <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover items-center">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
        <TouchableOpacity onPress={() => navigation.navigate("Dictionary")}>
          <BackIcon className=" w-8 h-8 text-white" />
        </TouchableOpacity>
      </View>

      {content && (
        <View className="ml-4 mt-24 w-full px-6">
          <View className="flex-row items-center">
            <Text className="text-2xl font-black text-white">
              {content.contentText}
            </Text>
            <TouchableOpacity onPress={() => playSound(fileUrl)}>
              <SpeakerIcon className="h-10 w-10 ml-1 text-white font-bold" />
            </TouchableOpacity>
          </View>

          {contentSyllables && contentSyllables.length > 0 && (
            <View className="flex flex-row mb-2 px-2 itmes-center">
              {contentSyllables.map((syllable, index) => (
                <View key={index} className="flex flex-row">
                  <TouchableOpacity onPress={() => playSyllableSound(index)}>
                    <Text className="text-xl italic underline font-light text-white">
                      {syllable.syllableText}
                    </Text>
                  </TouchableOpacity>
                  {index < contentSyllables.length - 1 && (
                    <Text className="text-xl italic font-light text-white"> </Text>
                  )}
                </View>
              ))}
            </View>
          )}
          <View className="flex-row items-center gap-x-2">
            <Text className="text-lg mb-4 text-white font-bold">
              English Translation:
            </Text>
            <Text className="text-lg mb-4 text-white">"{content.englishTranslation}"
            </Text>
          </View>

          {contentDefinitions && contentDefinitions.length > 0 && (
            <View className="ml-4 px-2 mb-4 w-auto">
              <Text className="text-xl font-bold text-white">
                Definitions:
              </Text>
              {contentDefinitions.map((definition, index) => (
                <View key={index}>
                  <Text className="text-lg text-white font-font-semibold ml-2">
                    {"\u2022"} {definition.nativeDefinition}
                  </Text>
                  <Text className="text-lg text-white font-font-semibold ml-2 mt-2 italic">
                    {definition.englishDefinition}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {contentExamples && contentExamples.length > 0 && (
            <View className="ml-4 px-2 mb-4 w-auto">
              <Text className="text-xl font-bold text-white">Examples:</Text>
              {contentExamples.map((example, index) => (
                <View key={index}>
                  <Text className="text-lg text-white font-semibold">
                    {"\u2022"} "{example.nativeExample}"
                  </Text>
                  <Text className="text-lg italic text-white font-semibold">
                    {" "} "{example.englishExample}"
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      )}

      {loading && (
        <Text className="text-white text-center mt-4">Loading...</Text>
      )}
    </LinearGradient>
  );
};

export default DictionaryMeaning;
