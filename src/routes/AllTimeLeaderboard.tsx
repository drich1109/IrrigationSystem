import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BackIcon from '../assets/svg/BackIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import Svg, { Path } from 'react-native-svg';
import CrownIcon from '../assets/svg/CrownIcon';
import { LeaderBoardDto, SelfLeaderBoardDto } from './type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLeaderBoards, getLeaderBoardsAllTime, getSelfRank, getSelfRankAllTime, getUserImageUrl } from './repo';
import ProfileIcon from '../assets/svg/ProfileIcon';
import * as Animatable from 'react-native-animatable';

interface FileUrl {
    index: number;
    url: string;
}

type Props = StackScreenProps<RootStackParamList, 'AllTimeLeaderboard'>;

const AllTimeLeaderboard: React.FC<Props> = ({ navigation }) => {
    const [leaderboardData, setLeaderBoardData] = useState<LeaderBoardDto[]>([]);
    const [fileUrl, setFileUrl] = useState<FileUrl[]>([]);
    const [userRank, setUserRank] = useState<SelfLeaderBoardDto>();
    const [file, setFile] = useState<string>();
    const [dictWord, setDictWord] = useState<string>("");
    const [showBoard, setShowBoard] = useState<boolean>(true);

    const fetchLeaderboardData = async () => {
        try {
            const userIdString = await AsyncStorage.getItem('userID');
            const languageID = await AsyncStorage.getItem('languageId');
            console.log(languageID);
            switch (languageID) {
                case "1": setDictWord("Liderbord"); break;
                case "2": setDictWord("Liderbord"); break;
                case "3": setDictWord("Liderbord"); break;
                default:
                    setDictWord("Leaderboard");
                    break;
            }

            if (userIdString) {
                const result = await getLeaderBoardsAllTime();
                const top10Data = result.data.slice(0, 10);
                setLeaderBoardData(top10Data);

                top10Data.forEach((user, index) => {
                    if (user.imagePath) {
                        const userImageUrl = user.imagePath;
                        setFileUrl((prevFileUrl) => [...prevFileUrl, { index, url: userImageUrl }]);
                    }
                });

                const userRankResult = await getSelfRankAllTime(Number(userIdString));
                setUserRank(userRankResult.data);

                if (userRankResult.data.imagePath) {
                    const userImageUrl = userRankResult.data.imagePath;
                    setFile(userImageUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
        }
    };

    // First useEffect: Initial fetch
    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    // Second useEffect: Toggle and interval
    useEffect(() => {
        // Toggle between 'Pronounce' and 'dictWord' every 3 seconds
        const interval = setInterval(() => {
            setShowBoard((prev) => !prev);
        }, 3000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const firstPlaceHeight = useRef(new Animated.Value(0)).current;
    const secondPlaceHeight = useRef(new Animated.Value(0)).current;
    const thirdPlaceHeight = useRef(new Animated.Value(0)).current;

    const maxHeight = 200;
    const minHeight = 20;

    const getBarHeight = (score: number, maxScore: number) => {
        const adjustedMaxScore = maxScore > 0 ? maxScore : 1;
        return score > 0 ? Math.max((score / adjustedMaxScore) * maxHeight, minHeight) : minHeight;
    };

    useEffect(() => {
        const maxScore = Math.max(
            leaderboardData[0]?.totalScoreWeekly ?? 0,
            leaderboardData[1]?.totalScoreWeekly ?? 0,
            leaderboardData[2]?.totalScoreWeekly ?? 0
        );

        Animated.parallel([
            Animated.timing(firstPlaceHeight, {
                toValue: getBarHeight(leaderboardData[0]?.totalScoreWeekly ?? 0, maxScore),
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.timing(secondPlaceHeight, {
                toValue: getBarHeight(leaderboardData[1]?.totalScoreWeekly ?? 0, maxScore),
                duration: 1000,
                useNativeDriver: false,
            }),
            Animated.timing(thirdPlaceHeight, {
                toValue: getBarHeight(leaderboardData[2]?.totalScoreWeekly ?? 0, maxScore),
                duration: 1000,
                useNativeDriver: false,
            }),
        ]).start();
    }, [leaderboardData]);

    const closeLeaderBoard = () => navigation.navigate('Dashboard');

    return (
        <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center resize-cover">
            <TouchableOpacity className="absolute top-8 left-4" onPress={closeLeaderBoard}>
                <BackIcon className="h-8 w-8 text-white" />
            </TouchableOpacity>
            <View className="flex-1 top-8 items-center">
                <Animatable.Text
                    animation="slideInDown" // Slide in from above
                    duration={500}         // Animation duration (500ms)
                    key={showBoard ? 'Leaderboard' : 'dictWord'} // Key ensures animation reruns on text change
                    className="text-4xl font-black text-white text-center"
                >
                    {showBoard ? 'Leaderboard' : dictWord}
                </Animatable.Text>
                <View className="flex-row gap-x-10 mt-8 w-full items-center">
                    <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                        <Text className="text-lg text-white font-bold">Weekly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text className="text-lg text-lg text-black font-bold bg-white px-5 py-2 rounded-2xl">All Time</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {leaderboardData ? (
                <View className="flex-row items-end justify-center space-x-4 mt-10">
                    {leaderboardData[1] && (
                        <View className="items-center">
                            {fileUrl[1] ? (
                                <Image
                                    source={{ uri: fileUrl[1].url }}
                                    className="w-16 h-16 rounded-full border-2 border-white"
                                />
                            ) : (
                                <ProfileIcon className="h-10 w-10 text-white" />
                            )}
                            <Text className="text-base text-white font-black">{leaderboardData[1].name}</Text>
                            <Text className="text-base text-black font-bold bg-white px-4 py-2 rounded-2xl mt-2">{leaderboardData[1].totalScoreWeekly || 0}</Text>
                            <Animated.View style={{ height: secondPlaceHeight }} className="w-20 mt-2 rounded-t-xl overflow-hidden">
                                <LinearGradient colors={['#4B4C4B', '#F8F6F4']} className="flex-1 justify-center items-center pt-2">
                                    <Text className="text-4xl text-white font-black">2nd</Text>
                                </LinearGradient>
                            </Animated.View>
                        </View>
                    )}

                    {leaderboardData[0] && (
                        <View className="items-center">
                            {fileUrl[0] ? (
                                <Image
                                    source={{ uri: fileUrl[0].url }}
                                    className="w-16 h-16 rounded-full border-2 border-white"
                                />
                            ) : (
                                <ProfileIcon className="h-10 w-10 text-white" />
                            )}
                            <Text className="text-base text-white font-black">{leaderboardData[0].name}</Text>
                            <Text className="text-base text-black font-bold bg-white px-4 py-2 rounded-2xl mt-2">{leaderboardData[0].totalScoreWeekly || 0}</Text>
                            <Animated.View style={{ height: firstPlaceHeight }} className="w-24 mt-2 rounded-t-xl overflow-hidden">
                                <LinearGradient colors={['#FFD43B', '#FF8800']} className="flex-1 justify-center items-center pt-2">
                                    <Text className="text-4xl text-white font-black">1st</Text>
                                </LinearGradient>
                            </Animated.View>
                        </View>
                    )}

                    {leaderboardData[2] && (
                        <View className="items-center">
                            {fileUrl[2] ? (
                                <Image
                                    source={{ uri: fileUrl[2].url }}
                                    className="w-16 h-16 rounded-full border-2 border-white"
                                />
                            ) : (
                                <ProfileIcon className="h-10 w-10 text-white" />
                            )}
                            <Text className="text-base text-white font-black">{leaderboardData[2].name}</Text>
                            <Text className="text-base text-black font-bold bg-white px-4 py-2 rounded-2xl mt-2">{leaderboardData[2].totalScoreWeekly || 0}</Text>
                            <Animated.View style={{ height: thirdPlaceHeight }} className="w-20 mt-2 rounded-t-xl overflow-hidden">
                                <LinearGradient colors={['#AE5129', '#F9931F']} className="flex-1 justify-center items-center pt-2">
                                    <Text className="text-4xl text-white font-black">3rd</Text>
                                </LinearGradient>
                            </Animated.View>
                        </View>
                    )}
                </View>
            ) : (
                <Text className="text-white font-bold text-lg mt-10">No leaderboard data available.</Text>
            )}

            {leaderboardData ? (
                <View className="rounded-t-3xl w-full bg-white">
                    {leaderboardData[3] && (
                        <View className="px-6 py-2">

                            <View className="flex-row items-center justify-between">
                                <View className="p-2">
                                    <Text className="text-black font-black text-base">4th</Text>
                                </View>
                                <View className="p-2">
                                    {fileUrl[3] ? (
                                        <Image
                                            source={{ uri: fileUrl[3].url }}
                                            className="w-16 h-16 rounded-full border-2 border-white"
                                        />
                                    ) : (
                                        <ProfileIcon className="h-10 w-10 text-white" />
                                    )}
                                </View>
                                <View className="flex-col gap-y-1 p-2">
                                    <Text className="text-base font-black text-black">{leaderboardData[3].name}</Text>
                                    <Text className="text-base font-bold text-[#858494]">{leaderboardData[3].totalScoreWeekly || 0}</Text>
                                </View>
                                <View className="p-2">
                                    <CrownIcon className="h-8 w-8" />
                                </View>
                            </View>
                        </View>
                    )}
                    {leaderboardData[4] && (
                        <View className="px-6 py-2">
                            <View className="border-t border-black mx-6"></View>
                            <View className="flex-row items-center justify-between">
                                <View className="p-2">
                                    <Text className="text-black font-black text-base">5th</Text>
                                </View>
                                <View className="p-2">
                                    {fileUrl[4] ? (
                                        <Image
                                            source={{ uri: fileUrl[4].url }}
                                            className="w-16 h-16 rounded-full border-2 border-white"
                                        />
                                    ) : (
                                        <ProfileIcon className="h-10 w-10 text-white" />
                                    )}
                                </View>
                                <View className="flex-col gap-y-1 p-2">
                                    <Text className="text-base font-black text-black">{leaderboardData[4].name}</Text>
                                    <Text className="text-base font-bold text-[#858494]">{leaderboardData[4].totalScoreWeekly || 0}</Text>
                                </View>
                                <View className="p-2">
                                    <CrownIcon className="h-8 w-8" />
                                </View>
                            </View>
                        </View>

                    )}
                </View>) : (
                <Text className="text-white font-bold text-lg mt-10">No leaderboard data available.</Text>
            )}
            {userRank && (
                <LinearGradient colors={['#6addd0', '#f7c188']} className="rounded-t-3xl w-full">
                    <View className="px-6 py-2">
                        <View className="flex-row items-center justify-between">
                            <View className="p-2">
                                <Text className="text-black font-black text-base">{userRank.userRank}</Text>
                            </View>
                            <View className="p-2">
                                {file ? (
                                    <Image
                                        source={{ uri: file }}
                                        className="w-12 h-12 rounded-full border-2 border-white"
                                    />
                                ) : (
                                    <ProfileIcon className="h-10 w-10 text-white" />
                                )}
                            </View>
                            <View className="flex-col gap-y-1 p-2">
                                <Text className="text-base font-black text-black">{userRank.name}</Text>
                                <Text className="text-base font-bold text-[#858494]">{userRank.totalScoreWeekly}</Text>
                            </View>
                            <View className="p-2">
                                <CrownIcon className="h-8 w-8" />
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            )}
        </LinearGradient>
    );
};

export default AllTimeLeaderboard;
