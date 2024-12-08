
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';


const useBackButtonHandler = <T extends keyof RootStackParamList>(
  navigation: NavigationProp<RootStackParamList>,
  goBackTo: T,
  params?: RootStackParamList[T] 
) => {
  useEffect(() => {
    const backAction = () => {
      
      if (params !== undefined) {
        
        (navigation.navigate as (screen: T, params: RootStackParamList[T]) => void)(goBackTo, params);
      } else {
        
        (navigation.navigate as (screen: T) => void)(goBackTo);
      }
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); 
  }, [navigation, goBackTo, params]);
};

export default useBackButtonHandler;
