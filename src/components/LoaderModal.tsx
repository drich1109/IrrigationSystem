import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type LoaderModalProps = {
  isVisible: boolean;
  message: string;
};

const LoaderModal: React.FC<LoaderModalProps> = ({ isVisible, message }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

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
      <View style={styles.modalBackground}>
        <View style={styles.loaderContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <View style={styles.donutContainer}>
              <LinearGradient colors={['#6addd0', '#f7c188']} style={styles.donut} />
              <View style={styles.innerCircle} />
            </View>
          </Animated.View>
          {message ? (
            <Text style={styles.messageText}>{message}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  donutContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'relative', 
  },
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
    backgroundColor: 'white'
  },
  messageText: {
    marginTop: 10,
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoaderModal;