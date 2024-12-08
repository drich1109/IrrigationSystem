import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type LoaderProps = {
  isVisible: boolean;
  message?: string; // Optional message
};

const Loader: React.FC<LoaderProps> = ({ isVisible, message }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  const contentList = [
    'Colon Street, also known as Parian, in Cebu City, was established by Spanish colonizers in 1565 and is considered the oldest street in the Philippines!',
    'Museo Sugbo, also known as the Cárcel de Cebú, was once a jail during the Spanish colonial period before becoming a museum showcasing Cebu\'s history.',
    'Fort San Pedro, the smallest and oldest tri-bastion fort in the Philippines, served as a military defense structure during the Spanish era.',
    'Cebu is dubbed the "Lechon Capital of the Philippines," where locals celebrate with the crispiest and most flavorful roasted pigs.',
    'The Sinulog Festival, one of the biggest festivals in Asia, is celebrated in honor of the Santo Niño and features a vibrant street dance that mimics the flow of water, symbolizing Cebu\'s rich history.',
    'Waray cuisine is well-known for its seafood dishes, especially binagol (a sweet dish made from taro root, coconut milk, and brown sugar) and sinaing na baboy (pork simmered in salted water), which are staples of their local celebrations.',
    'The Waray people celebrate the Kahimyang Festival in Eastern Samar, which honors the region\'s rich cultural heritage and the diversity of the Waray traditions through music, dance, and vibrant street parades.',
    'The Samar Kanto is a popular delicacy in Waray culture, made of boiled fish, pork, and vegetables, often served during special occasions and gatherings, showcasing the Waray\'s love for hearty meals.',
    'Waray folk music, such as the popular "Sayaw sa Bitoon," is known for its rhythmic, soulful tunes, often accompanied by traditional dances that reflect the Waray people\'s deep connection to nature and spirituality.',
    'The Samar-Leyte Bridge, one of the longest bridges in the Philippines, connects the provinces of Samar and Leyte, highlighting the Waray people\'s significance in connecting different parts of the Visayas region.',
    'The Dinagyang Festival, held in Iloilo City, is a vibrant celebration of the Santo Niño and the native Ati people, featuring thrilling street dancing and colorful parades.',
    'Binukot is an ancient Visayan tradition where young women are kept secluded in their homes to preserve their beauty and honor, a practice that symbolizes modesty and respect for family.',
    'Pandan weaving, a traditional craft in the Visayas, involves making intricate mats, bags, and hats using pandan leaves, and it showcases the artistry of local communities.',
    'The Kahilwayan Festival in Catbalogan, Samar, celebrates the town\'s history and cultural diversity, with lively performances and colorful floats highlighting the region\'s natural beauty and history.',
    'The Sablay Ceremony is a traditional academic rite in some Visayan regions, where graduates wear a distinctive sash, symbolizing their academic achievements and cultural heritage.'
  ];

  const randomContent = contentList[Math.floor(Math.random() * contentList.length)];

  useEffect(() => {
    if (isVisible) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isVisible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent={true} visible={isVisible}>
      <View className="flex-1 justify-center items-center bg-white">
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View className="justify-center items-center relative w-[80px] h-[80px] rounded-full">
            <LinearGradient colors={['#6addd0', '#f7c188']} style={styles.donut} />
            <View style={styles.innerCircle} />
          </View>
        </Animated.View>
        <View className="mt-2 items-center p-2 rounded-xl">
          <Text className="font-black text-center text-xl text-black">Did you know?</Text>
          <Text className="text-base text-black text-center mt-2 px-4">{randomContent}</Text>
        </View>
        {message && <Text className="text-base text-black text-center mt-2"></Text>}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  donut: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: 'transparent',
    borderTopColor: 'transparent',
  },
  innerCircle: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default Loader;
