import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, ActivityIndicator, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StarIcon from '../assets/svg/StarIcon';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, UnitContentScreenNavigationProp } from '../../types';
import BackIcon from '../assets/svg/BackIcon';
import { UnitDetails } from './type';
import { getUnits } from './repo';
import { useNavigation } from '@react-navigation/native';
import TotalIcon from '../assets/svg/TotalIcon';
import CorrectIcon from '../assets/svg/CorrectIcon';
import IncorrectIcon from '../assets/svg/IncorrectIcon';
import UnitIcon from '../assets/svg/UnitIcon';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useBackButtonHandler from '../utilities/useBackButtonHandler';
import CircleIcon from '../assets/svg/CircleIcon';
import Svg from 'react-native-svg';
import LockIcon from '../assets/svg/LockIcon';
import * as Animatable from 'react-native-animatable';

type Props = StackScreenProps<RootStackParamList, 'Unit'>;

const Unit: React.FC<Props> = ({ route, navigation }) => {
    useBackButtonHandler(navigation, 'Dashboard');

    const { sectionId, sectionName } = route.params;
    const [units, setUnits] = useState<UnitDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentUnit, setCurrentUnit] = useState<UnitDetails | null>(null);
    const navigate = useNavigation<UnitContentScreenNavigationProp>();
    const [dictWord, setDictWord] = useState<string>("");
    const [startWord, setStartWord] = useState<string>("");
    const [showSection, setShowSection] = useState<boolean>(true);
    const [showStart, setShowStart] = useState<boolean>(true);
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const userID = await AsyncStorage.getItem('userID');
                const languageID = await AsyncStorage.getItem('languageId');
                console.log(languageID)
                switch (languageID) {
                    case "1": setDictWord("Seksyon"); break;
                    case "2": setDictWord("Seksyon"); break;
                    case "3": setDictWord("Seksyon"); break;
                    default:
                        setDictWord("Section");
                        break;
                }
                switch (languageID) {
                    case "1": setStartWord("Sugod"); break;
                    case "2": setStartWord("Sugod"); break;
                    case "3": setStartWord("Tikang"); break;
                    default:
                        setStartWord("Start");
                        break;
                }
                const result = await getUnits(sectionId, userID);
                setUnits(result.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();

        const unsubscribe = navigation.addListener('focus', fetchUnits);
        return () => {
            unsubscribe();
        };
    }, [navigation, sectionId]);

    useEffect(() => {
        // Toggle between 'Dictionary' and 'dictWord' every 3 seconds
        const interval = setInterval(() => {
            setShowSection((prev) => !prev);
            setShowStart((prev) => !prev);
        }, 3000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    const navigateToUnitContent = () => {
        if (currentUnit) {
            const unitId = currentUnit?.unitID
            closeModal();
            navigate.navigate('UnitContent', { unitId, sectionId, sectionName });
        }

    };

    const openModal = (unit: UnitDetails) => {
        setCurrentUnit(unit);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setCurrentUnit(null);
    };

    if (loading) {
        return (
            <Loader message='loading' isVisible={loading} />
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
                <View className="flex-row justify-between w-full px-5 absolute top-8">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BackIcon className=" w-8 h-8 text-white" />
                    </TouchableOpacity>
                </View>
                <View className="items-center mb-3 mt-8">
                    <Animatable.Text
                        animation="slideInDown" // Slide in from above
                        duration={500}         // Animation duration (500ms)
                        key={showSection ? 'Section' : 'dictWord'} // Key ensures animation reruns on text change
                        className="text-4xl font-black text-white"
                    >
                        {showSection ? 'Section' : dictWord} {sectionName}
                    </Animatable.Text>
                </View>
                <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                    <View className="justify-around mt-2">
                        {units.map((unit: UnitDetails, index: number) => {

                            const boxColor = index % 2 === 0 ? '#6ADDD0' : '#F7C188';
                            const buttonColor = index % 2 === 0 ? '#6ADDD0' : '#F7C188';
                            const backgroundColor = unit.isLocked ? '#333' : 'white';

                            return (
                                <View key={index} className="mb-8">
                                    <View className="flex-row gap-x-3 items-center">
                                        <View
                                            style={{
                                                backgroundColor: boxColor,
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 4,
                                                elevation: 5,
                                            }}
                                            className="rounded-xl w-[30%] items-center justify-center px-4 py-4 flex-col"
                                        >
                                            <Text className="text-white text-2xl font-black">Unit {unit.unitNumber}</Text>
                                            <View className="flex-row gap-x-2 items-center mt-2">
                                                <CircleIcon className="h-4 w-4 text-white" />
                                                <Text className="text-white font-bold text-lg">{unit.totalScore}</Text>
                                            </View>
                                            <Text className="text-white font-bold text-lg">Score</Text>
                                        </View>

                                        <View
                                            style={{
                                                shadowColor: "#000",
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 4,
                                                elevation: 5,
                                                backgroundColor: backgroundColor,
                                            }}
                                            className="rounded-xl w-[62%] px-4 py-3 flex-col"
                                        >

                                            <View className="flex-row items-center gap-x-2">
                                                <CircleIcon className="h-4 w-4" color={boxColor} />
                                                <Text style={{ color: boxColor }} className="font-bold text-lg">{unit.totalItems <= 15 ? unit.totalItems : 15}</Text>
                                                <Text className="text-black text-xl font-bold ml-4">Questions</Text>
                                            </View>
                                            <View className="flex-grow flex items-center mt-4">
                                                <TouchableOpacity onPress={() => openModal(unit)} disabled={unit.isLocked == 1}>
                                                    <View className="flex-row items-center py-4 px-6 rounded-lg" style={{ backgroundColor: buttonColor }}>
                                                        {unit.isLocked == 1 && (
                                                            <LockIcon className="text-white h-4 w-4" />
                                                        )}
                                                        <Text className="text-white font-bold">
                                                            {unit.isLocked ? 'Locked' : 'Play'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                </ScrollView>

                {currentUnit && (
                    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={closeModal}>
                        <TouchableOpacity
                            className="flex-1 justify-end"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                            onPress={closeModal}
                        >
                            <View className=" rounded-t-xl w-full">
                                <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl">
                                    <View className="p-8">
                                        <View className="flex-row items-center mb-2">
                                            <Text className="text-md font-medium text-black items-start">
                                                Unit {currentUnit.unitNumber}
                                            </Text>
                                        </View>
                                        <Text className="text-3xl text-black mb-2 text-center font-bold">{currentUnit.title}</Text>
                                        <Text className="text-base text-black mb-5 text-center">
                                            {currentUnit.description}
                                        </Text>
                                        <View className="pb-4 px-10">
                                            <TouchableOpacity
                                                onPress={() => navigateToUnitContent()}
                                            >
                                                <LinearGradient colors={['#6addd0', '#f7c188']} start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 0 }} className="bg-gray-600 py-2 px-16 rounded-2xl self-center">
                                                    <Animatable.Text
                                                        animation="slideInDown" // Slide in from above
                                                        duration={500}         // Animation duration (500ms)
                                                        key={showStart ? 'Start' : 'dictWord'} // Key ensures animation reruns on text change
                                                        className="text-lg text-white font-bold"
                                                    >
                                                        {showStart ? 'Start' : startWord}
                                                    </Animatable.Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                )}
            </LinearGradient>
        </SafeAreaView>
    );
};

export default Unit;
