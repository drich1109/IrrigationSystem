import { Alert, Animated, Button, Image, Modal, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackIcon from "../assets/svg/BackIcon";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList, UnitScreenNavigationProp } from "../../types";
import ClockIcon from "../assets/svg/ClockIcon";
import { useEffect, useRef, useState } from "react";
import HeartIcon from "../assets/svg/HeartIcon";
import { Vibration } from 'react-native';
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import { GamePlayDto, PowerUp, PowerUpGameplay, QuestionDetails, UserPowerUp } from "./type";
import { getContentPronunciation, getPowerupImage, getPowerUps, getQuestionFiles, getUnitQuestions, getUserPowerUps, saveGamePlay } from "./repo";
import Sound from "react-native-sound";
import Loader from "../components/Loader";
import { useNavigation } from "@react-navigation/native";
import SpeakerIcon2 from "../assets/svg/SpeakerIcon2";
import HeartComponent from "../components/HeartComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SnowflakeComponent from "../components/SnowFlakeComponent";
import MatchComponent from "../components/MatchComponent";
import GameOver from "../components/GameOver";
import Congratulations from "../components/Congratulations";
import useBackButtonHandler from "../utilities/useBackButtonHandler";
import PlayIcon from "../assets/svg/PlayIcon";
import Svg, { Circle } from "react-native-svg";
import BagIcon from "../assets/svg/BagIcon";

type Props = StackScreenProps<RootStackParamList, 'UnitContent'>;

type FileUrl = {
    id: number;
    audioUrl?: string;
    imageUrl?: string;
    choice1AudioUrl?: string;
    choice2AudioUrl?: string;
    choice3AudioUrl?: string;
    choice4AudioUrl?: string;
};


type PowerUpURL = {
    id: number;
    url: string;
};

interface Item {
    id: number;
    name: string;
}

