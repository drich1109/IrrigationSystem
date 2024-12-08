import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    ImageBackground,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { getLanguages, loginUser, register, updateScore, updateUserLanguage } from './repo'; // Adjust the import path
import type { Languages, UserDto } from './type'; // Adjust the import path
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import LinearGradient from 'react-native-linear-gradient';
import Visayas from '../assets/svg/Visayas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'ChangeLanguage'>;

const ChangeLanguage: React.FC<Props> = ({navigation}) => {
    const [languages, setLanguages] = useState<Languages[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<Languages>();
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("");

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const result = await getLanguages();
                setLanguages(result.data);
            } catch (err) {
                setError('Failed to fetch languages');
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);

    const selectLanguage = async (
        languageId: number,
    ) => {
        setIsSubmit(true);
        setLoadingMessage("Please wait...");
        const userID = await AsyncStorage.getItem('userID');
        try {
            if (userID) {
                console.log(languageId)
                console.log(userID)
                const result = await updateUserLanguage(userID, languageId);
                await AsyncStorage.setItem('languageId', languageId.toString());
                if (result.isSuccess) {
                    navigation.navigate('Dashboard')
                } else {
                    setError(result.message)
                    setShowError(true);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }finally{
            setIsSubmit(false);
        }
    };

    async function warayclick() {
        const languageId = 3;
        setSelectedLanguage(languages.find(lang => lang.languageID === languageId));
        setModalVisible(true);

    }
    async function cebuanoclick() {
        const languageId = 1;
        setSelectedLanguage(languages.find(lang => lang.languageID === languageId));
        setModalVisible(true);

    }
    async function hiligaynonclick() {
        const languageId = 2;
        setSelectedLanguage(languages.find(lang => lang.languageID === languageId));
        setModalVisible(true);
    }

    function closeModal() {
        setModalVisible(false);
    }


    if (loading) {
        return (
            <Loader isVisible={loading} message='Please wait...' />
        );
    }

    return (
        <SafeAreaView className="flex-1">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 items-center justify-center p-6">
                <View
                    className="flex-row items-center justify-center rounded-2xl py-4 px-6 border border-[#FAF9F6] mb-8"
                    style={{
                        backgroundColor: 'rgba(240, 240, 240, 0.6)',
                    }}
                >
                    <Text className="text-sm text-gray-800 text-center">
                        Learning a new language can be challenging, but you're never alone—we've got your back!
                    </Text>
                </View>

                <Text className="text-3xl text-white text-center font-semibold mb-8">
                    Click on a Region to Select!
                </Text>

                <Visayas className="h-64 w-64 text-white mb-4" onClickCebuano={cebuanoclick} onClickHiligaynon={hiligaynonclick} onClickWaray={warayclick} />
            </LinearGradient>

            {selectedLanguage && (
                <Modal visible={isModalVisible} transparent={true} animationType="none" onRequestClose={closeModal}>
                    <TouchableOpacity
                        className="flex-1 justify-end"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                        onPress={closeModal}
                    >
                        <View className=" rounded-t-xl w-full">
                            <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl">
                                <View className="p-8">
                                    <Text className="text-small text-black mb-5 text-left">
                                        Note: {selectedLanguage.native_name} is a commonly used term for this language and may not represent its official name.
                                    </Text>
                                    <Text className="text-3xl text-black mb-2 text-center">{selectedLanguage.native_name}</Text>
                                    <Text className="text-lg text-black mb-2 text-left">
                                        Specific Language to Learn: <Text className="font-bold">{selectedLanguage.name}</Text>
                                    </Text>
                                    <Text className="text-small text-black mb-5 text-left">
                                        {selectedLanguage.description}
                                    </Text>

                                </View>
                                <View className="pb-10 px-10">
                                    <TouchableOpacity
                                        onPress={() => selectLanguage(selectedLanguage.languageID)}
                                    >
                                        <LinearGradient colors={['#6addd0', '#f7c188']} className="bg-gray-600 py-2 px-10 rounded-xl self-center">
                                            <Text className="text-lg text-white font-bold">Select</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
            <LoaderModal isVisible={isSubmit} message={loadingMessage} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 120,
        height: 120,
        marginVertical: 40,
        alignSelf: 'center',
    },
    background: {
        flex: 1,
        padding: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    languageContainer: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        marginStart: 16,
    },
    languageText: {
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    userInfoContainer: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        elevation: 1,
    },
    userInfoText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default ChangeLanguage;
