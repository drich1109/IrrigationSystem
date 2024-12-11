
import React, { useState, useEffect } from 'react';
import { RootStackParamList } from '../../types';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import HomeIcon from '../assets/svg/HomeIcon';
import CircleIcon from '../assets/svg/CircleIcon';

type Props = StackScreenProps<RootStackParamList, 'History'>;

const History: React.FC<Props> = ({ navigation }) => {
  /*  const [modalVisible, setModalVisible] = useState(false);
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
 
   const circleSize = 100; */

  return (
    <SafeAreaView className="flex-1 bg-[#031527]">
      {/* Top Navigation */}
      <View className="absolute top-10 w-full px-5 flex-row justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HomeIcon className="h-6 w-6 text-white" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View className="items-center mt-16">
        <Text className="text-white text-2xl font-bold">History Logs</Text>
      </View>

      {/* History Logs Section */}
      <View className="mt-10 px-6">
        {/* Single History Item */}
        <View className="mb-6">
          <View className="items-end">
            <Text className="text-white text-base">12-10-24 / 15:16</Text>
          </View>
          <View className="mt-4 flex-row items-center justify-center space-x-8">
            <View className="items-center">
              <Text className="text-white text-lg">Moisture</Text>
              <Text className="text-white text-lg font-semibold">44%</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg">Humidity</Text>
              <Text className="text-white text-lg font-semibold">46%</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-lg">Temperature</Text>
              <Text className="text-white text-lg font-semibold">32°</Text>
            </View>
          </View>
        </View>
        {/* mo gawas ra anag border if more than one na ang logs */}
        <View className="border-b-[1px] mx-1 border-white"></View>
        {/* You can add more history items here */}
      </View>
    </SafeAreaView>
  );
};

export default History;