const UnitContent: React.FC<Props> = ({ route, navigation }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [modalVisible, setModalVisible] = useState(false);
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const { unitId, sectionId, sectionName } = route.params;
    const [questionList, setQuestions] = useState<QuestionDetails[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTrack, setCurrentTrack] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [matches, setMatches] = useState([
        '', // Match 1
        '', // Match 2
        '', // Match 3
        '', // Match 4
    ]);
    const [hearts, setHearts] = useState(3);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timerRunning, setTimerRunning] = useState<boolean>(true);
    const navigate = useNavigation<UnitScreenNavigationProp>();
    const [powerUps, setPowerUps] = useState<UserPowerUp[]>([]);
    const [powerUpUrls, setPowerUpUrl] = useState<PowerUpURL[]>([]);
    const [showHeartPopup, setShowHeartPopup] = useState<boolean>(false);
    const [showSnowflakes, setShowSnowflakes] = useState(false);
    const [disabledChoiceIndex, setDisabledChoiceIndex] = useState<number[]>([]);
    const [showCorrectAnswer, setCorrectAnswer] = useState<boolean>(false);
    const [clairVoyanceUsed, setClairVoyance] = useState<boolean>(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [score, setScore] = useState<number>(0);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [showCongratlulation, setShowCongratulation] = useState<boolean>(false);
    const [totalCorrect, setTotalCorrect] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const rows = [];
    const [reward, setReward] = useState<number>(0);

    useBackButtonHandler(navigation, 'Unit', { sectionId: sectionId, sectionName: sectionName });

    async function fetchQuestion() {
        try {
            setIsLoading(true)
            const result = await getUnitQuestions(unitId);
            setQuestions(result.data);
            setTotalScore(result.data.length * 1000);
            const urls = await Promise.all(
                result.data.map(async (q: QuestionDetails) => {
                    let audioUrl = null;
                    let imageUrl = null;
                    let choice1AudioUrl = null;
                    let choice2AudioUrl = null;
                    let choice3AudioUrl = null;
                    let choice4AudioUrl = null;

                    if (q.audioPath != null) {
                        audioUrl = q.audioPath;
                    }

                    if (q.imagePath != null) {
                        imageUrl = q.imagePath;
                    }

                    if (q.choice1AudioPath != null) {
                        choice1AudioUrl = q.choice1AudioPath;
                    }
                    if (q.choice2AudioPath != null) {
                        choice2AudioUrl = q.choice2AudioPath;
                    }
                    if (q.choice3AudioPath != null) {
                        choice3AudioUrl = q.choice3AudioPath;
                    }
                    if (q.choice4AudioPath != null) {
                        choice4AudioUrl = q.choice4AudioPath;
                    }

                    return {
                        id: q.questionID,
                        audioUrl,
                        imageUrl,
                        choice1AudioUrl,
                        choice2AudioUrl,
                        choice3AudioUrl,
                        choice4AudioUrl
                    };
                })
            );

            setFileUrls(urls as FileUrl[]);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchQuestion();
    }, [unitId]);

    useEffect(() => {
        if (timerRunning && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else if (timeLeft === 0) {

            if (currentQuestionIndex < questionList.length - 1) {
                setHearts((prevHearts) => {
                    if (prevHearts <= 1) {
                        setShowGameOver(true);
                        return 0;
                    } else {
                        setDisabledChoiceIndex([]);
                        return prevHearts - 1;
                    }
                });
                if (sound) {
                    sound.stop();
                    sound.release();
                }
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setTimeLeft(15);
            }
            else {
                setShowGameOver(true);
                return;
            }
        }
    }, [timerRunning, timeLeft, currentQuestionIndex, questionList.length]);

    useEffect(() => {
        if (currentQuestionIndex) {
            setIsPlaying(false);
            setMatches([
                questionList[currentQuestionIndex].match1ContentText ?? '',
                questionList[currentQuestionIndex].match2ContentText ?? '',
                questionList[currentQuestionIndex].match3ContentText ?? '',
                questionList[currentQuestionIndex].match4ContentText ?? '',
            ]);
        }
    }, [currentQuestionIndex, questionList]);

    useEffect(() => {
        if (timeLeft <= 5 && timeLeft > 0) {
            Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(rotateAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: -1, duration: 150, useNativeDriver: true }),
                        Animated.timing(rotateAnimation, { toValue: 0, duration: 150, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.timing(scaleAnimation, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleAnimation, { toValue: 1, duration: 150, useNativeDriver: true }),
                    ]),
                ])
            ).start();
        } else {
            rotateAnimation.setValue(0);
            scaleAnimation.setValue(1);
            rotateAnimation.stopAnimation();
            scaleAnimation.stopAnimation();
        }
    }, [timeLeft]);

    const rotation = rotateAnimation.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-40deg', '40deg'],
    });

    const toggleSound = (fileUrl: string | undefined, trackId: number) => {
        if (fileUrl) {
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
        }
    };

    const checkAnswer = (choiceId: number) => {
        const currentQuestion: QuestionDetails = questionList[currentQuestionIndex];
        setTimerRunning(false);
        setIsPlaying(true);
        setSelectedChoice(choiceId);
        if (currentQuestion.questionTypeID === 1 || currentQuestion.questionTypeID === 2) {
            if (choiceId === currentQuestion.correctChoice) {
                const currentScore = Math.round((1000 * timeLeft) / 15);
                const updatedScore = score + currentScore;
                const updatedTotalCorrect = totalCorrect + 1;
                setScore(updatedScore);
                setTotalCorrect(updatedTotalCorrect);

                setIsCorrect(true);
                setTimeout(() => {
                    proceedToNextQuestion(updatedScore, updatedTotalCorrect);
                    setIsCorrect(null);
                    setSelectedChoice(null);
                    setDisabledChoiceIndex([]);
                }, 2000);
            } else {
                setIsCorrect(false);
                setHearts((prevHearts) => {
                    if (prevHearts <= 1) {
                        setShowGameOver(true);
                        return 0;
                    } else {
                        setTimeout(() => {
                            setDisabledChoiceIndex([]);
                            setIsCorrect(null);
                            setSelectedChoice(null);
                            proceedToNextQuestion(score, totalCorrect);
                        }, 2000);
                        return prevHearts - 1;
                    }
                });
            }
        }
    };

    const proceedToNextQuestion = async (updatedScore: number, updatedTotalCorrect: number) => {
        if (currentQuestionIndex < questionList.length - 1) {
            setLoading(false);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setTimeLeft(15);
            setTimerRunning(true);
        } else {
            if (hearts > 0) {
                await saveGameplayLocal(updatedScore, updatedTotalCorrect);
                setShowCongratulation(true);
            }
            else if (hearts == 0) {
                setShowGameOver(true);
            }
        }
    };

    useEffect(() => {
        const fetchPowerUps = async () => {
            const userID = await AsyncStorage.getItem('userID');
            if (userID) {
                const result = await getUserPowerUps(userID);
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
            }
        };

        fetchPowerUps();
    }, []);

    const getImageUrlByItemId = (itemId: number) => {
        const powerUpUrlObj = powerUpUrls.find((powerUp) => powerUp.id === itemId);
        return powerUpUrlObj ? powerUpUrlObj.url : null;
    };

    async function usePowerUp(p: UserPowerUp) {
        if (p.quantity >= 1) {
            const updatedPowerUps = [...powerUps];

            if (p.itemId == 1) {
                if (hearts < 3 || hearts <= 1) {
                    setHearts(hearts + 1);
                    setShowHeartPopup(true);
                    setTimeout(() => {
                        setShowHeartPopup(false);
                    }, 1000);

                    const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                    if (powerUpIndex !== -1) {
                        updatedPowerUps[powerUpIndex].quantity -= 1;
                        setPowerUps(updatedPowerUps);
                    }
                } else {
                    Vibration.vibrate([0, 100, 50, 100]);
                }
            }

            if (p.itemId == 2) {
                if (timerRunning) {
                    setTimerRunning(false);
                    setShowSnowflakes(true);
                    setTimeout(() => {
                        setTimerRunning(true);
                        setShowSnowflakes(false);
                    }, 15000);
                    const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                    if (powerUpIndex !== -1) {
                        updatedPowerUps[powerUpIndex].quantity -= 1;
                        setPowerUps(updatedPowerUps);
                    }
                }
                else {
                    Vibration.vibrate([0, 100, 50, 100]);
                }
            }

            if (p.itemId === 3) {
                const allChoices = [
                    { id: questionList[currentQuestionIndex].choice1, index: 1 },
                    { id: questionList[currentQuestionIndex].choice2, index: 2 },
                    { id: questionList[currentQuestionIndex].choice3, index: 3 },
                    { id: questionList[currentQuestionIndex].choice4, index: 4 },
                ];

                const correctChoice = questionList[currentQuestionIndex].correctChoice;
                const incorrectChoices = allChoices.filter(choice => choice.id !== correctChoice);
                const currentDisabledChoices = disabledChoiceIndex || [];

                if (currentDisabledChoices.length < 2) {
                    const availableChoices = incorrectChoices.filter(choice => !currentDisabledChoices.includes(choice.index));

                    if (availableChoices.length > 0) {
                        const randomChoice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
                        setDisabledChoiceIndex([...currentDisabledChoices, randomChoice.index]);
                    }
                    const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                    if (powerUpIndex !== -1) {
                        updatedPowerUps[powerUpIndex].quantity -= 1;
                        setPowerUps(updatedPowerUps);
                    }
                }
                else {
                    Vibration.vibrate([0, 100, 50, 100]);
                }
            }
            if (p.itemId == 4) {
                const allChoices = [
                    { id: questionList[currentQuestionIndex].choice1, index: 1 },
                    { id: questionList[currentQuestionIndex].choice2, index: 2 },
                    { id: questionList[currentQuestionIndex].choice3, index: 3 },
                    { id: questionList[currentQuestionIndex].choice4, index: 4 },
                ];
                const correctChoice = questionList[currentQuestionIndex].correctChoice;
                const incorrectChoices = allChoices.filter(choice => choice.id !== correctChoice);

                const currentDisabledChoices = disabledChoiceIndex || [];

                if (currentDisabledChoices.length < 1) {
                    const shuffledIncorrectChoices = incorrectChoices.sort(() => 0.5 - Math.random());
                    const availableChoices = shuffledIncorrectChoices.filter(choice => !currentDisabledChoices.includes(choice.index));
                    const choicesToDisable = availableChoices.slice(0, 2).map(choice => choice.index);

                    setDisabledChoiceIndex([...currentDisabledChoices, ...choicesToDisable]);

                    const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                    if (powerUpIndex !== -1) {
                        updatedPowerUps[powerUpIndex].quantity -= 1;
                        setPowerUps(updatedPowerUps);
                    }
                }
                else {
                    Vibration.vibrate([0, 100, 50, 100]);
                }
            }
            if (p.itemId == 5) {
                setClairVoyance(true);
                setCorrectAnswer(true);
                const powerUpIndex = updatedPowerUps.findIndex(powerUp => powerUp.itemId === p.itemId);
                if (powerUpIndex !== -1) {
                    updatedPowerUps[powerUpIndex].quantity -= 1;
                    setPowerUps(updatedPowerUps);
                }
            }
        } else {
            // Add toggle music here like Dota 2 Memorp
            Vibration.vibrate([0, 100, 50, 100]);
        }
    }

    async function clairVoyageDone() {
        setClairVoyance(false);
        setCorrectAnswer(false);
    }

    async function submit(items: Item[]) {
        console.log(items)
        setTimerRunning(false);
        setIsPlaying(true);
        setLoading(true);
        const currentQuestion = questionList[currentQuestionIndex];
        console.log(currentQuestion)

        const expectedMatches = [
            currentQuestion.match1,
            currentQuestion.match2,
            currentQuestion.match3,
            currentQuestion.match4,
        ];
        console.log(expectedMatches)

        const count = items.reduce((acc, item, index) => {
            return acc + (expectedMatches[index] === item.id ? 1 : 0);
        }, 0);

        if (count === 4) {
            setIsCorrect(true);
            const currentScore = Math.round((1000 * timeLeft) / 15);
            const updatedScore = score + currentScore;
            const updatedTotalCorrect = totalCorrect + 1;
            setScore(updatedScore);
            setTotalCorrect(updatedTotalCorrect);
            setCorrectAnswer(true);
            setTimeout(() => {
                proceedToNextQuestion(updatedScore, updatedTotalCorrect);
                setCorrectAnswer(false);
                setIsCorrect(null);
                setSelectedChoice(null);
                setDisabledChoiceIndex([]);
            }, 2000);
        } else {
            setIsCorrect(false);
            setCorrectAnswer(true);
            setHearts((prevHearts) => {
                if (prevHearts <= 1) {
                    setShowGameOver(true);
                    return 0;
                } else {
                    setTimeout(() => {
                        proceedToNextQuestion(score, totalCorrect);
                        setDisabledChoiceIndex([]);
                        setCorrectAnswer(false);
                        setIsCorrect(null);
                        setSelectedChoice(null);
                    }, 2000);
                    return prevHearts - 1;
                }
            });
        }
    }

    function onRestart() {
        setCurrentQuestionIndex(0);
        setTimeLeft(15);
        setHearts(3);
        setScore(0);
        setTotalCorrect(0);
        setDisabledChoiceIndex([]);
        setIsCorrect(null);
        setSelectedChoice(null);
        setShowGameOver(false);
        setShowCongratulation(false);
        setTimerRunning(true);
        fetchQuestion();
    }

    const closeModal = () => {
        setModalVisible(false);
    };

    const openModal = () => {
        setModalVisible(true);
    };

    // Divide powerUps into rows of 3 items each
    for (let i = 0; i < powerUps.length; i += 3) {
        rows.push(powerUps.slice(i, i + 3));
    }


    function onHome() {
        navigation.navigate('Unit', { sectionId, sectionName })
    }

    async function saveGameplayLocal(finalScore: number, finalTotalCorrect: number) {
        const userID = await AsyncStorage.getItem('userID');
        if (userID) {
            let newGameplayPowerUp: PowerUpGameplay[] = [];
            powerUps.forEach(p => {
                let newGP: PowerUpGameplay =
                {
                    itemId: p.itemId,
                    quantity: p.quantity
                }
                newGameplayPowerUp.push(newGP);
            });

            let newGamePlay: GamePlayDto =
            {
                userId: userID,
                unitId: unitId,
                totalCorrectAnswer: finalTotalCorrect,
                totalScore: finalScore,
                powerUps: newGameplayPowerUp
            };
            const result = await saveGamePlay(newGamePlay)
            setReward(result.data)
            console.log(result.data)
        }
    }
    const radius = 24;
    const strokeWidth = 4;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / 15;
    const strokeDashoffset = circumference * (1 - progress);
    return (
        <SafeAreaView className="flex-1">

            {showCongratlulation && (<Congratulations score={score} onHome={onHome} onRestart={onRestart} coins={reward} isVisible={showCongratlulation} />)}
            {!showGameOver ? (
                <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 items-center">
                    {isLoading ? (
                        <Loader isVisible={isLoading} />
                    ) : (
                        <>
                            {showSnowflakes && (<SnowflakeComponent />)}
                            {questionList.length > 0 && (
                                <View className="mt-6 mb-10">
                                    <View className="flex-1 items-center justify-center w-[85%] mx-8">
                                        <View className="relative justify-center items-center mb-2">
                                            {/* Play Box in the Background */}
                                            <LinearGradient
                                                colors={['#6addd0', '#f7c188']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className="border border-white rounded-3xl py-2 px-[24%] min-w-screen mx-12 items-center absolute top-0 mb-4"
                                                style={{ zIndex: 1 }} // Lower zIndex so it's in the background
                                            >
                                                <View className="flex-row justify-between items-center gap-x-6">
                                                    <TouchableOpacity onPress={() => navigation.goBack()}>
                                                        <BackIcon className="h-6 w-6 text-white" />
                                                    </TouchableOpacity>
                                                    <Text className="text-white text-3xl font-black uppercase">Section {sectionName}</Text>
                                                    <View>
                                                        {hearts > 0 && <HeartComponent hearts={hearts} />}
                                                    </View>
                                                </View>
                                                {/* <Text className="text-white text-3xl font-black uppercase">Unit 1</Text> */}
                                                {/* Audio or Image Content */}
                                                {fileUrls[currentQuestionIndex]?.audioUrl ? (
                                                    <View className="items-center justify-center rounded-xl overflow-hidden mt-4">
                                                        <TouchableOpacity
                                                            onPress={() => toggleSound(fileUrls[currentQuestionIndex].audioUrl, questionList[currentQuestionIndex].questionID)}
                                                            disabled={isPlaying}
                                                            style={{ opacity: isPlaying ? 0.5 : 1 }}
                                                        >
                                                            <View className="border border-black bg-white rounded-full p-4 items-center">
                                                                <PlayIcon className="h-8 w-8 text-black" />
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : fileUrls[currentQuestionIndex]?.imageUrl ? (
                                                    <View className="items-center justify-center rounded-xl overflow-hidden">
                                                        <Image
                                                            source={{ uri: fileUrls[currentQuestionIndex]?.imageUrl }}
                                                            className="w-36 h-36 rounded-xl"
                                                            resizeMode="contain"
                                                        />
                                                    </View>
                                                ) : (
                                                    // Invisible placeholder if no audio or image
                                                    <View style={{ width: 56, height: 56, opacity: 0 }} />
                                                )}
                                            </LinearGradient>

                                            {/* Question Text with Timer on Top */}
                                            <View
                                                className="items-center mb-2 w-[95%] bg-white py-4 px-6 rounded-2xl"
                                                style={{ zIndex: 2, marginTop: 170 }} // Higher zIndex for foreground
                                            >
                                                {/* Timer Circle */}
                                                <View className="absolute -top-8 bg-white p-1 rounded-full items-center">
                                                    <Svg height="56" width="56" viewBox="0 0 56 56">
                                                        <Circle
                                                            cx="28"
                                                            cy="28"
                                                            r={radius}
                                                            stroke="#d3d3d3"
                                                            strokeWidth={strokeWidth}
                                                            fill="none"
                                                        />
                                                        <Circle
                                                            cx="28"
                                                            cy="28"
                                                            r={radius}
                                                            stroke="#4CAF50" // Green color for progress
                                                            strokeWidth={strokeWidth}
                                                            fill="none"
                                                            strokeDasharray={circumference}
                                                            strokeDashoffset={strokeDashoffset}
                                                            rotation="-90"
                                                            origin="28, 28"
                                                        />
                                                    </Svg>
                                                    <Text className="absolute text-center text-green-500 font-bold text-xl top-[18px]">{timeLeft}</Text>
                                                </View>

                                                <Text className="text-black text-center font-bold text-lg mt-4">
                                                    Question {currentQuestionIndex + 1}/{questionList.length}
                                                </Text>
                                                <Text className="text-black text-center mt-2 text-lg">
                                                    {questionList[currentQuestionIndex].questionText}
                                                </Text>
                                            </View>
                                        </View>

                                        {(questionList[currentQuestionIndex].questionTypeID === 1 || questionList[currentQuestionIndex].questionTypeID === 2) && (
                                            <View className="mt-4 mb-4 items-center w-[85%]">
                                                {!disabledChoiceIndex.includes(1) && (
                                                    <View className="flex-row items-center py-2 px-4 rounded-2xl mb-4 w-[80%] bg-white">

                                                        <TouchableOpacity
                                                            onPress={() => checkAnswer(questionList[currentQuestionIndex].choice1 ?? 0)}
                                                            className={`flex-1 py-2 px-3 border border-1 rounded-lg 
        ${selectedChoice !== null && questionList[currentQuestionIndex].choice1 === questionList[currentQuestionIndex].correctChoice && selectedChoice !== questionList[currentQuestionIndex].choice1
                                                                    ? 'bg-green-600 border-green-600'
                                                                    : selectedChoice === questionList[currentQuestionIndex].choice1
                                                                        ? isCorrect
                                                                            ? 'bg-green-600 border-green-600'
                                                                            : 'bg-[#FF0000] border-[#FF0000]'
                                                                        : 'border-white'} 
        ${disabledChoiceIndex.includes(1) || selectedChoice !== null ? 'opacity-50' : ''}`}
                                                            disabled={selectedChoice !== null || disabledChoiceIndex.includes(1)}
                                                        >
                                                            {(questionList[currentQuestionIndex].questionTypeID === 2) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(1) ? 'text-gray-400' : 'text-black'}`}>
                                                                    {questionList[currentQuestionIndex].choice1ContentText}
                                                                </Text>
                                                            )}
                                                            {(questionList[currentQuestionIndex].questionTypeID === 1) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(1) ? 'text-gray-400' : 'text-black'}`}>
                                                                    {questionList[currentQuestionIndex].choice1EnglishTranslation}
                                                                </Text>
                                                            )}
                                                        </TouchableOpacity>
                                                        {fileUrls[currentQuestionIndex]?.choice1AudioUrl && questionList[currentQuestionIndex].choice1AudioPath !== null && questionList[currentQuestionIndex].questionTypeID === 2 && (
                                                            <TouchableOpacity onPress={() => { toggleSound(fileUrls[currentQuestionIndex].choice1AudioUrl, questionList[currentQuestionIndex].questionID) }}
                                                                disabled={isPlaying}
                                                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                                                <SpeakerIcon className="h-8 w-8 ml-2 text-black" />
                                                            </TouchableOpacity>
                                                        )}

                                                    </View>
                                                )}
                                                {!disabledChoiceIndex.includes(2) && (
                                                    <View className="flex-row items-center py-2 px-4 rounded-2xl mb-4 w-[80%] bg-white">
                                                        <TouchableOpacity
                                                            onPress={() => checkAnswer(questionList[currentQuestionIndex].choice2 ?? 0)}
                                                            className={`flex-1 py-2 px-3 border border-1 rounded-lg 
                                                                ${selectedChoice !== null && questionList[currentQuestionIndex].choice2 === questionList[currentQuestionIndex].correctChoice && selectedChoice !== questionList[currentQuestionIndex].choice2
                                                                    ? 'bg-green-600 border-green-600'
                                                                    : selectedChoice === questionList[currentQuestionIndex].choice2
                                                                        ? isCorrect
                                                                            ? 'bg-green-600 border-green-600'
                                                                            : 'bg-[#FF0000] border-[#FF0000]'
                                                                        : 'border-white'} 
                                                                ${disabledChoiceIndex.includes(2) || selectedChoice !== null ? 'opacity-50' : ''}`}
                                                            disabled={selectedChoice !== null || disabledChoiceIndex.includes(2)}
                                                        >

                                                            {(questionList[currentQuestionIndex].questionTypeID === 2) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(2) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice2ContentText}</Text>
                                                            )}
                                                            {(questionList[currentQuestionIndex].questionTypeID === 1) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(2) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice2EnglishTranslation}</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                        {fileUrls[currentQuestionIndex]?.choice2AudioUrl && questionList[currentQuestionIndex].choice2AudioPath !== null && questionList[currentQuestionIndex].questionTypeID === 2 && (
                                                            <TouchableOpacity onPress={() => { toggleSound(fileUrls[currentQuestionIndex].choice2AudioUrl, questionList[currentQuestionIndex].questionID) }}
                                                                disabled={isPlaying}
                                                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                                                <SpeakerIcon className="h-8 w-8 ml-2 text-black" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                                {!disabledChoiceIndex.includes(3) && (
                                                    <View className="flex-row items-center py-2 px-4 rounded-2xl mb-4 w-[80%] bg-white">
                                                        <TouchableOpacity
                                                            onPress={() => checkAnswer(questionList[currentQuestionIndex].choice3 ?? 0)}
                                                            className={`flex-1 py-2 px-3 border border-1 rounded-lg 
                                                                ${selectedChoice !== null && questionList[currentQuestionIndex].choice3 === questionList[currentQuestionIndex].correctChoice && selectedChoice !== questionList[currentQuestionIndex].choice3
                                                                    ? 'bg-green-600 border-green-600'
                                                                    : selectedChoice === questionList[currentQuestionIndex].choice3
                                                                        ? isCorrect
                                                                            ? 'bg-green-600 border-green-600'
                                                                            : 'bg-[#FF0000] border-[#FF0000]'
                                                                        : 'border-white'} 
                                                                ${disabledChoiceIndex.includes(3) || selectedChoice !== null ? 'opacity-50' : ''}`}
                                                            disabled={selectedChoice !== null || disabledChoiceIndex.includes(3)}
                                                        >

                                                            {(questionList[currentQuestionIndex].questionTypeID === 2) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(3) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice3ContentText}</Text>
                                                            )}
                                                            {(questionList[currentQuestionIndex].questionTypeID === 1) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(3) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice3EnglishTranslation}</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                        {fileUrls[currentQuestionIndex]?.choice3AudioUrl && questionList[currentQuestionIndex].choice3AudioPath !== null && questionList[currentQuestionIndex].questionTypeID === 2 && (
                                                            <TouchableOpacity onPress={() => { toggleSound(fileUrls[currentQuestionIndex].choice3AudioUrl, questionList[currentQuestionIndex].questionID) }}
                                                                disabled={isPlaying}
                                                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                                                <SpeakerIcon className="h-8 w-8 ml-2 text-black" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                                {!disabledChoiceIndex.includes(4) && (
                                                    <View className="flex-row items-center py-2 px-4 rounded-2xl mb-4 w-[80%] bg-white">
                                                        <TouchableOpacity
                                                            onPress={() => checkAnswer(questionList[currentQuestionIndex].choice4 ?? 0)}
                                                            className={`flex-1 py-2 px-3 border border-1 rounded-lg 
                                                                ${selectedChoice !== null && questionList[currentQuestionIndex].choice4 === questionList[currentQuestionIndex].correctChoice && selectedChoice !== questionList[currentQuestionIndex].choice4
                                                                    ? 'bg-green-600 border-green-600'
                                                                    : selectedChoice === questionList[currentQuestionIndex].choice4
                                                                        ? isCorrect
                                                                            ? 'bg-green-600 border-green-600'
                                                                            : 'bg-[#FF0000] border-[#FF0000]'
                                                                        : 'border-white'} 
                                                                ${disabledChoiceIndex.includes(4) || selectedChoice !== null ? 'opacity-50' : ''}`}
                                                            disabled={selectedChoice !== null || disabledChoiceIndex.includes(4)}
                                                        >

                                                            {(questionList[currentQuestionIndex].questionTypeID === 2) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(4) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice4ContentText}</Text>
                                                            )}
                                                            {(questionList[currentQuestionIndex].questionTypeID === 1) && (
                                                                <Text className={`items-start text-base font-bold ${disabledChoiceIndex.includes(4) ? 'text-gray-400' : 'text-black'}`}>{questionList[currentQuestionIndex].choice4EnglishTranslation}</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                        {fileUrls[currentQuestionIndex]?.choice4AudioUrl && questionList[currentQuestionIndex].choice4AudioPath !== null && questionList[currentQuestionIndex].questionTypeID === 2 && (
                                                            <TouchableOpacity onPress={() => { toggleSound(fileUrls[currentQuestionIndex].choice4AudioUrl, questionList[currentQuestionIndex].questionID) }}
                                                                disabled={isPlaying}
                                                                style={{ opacity: isPlaying ? 0.5 : 1 }}>
                                                                <SpeakerIcon className="h-8 w-8 ml-2 text-black" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {(questionList[currentQuestionIndex].questionTypeID === 3) && (
                                            <View className="flex-1">
                                                <MatchComponent
                                                    key={`match-${currentQuestionIndex}-3`}
                                                    showCorrectAnswer={showCorrectAnswer}
                                                    clairVoyageDone={clairVoyageDone}
                                                    questionList={questionList}
                                                    clairVoyanceUsed={clairVoyanceUsed}
                                                    currentQuestionIndex={currentQuestionIndex}
                                                    draggableItems={[
                                                        {
                                                            id: questionList[currentQuestionIndex].match1 ?? 0,
                                                            name: questionList[currentQuestionIndex].match1ContentText ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match2 ?? 0,
                                                            name: questionList[currentQuestionIndex].match2ContentText ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match3 ?? 0,
                                                            name: questionList[currentQuestionIndex].match3ContentText ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match4 ?? 0,
                                                            name: questionList[currentQuestionIndex].match4ContentText ?? ''
                                                        }
                                                    ]}
                                                    fixedItems={[
                                                        questionList[currentQuestionIndex].word1EnglishTranslation ?? '',
                                                        questionList[currentQuestionIndex].word2EnglishTranslation ?? '',
                                                        questionList[currentQuestionIndex].word3EnglishTranslation ?? '',
                                                        questionList[currentQuestionIndex].word4EnglishTranslation ?? ''
                                                    ]}
                                                    isLoading={isLoading}
                                                    onSubmit={submit}
                                                />
                                            </View>

                                        )}

                                        {(questionList[currentQuestionIndex].questionTypeID === 4) && (
                                            <View className="flex-1">
                                                <MatchComponent
                                                    key={`match-${currentQuestionIndex}-4`}
                                                    showCorrectAnswer={showCorrectAnswer}
                                                    questionList={questionList}
                                                    clairVoyageDone={clairVoyageDone}
                                                    clairVoyanceUsed={clairVoyanceUsed}
                                                    currentQuestionIndex={currentQuestionIndex}
                                                    draggableItems={[
                                                        {
                                                            id: questionList[currentQuestionIndex].match1 ?? 0,
                                                            name: questionList[currentQuestionIndex].match1EnglishTranslation ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match2 ?? 0,
                                                            name: questionList[currentQuestionIndex].match2EnglishTranslation ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match3 ?? 0,
                                                            name: questionList[currentQuestionIndex].match3EnglishTranslation ?? ''
                                                        },
                                                        {
                                                            id: questionList[currentQuestionIndex].match4 ?? 0,
                                                            name: questionList[currentQuestionIndex].match4EnglishTranslation ?? ''
                                                        }
                                                    ]}
                                                    fixedItems={[
                                                        questionList[currentQuestionIndex].word1ContentText ?? '',
                                                        questionList[currentQuestionIndex].word2ContentText ?? '',
                                                        questionList[currentQuestionIndex].word3ContentText ?? '',
                                                        questionList[currentQuestionIndex].word4ContentText ?? ''
                                                    ]}
                                                    onSubmit={submit}
                                                    isLoading={isLoading}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            <View className="absolute bottom-5 mt-2">
                                <TouchableOpacity onPress={() => openModal()}>
                                    <View className="items-center">
                                        <View className="border-2 border-white rounded-full">
                                            <BagIcon className="text-white h-10 w-10" />
                                        </View>
                                        <Text className="text-white text-center text-md font-black">Power Ups</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Modal
                                transparent={true}
                                visible={showHeartPopup}
                                animationType="fade"
                                onRequestClose={() => setShowHeartPopup(false)}
                            >
                                <View className="flex-1 justify-center items-center bg-black/40">
                                    <View className="p-6 rounded-full shadow-lg scale-105">
                                        <HeartIcon className="h-12 w-12 text-red-500" />
                                    </View>
                                </View>
                            </Modal>

                            <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={closeModal}>
                                <TouchableOpacity className="flex-1 justify-end"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                                    onPress={closeModal}>
                                    <View className=" rounded-t-xl w-full">
                                        <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl">
                                            <View className="p-8 justify-center items-center">
                                                <Text className="text-3xl text-black mb-2 text-center font-black">Power Ups</Text>
                                                <View className="flex-col mt-4 items-center">
                                                    {rows.map((row, rowIndex) => (
                                                        <View key={rowIndex} className="flex-row justify-center items-center mt-2">
                                                            {row.map((powerUp, index) => {
                                                                const imageUrl = getImageUrlByItemId(powerUp.itemId);

                                                                const isEnabled = (questionList[currentQuestionIndex].questionTypeID === 1 || questionList[currentQuestionIndex].questionTypeID === 2)
                                                                    ? powerUp.itemId !== 5
                                                                    : (questionList[currentQuestionIndex].questionTypeID === 3 || questionList[currentQuestionIndex].questionTypeID === 4)
                                                                        ? (powerUp.itemId === 1 || powerUp.itemId === 2 || powerUp.itemId === 5)
                                                                        : true;

                                                                return (
                                                                    <TouchableOpacity
                                                                        key={index}
                                                                        onPress={() => usePowerUp(powerUp)}
                                                                        disabled={!isEnabled || selectedChoice !== null}
                                                                        className="flex-1"
                                                                    >
                                                                        <View className="flex-col items-center justify-center mx-2">
                                                                            <View className="py-2 px-1 items-center relative">
                                                                                {imageUrl ? (
                                                                                    <Image
                                                                                        source={{ uri: imageUrl }}
                                                                                        className="w-16 h-16"
                                                                                    />
                                                                                ) : null}

                                                                                <Text className="text-center text-[10px] text-black font-bold bg-gray-200 p-1 rounded-full absolute right-1 bottom-1 z-10">
                                                                                    {powerUp.quantity}x
                                                                                </Text>

                                                                                {!isEnabled && (
                                                                                    <View className="absolute inset-0 bg-gray-500 opacity-50 justify-center mt-2 items-center rounded-full p-5 z-0">
                                                                                        <Text className="text-red-600 font-bold text-xl">X</Text>
                                                                                    </View>
                                                                                )}
                                                                            </View>
                                                                            <Text className="text-center text-black text-md font-bold mt-1 w-[80%]">{powerUp.name}</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                );
                                                            })}
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </Modal>
                        </>
                    )}
                </LinearGradient>
            ) :
                (<GameOver score={score} onHome={onHome} onRestart={onRestart} />)}
        </SafeAreaView>
    )
};
export default UnitContent;
