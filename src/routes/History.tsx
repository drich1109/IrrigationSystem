import { Animated, Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Switch } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackIcon from "../assets/svg/BackIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { PieChart } from "react-native-chart-kit";
import React, { useRef, useState } from "react";
import { PronunciationProgressDto, PronunciationProgressListDto } from "./type";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pronunciationProgressChart, pronunciationProgressList } from "./repo";
import CircleIcon from "../assets/svg/CircleIcon";

type Props = StackScreenProps<RootStackParamList, 'History'>;

const screenWidth = Dimensions.get('window').width;

const History: React.FC<Props> = ({ navigation, route }) => {
    const [pieDataResult, setPieData] = useState<PronunciationProgressDto>();
    const [currentContentId, setContentId] = useState<number | null>(null);
    const [list, setList] = useState<PronunciationProgressListDto[]>([]);
    const { contentId } = route.params;

    const [isToggled, setIsToggled] = useState(false);
    const animatedPosition = useRef(new Animated.Value(0)).current;

    const fetchLeaderboardData = async (toggled: boolean) => {
        try {
            console.log(toggled);
            const userIdString = await AsyncStorage.getItem('userID');
            if (userIdString) {
                const result = await pronunciationProgressChart(parseInt(userIdString), toggled ? contentId : null);
                setPieData(result.data);
                const result2 = await pronunciationProgressList(parseInt(userIdString), toggled ? contentId : null);
                setList(result2.data);
            }
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchLeaderboardData(false);
        }, [contentId])
    );

    const handleToggle = () => {
        const newState = !isToggled;
        setIsToggled(newState);

        Animated.timing(animatedPosition, {
            toValue: newState ? 20 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        setContentId(newState ? contentId : null);
        fetchLeaderboardData(newState); 
    };


    const pieData = [
        { name: 'Correct', population: parseInt(pieDataResult?.correct ?? "0"), color: '#5CAC3C', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Incorrect', population: parseInt(pieDataResult?.incorrect ?? "0"), color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ];


    const getCircleIconColor = (score: number) => {
        return score === 0 ? 'red' : score === 1 ? 'green' : 'gray';
    };

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 items-center">
                <View className="flex-row justify-between items-center mt-4 w-full px-5">
                    <TouchableOpacity onPress={() => navigation.navigate('Practice')}>
                        <BackIcon className="h-8 w-8 text-white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1 mt-2">
                    <Text className="text-4xl font-black text-white text-center">History</Text>

                    <View className="flex-row items-center gap-x-2 mt-2 justify-end mr-5">
                        <Text className="text-md text-white">Show Content History only</Text>
                        <Switch
                            value={isToggled}
                            onValueChange={handleToggle}
                            trackColor={{ false: '#E0E0E0', true: '#34D399' }}
                            thumbColor={isToggled ? '#ffffff' : '#BDBDBD'}
                            ios_backgroundColor="#E0E0E0"
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                    <View className="">
                        <PieChart
                            data={pieData}
                            width={screenWidth}
                            height={200}
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#f7c188',
                                backgroundGradientTo: '#6addd0',
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                </View>
                <ScrollView
                    className="bg-white rounded-xl mb-8 h-[16%]"
                    contentContainerStyle={{
                        paddingHorizontal: 30,
                        paddingVertical: 15,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="space-y-3">
                        <Text className="text-black text-3xl font-bold mb-2 mt-2 text-center px-16">History</Text>

                        <View className="flex-row mb-2">
                            <Text className="flex-1 font-bold text-black text-base text-center">Word</Text>
                            <Text className="flex-1 font-bold text-black text-base text-center">Response</Text>
                        </View>

                        {list.map((item, index) => (
                            <View
                                key={index}
                                className="bg-[#F2F0EF] p-4 rounded-lg shadow-lg mb-4"
                                style={{
                                    borderLeftWidth: 4,
                                    borderLeftColor: getCircleIconColor(item.pronunciationScore) === 'green' ? 'green' : getCircleIconColor(item.pronunciationScore) === 'red' ? 'red' : 'gray',
                                }}
                            >
                                <View className="flex-row items-center justify-between">
                                    <Text className="flex-1 text-base text-black font-semibold">{item.contentText}</Text>
                                    <View className="flex-1 flex-row justify-center items-center">
                                        <CircleIcon
                                            className={`h-5 w-5 text-${getCircleIconColor(item.pronunciationScore)}-500`}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

            </LinearGradient>
        </SafeAreaView>
    );
};

export default History;
