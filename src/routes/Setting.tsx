import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import HomeIcon from '../assets/svg/HomeIcon';
import { firebase } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

type Props = StackScreenProps<RootStackParamList, 'Setting'>;

interface Student {
  id: string; // Firestore document ID
  Idno: string;
  Name: string;
}

const Setting: React.FC<Props> = ({ navigation }) => {
  const [students, setStudents] = useState<Student[]>([]); // Define the type here
  const [idno, setIdno] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentCollection = await firestore().collection('Student').get();
        const studentData = studentCollection.docs.map((doc) => ({
          id: doc.id, // Include document ID
          ...doc.data(),
        })) as Student[]; // Cast to Student[]
        setStudents(studentData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const addStudent = async () => {
    if (!idno || !name) {
      Alert.alert('Error', 'Please fill in both ID number and name.');
      return;
    }

    try {
      const newStudent = { Idno: idno, Name: name };
      const docRef = await firestore().collection('Student').add(newStudent);
      setStudents((prev) => [...prev, { id: docRef.id, ...newStudent }]);
      setIdno('');
      setName('');
      Alert.alert('Success', 'Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student. Please try again.');
    }
  };
  /*  const [searchString, setSearchText] = useState('');
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
  */

  return (
    <View className="flex-1 bg-[#031527]">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <HomeIcon className="h-6 w-6 text-white" />
        </TouchableOpacity>
      </View>

      <View className="items-center mt-16">
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      <View className="mt-10 px-6">
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center space-x-4">
              <Text className="text-white text-base">ID No: {item.Idno}</Text>
              <Text className="text-white text-base">Name: {item.Name}</Text>
            </View>
          )}
        />
      </View>

      <View className="mx-4 mt-4">
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Add New Student</Text>
        <TextInput
          placeholder="ID Number"
          value={idno}
          onChangeText={setIdno}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
          }}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
          }}
        />
        <Button title="Add Student" onPress={addStudent} />
      </View>
    </View>
  );
};

export default Setting;
