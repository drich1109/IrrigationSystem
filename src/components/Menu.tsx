import React, { useState } from 'react';
import { View, Animated, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuScreenNavigationProp, RootStackParamList } from '../../types'; // Adjust the import path
import DashboardIcon from '../assets/svg/DashboardIcon';
import ShopIcon from '../assets/svg/ShopIcon';
import DictionaryIcon from '../assets/svg/DictionaryIcon';
import PracticeIcon from '../assets/svg/PracticeIcon';
import SettingIcon from '../assets/svg/SettingIcon';

interface MenuProps {
  activeScreen: keyof RootStackParamList | null;
}

const Menu: React.FC<MenuProps> = ({ activeScreen }) => {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const navigateToScreen = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen, 'PowerUps');
  };

  return (
    <View className="items-center justify-center">
      <Animated.View className="absolute bottom-0 w-full flex-row items-center justify-around bg-white rounded-t-lg p-4 shadow-md">
        <TouchableOpacity onPress={() => navigateToScreen('Shop')}>
          <ShopIcon className={`w-6 h-6`} isActive={activeScreen == 'Shop'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Dictionary')}>
          <DictionaryIcon className={`w-6 h-6`} isActive={activeScreen == 'Dictionary'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Dashboard')}>
          <DashboardIcon className={`w-6 h-6`} isActive={activeScreen == 'Dashboard'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Practice')}>
          <PracticeIcon className={`w-6 h-6`} isActive={activeScreen == 'Practice'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('Settings')}>
          <SettingIcon className={`w-6 h-6`} isActive={activeScreen == 'Settings'}/>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Menu;
