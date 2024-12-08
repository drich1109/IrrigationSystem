
import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView, Modal, BackHandler, TouchableWithoutFeedback } from 'react-native';
import Menu from '../components/Menu';
import Svg, { Circle, Path } from 'react-native-svg';
import { RootStackParamList, UnitScreenNavigationProp } from '../../types';
import { claimReward, getDailyTasks, getNotifications, getSections, getUserDetails, getUserImageUrl, getUserLanguage, updateNotifications } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyTaskDto, Languages, NotificationsDto, SectionDetails, UserProfileDto } from './type';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import LeaderboardIcon from '../assets/svg/LeaderboardIcon';
import DailyTaskIcon from '../assets/svg/DailyTaskIcon';
import NotificationIcon from '../assets/svg/NotificationIcon';
import ProfileIcon from '../assets/svg/ProfileIcon';
import LockIcon from '../assets/svg/LockIcon';
import CheckIcon from '../assets/svg/CheckIcon';
import LoaderModal from '../components/LoaderModal';
import * as Animatable from 'react-native-animatable';

type Props = StackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [leaderBoardVisible, setLeaderBoardVisible] = useState(false);
  const [dailyTaskVisible, setdailyTaskVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionDetails | null>(null);
  const [activeScreen] = useState<keyof RootStackParamList | null>('Dashboard');
  const [languageDetails, setLanguageDetails] = useState<Languages>();
  const [userDetails, setUserDetails] = useState<UserProfileDto>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const unit = useNavigation<UnitScreenNavigationProp>();
  const [sections, setSections] = useState<SectionDetails[]>([]);
  const [dailyTasks, setdailyTasks] = useState<DailyTaskDto[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<{ [key: number]: boolean }>({});
  const [notifications, setNotifications] = useState<NotificationsDto[]>([]);
  const [notificationCount, setNotifCount] = useState<number>(0);
  const [userId, setUserID] = useState<string>("");
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [secWord, setSecWord] = useState<string>("");
  const [notifWord, setNotifWord] = useState<string>("");
  const [taskWord, setTaskWord] = useState<string>("");
  const [letWord, setLetWord] = useState<string>("");
  const [showSection, setShowSection] = useState<boolean>(true);
  const [showNotif, setShowNotif] = useState<boolean>(true);
  const [showTask, setShowTask] = useState<boolean>(true);
  const [showLet, setShowLet] = useState<boolean>(true);
  const toggleDescription = (taskID: number) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskID]: !prev[taskID],
    }));
  };

  const handleBackPress = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, []);



  const fetchUserData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      const languageID = await AsyncStorage.getItem('languageId');
      console.log(languageID)
      switch (languageID) {
        case "1": setSecWord("Seksyon"); break;
        case "2": setSecWord("Seksyon"); break;
        case "3": setSecWord("Seksyon"); break;
        default:
          setSecWord("Section");
          break;
      }
      switch (languageID) {
        case "1": setNotifWord("Mga Pahibalo"); break;
        case "2": setNotifWord("Abiso"); break;
        case "3": setNotifWord("Mga Pahibaro"); break;
        default:
          setNotifWord("Notification");
          break;
      }
      switch (languageID) {
        case "1": setTaskWord("Buluhaton Sa Adlaw"); break;
        case "2": setTaskWord("Buluhaton Sa Adlaw"); break;
        case "3": setTaskWord("Buruhaton Sa Adlaw"); break;
        default:
          setTaskWord("Daily Task");
          break;
      }
      switch (languageID) {
        case "1": setLetWord("Sugdan Nato"); break;
        case "2": setLetWord("Magsugod Kita"); break;
        case "3": setLetWord("Magtikang Kita"); break;
        default:
          setLetWord("Let's Begin");
          break;
      }
      setUserID(userID ?? "");
      const result = await getUserLanguage(Number(userID));
      setLanguageDetails(result.data);
      const userResult = await getUserDetails(Number(userID));
      setUserDetails(userResult.data);
      const sectionResult = await getSections(Number(userID), result.data.languageID);

      setSections(sectionResult.data)
      if (userResult.data.imagePath) {
        setFileUrl(userResult.data.imagePath);
      }

      const dailyTaskResult = await getDailyTasks(Number(userID));
      console.log(dailyTaskResult)
      setdailyTasks(dailyTaskResult.data);

      const notifResult = await getNotifications(Number(userID));
      setNotifCount(notifResult.totalCount || 0);
      setNotifications(notifResult.data);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Toggle between 'Dictionary' and 'dictWord' every 3 seconds
    const interval = setInterval(() => {
      setShowSection((prev) => !prev);
      setShowNotif((prev) => !prev);
      setShowTask((prev) => !prev);
      setShowLet((prev) => !prev);
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', fetchUserData);
    return unsubscribe;
  }, [navigation]);

  const navigateToUnit = () => {
    if (currentSection) {
      const sectionId = currentSection.sectionId
      const sectionName = currentSection.sectionNumber.toString();
      unit.navigate('Unit', { sectionId, sectionName });
    }
  };

  const navigateToLeaderboard = () => {
    navigation.navigate("Leaderboard");
  };


  const openModal = (section: SectionDetails) => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentSection(null);
  };

  const opendailyTask = () => {
    setdailyTaskVisible(true);
  };

  const closedailyTask = () => {
    setdailyTaskVisible(false);
  };

  const closeLeaderBoard = () => {
    setLeaderBoardVisible(false);
  };

  const openNotification = async () => {
    setNotificationVisible(true);
  };

  const closeNotification = async () => {
    await updateNotifications(userId);
    setNotificationVisible(false);
    fetchUserData();
  };

  async function claimRewardDashboard(taskId: number) {
    setIsBuying(true);
    setLoadingMessage("Please wait...");
    await claimReward(userId, taskId);
    fetchUserData();
    setIsBuying(false);
  }

  const getTextSizeClass = (title: string) => {
    const length = title.length;
    if (length > 50) {
      return 'text-sm';
    } else if (length > 30) {
      return 'text-lg';
    } else {
      return 'text-3xl';
    }
  };

  const circleSize = 100;

  return (
    <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 resize-cover justify-center">
      <View className="flex-row justify-between p-2 items-center">
        <TouchableOpacity className="w-10 h-10 rounded-full overflow-hidden justify-center items-center" onPress={() => navigation.navigate('UserProfile')}>
          {fileUrl ? (
            <Image
              source={{ uri: fileUrl }}
              className="w-10 h-10"
            />
          ) : (
            <ProfileIcon className="text-white h-10 w-10" />
          )}
        </TouchableOpacity>
        <View className="flex-row items-center">
          <TouchableOpacity className="" onPress={navigateToLeaderboard}>
            <LeaderboardIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-1" onPress={opendailyTask}>
            <DailyTaskIcon className="h-8 w-8 text-white" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-1" onPress={openNotification}>
            <View style={{ position: 'relative' }}>
              <NotificationIcon className="h-8 w-8 text-white" />
              {notificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: 'red',
                    borderRadius: 8,
                    paddingHorizontal: 4,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }} className="mb-8" showsVerticalScrollIndicator={false}>
        {languageDetails !== undefined && (
          <View className="items-center mb-5">
            <Text className="text-4xl font-black text-white">{languageDetails.native_name}</Text>
          </View>
        )}
        {sections.map((section, index) => (
          <View key={index} className="mb-5">
            <View
              className="flex-row items-center justify-between rounded-2xl py-4 px-8"
              style={{
                backgroundColor: section.isAccessible ? (index % 2 === 0 ? '#6addd0' : '#f7c188') : '#A9A9A9', // Darker background if not accessible
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 6,
              }}
            >
              <View className="flex-col gap-y-2 max-w-[70%]">
                <Animatable.Text
                        animation="slideInDown" // Slide in from above
                        duration={500}         // Animation duration (500ms)
                        key={showSection ? 'Section' : 'secWord'} // Key ensures animation reruns on text change
                        className="text-lg text-white font-bold"
                      >
                        {showSection ? 'Section' : secWord} {section.sectionNumber}
                      </Animatable.Text>
                <Text
                  className={`font-black text-white ${getTextSizeClass(section.title)} truncate`}
                >
                  {section.title}
                </Text>
                {/*  {!section.isAccessible && (
                  <Text className="text-red-500 font-bold">Locked</Text> // Indicate that the section is locked
                )} */}
                <TouchableOpacity onPress={() => openModal(section)} disabled={!section.isAccessible}>
                  <View className={`rounded-2xl mt-2 w-36 px-10 py-2 items-center justify-center flex-row ${section.isAccessible ? 'bg-white' : 'bg-gray-300'}`}>
                    {!section.isAccessible && (
                      <LockIcon className="text-gray-500 h-4 w-4" />
                    )}
                    <Text className={`text-lg ${section.isAccessible ? 'text-black' : 'text-gray-500'} font-bold`}>
                      {section.isAccessible ? 'Play' : 'Locked'}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
              <View className="flex justify-center items-center w-[20%]" style={{ height: circleSize }}>
                <Svg width={circleSize} height={circleSize}>
                  <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={(circleSize / 2) - 5}
                    stroke="#AEAEAE"
                    strokeWidth="5"
                    fill="rgba(0, 0, 0, 0.1)"
                  />
                  <Circle
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    r={(circleSize / 2) - 5}
                    stroke="#ffffff"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${((Math.round((section.completedUnitCount / section.unitCount) * 100)) / 100) * 2 * Math.PI * ((circleSize / 2) - 5)} ${2 * Math.PI * ((circleSize / 2) - 5) - ((Math.round((section.completedUnitCount / section.unitCount) * 100)) / 100) * 2 * Math.PI * ((circleSize / 2) - 5)}`}
                    strokeDashoffset={(Math.PI / 2) * ((circleSize / 2) - 5)}
                  />
                </Svg>
                <Text className="text-lg text-white font-black absolute">
                  {Math.round((section.completedUnitCount / section.unitCount) * 100) || 0}%
                </Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>


      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onPress={closeModal}>
          <View className="rounded-t-xl w-full" >
            <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-t-xl" >
              <View className="p-8">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-md font-medium text-black">SECTION {currentSection?.sectionNumber}</Text>
                  <View className="flex-row gap-x-1">
                    <Text className="text-md font-medium text-black ml-4s">{currentSection?.unitCount} Units</Text>

                  </View>
                </View>

                <Text className="text-2xl font-bold text-black mb-2 text-center uppercase">{currentSection?.title}</Text>
                <Text className="text-base text-black text-justify mb-5 text-center">
                  {currentSection?.description}
                </Text>
                <View className="pb-4 px-10">
                  <TouchableOpacity onPress={() => { closeModal(); navigateToUnit() }}>
                    <LinearGradient colors={['#6addd0', '#f7c188']} start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }} className="bg-gray-600 py-2 px-14 rounded-2xl self-center">
                      <Animatable.Text
                        animation="slideInDown" // Slide in from above
                        duration={500}         // Animation duration (500ms)
                        key={showLet ? 'Daily Task' : 'letWord'} // Key ensures animation reruns on text change
                        className="text-lg text-white text-center font-bold"
                      >
                        {showLet ? 'Let\'s Begin' : letWord}
                      </Animatable.Text>
                    </LinearGradient>

                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={dailyTaskVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closedailyTask}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onPress={closedailyTask}
        >
          <View className="justify-center items-center bg-opacity-50">
            <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-xl">

              <View className="bg-white rounded-2xl py-3 px-6 shadow-lg" style={{ maxHeight: 360 }}>
                <Animatable.Text
                  animation="slideInDown" // Slide in from above
                  duration={500}         // Animation duration (500ms)
                  key={showTask ? 'Daily Task' : 'taskWord'} // Key ensures animation reruns on text change
                  className="text-xl font-bold mt-2 mb-4 text-black text-center"
                >
                  {showTask ? 'Daily Task' : taskWord}
                </Animatable.Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <TouchableWithoutFeedback>
                    <View>
                      {dailyTasks.length > 0 ? (
                        dailyTasks.map((task) => (
                          <LinearGradient
                            key={task.taskID}
                            colors={task.isClaimed ? ['#A9A9A9', '#A9A9A9'] : ['#f7c188', '#6addd0']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="flex-row items-center mb-4 py-3 px-4 justify-between rounded-xl"
                          >
                            <View className="flex-row items-center">
                              <View className="w-4 h-4 bg-gray-100 rounded-md justify-center items-center mr-4">
                                {task.isCompleted == true && (
                                  <CheckIcon className="text-black w-4 h-4" />
                                )}
                              </View>
                              <View>
                                <Text className="text-md text-gray-700 font-bold">{task.taskName}</Text>
                                <TouchableOpacity
                                  onPress={() => toggleDescription(task.taskID)}
                                  className="flex-row items-center"
                                >
                                  <Text className="text-md text-gray-700 font-bold">Description</Text>
                                  <Svg
                                    className="ml-1 w-4 h-4"
                                    style={{ transform: [{ rotate: expandedTasks[task.taskID] ? '90deg' : '0deg' }] }}
                                    viewBox="0 0 24 24"
                                  >
                                    <Path fill="#000000" d="M7 10l5 5 5-5H7z" />
                                  </Svg>
                                </TouchableOpacity>
                                {expandedTasks[task.taskID] && (
                                  <Text className="text-sm text-gray-600 mt-1 w-24">
                                    {task.taskDescription}
                                  </Text>
                                )}
                                <View className="flex-row items-center">
                                  <Text className="text-md text-gray-700 font-bold">Reward:</Text>
                                  <Text className="text-md text-gray-700"> {task.rewardcoins}</Text>
                                </View>
                              </View>
                            </View>

                            <TouchableOpacity
                              disabled={!task.isCompleted}
                              onPress={() => claimRewardDashboard(task.taskID)}
                              className={`px-2 py-1 rounded-full ml-6 ${task.isCompleted ? 'bg-[#E8C58F]' : 'bg-gray-400'
                                }`}
                            >
                              <Text
                                className={`text-xs text-white ${task.isClaimed ? 'line-through decoration-red-500' : ''
                                  }`}
                              >
                                Claim
                              </Text>
                            </TouchableOpacity>
                          </LinearGradient>
                        ))
                      ) : (
                        <Text className="text-center text-gray-500 mt-4">No daily tasks today.</Text>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>


      <Modal
        visible={notificationVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeNotification}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onPress={closeNotification}
        >
          <View className="flex-1 justify-center items-center bg-opacity-50">
            <TouchableOpacity activeOpacity={1} className="bg-[#FAF9F6] rounded-xl ">

              <View className="bg-white rounded-2xl py-3 px-6 shadow-lg" style={{ maxHeight: 360 }}>
                <Animatable.Text
                  animation="slideInDown" // Slide in from above
                  duration={500}         // Animation duration (500ms)
                  key={showNotif ? 'Notification' : 'notifWord'} // Key ensures animation reruns on text change
                  className="text-xl font-bold mb-4 text-black text-center"
                >
                  {showNotif ? 'Notification' : notifWord}
                </Animatable.Text>
                <ScrollView contentContainerStyle={{ maxHeight: 400 }}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <View key={notif.id} className="flex-row items-center mb-4 py-3 px-4 justify-between">
                        {notif.isOpened === 0 && (
                          <View style={{ width: 10, height: 10, backgroundColor: 'red', borderRadius: 5, marginRight: 8 }} />
                        )}

                        <Text className="text-black text-lg">
                          {notif.message}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-center text-gray-500 mt-4">No notifications.</Text>
                  )}
                </ScrollView>

              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <LoaderModal isVisible={isBuying} message={loadingMessage} />
      <Menu activeScreen={activeScreen} />
    </LinearGradient>
  );
};

export default Dashboard;
