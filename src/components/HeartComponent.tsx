import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import HeartIcon from '../assets/svg/HeartIcon';
import BlackHeartIcon from '../assets/svg/BlackHeartIcon';

interface HeartComponentProps {
    hearts: number; 
}

const HeartComponent: React.FC<HeartComponentProps> = ({ hearts }) => {
    const heartAnimation = useRef(new Animated.Value(1)).current;
    const textOpacity = useRef(new Animated.Value(1)).current;
    const textTranslateY = useRef(new Animated.Value(0)).current;
    const previousHearts = useRef(hearts);

    useEffect(() => {
        const beatDuration = hearts === 3 ? 1000 : hearts === 2 ? 700 : 400;

        const beat = () => {
            Animated.sequence([
                Animated.timing(heartAnimation, {
                    toValue: 1.2, 
                    duration: 100, 
                    useNativeDriver: true,
                }),
                Animated.timing(heartAnimation, {
                    toValue: 1, 
                    duration: 100, 
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setTimeout(beat, beatDuration);
            });
        };

        if (hearts > 0) {
            beat();
        } else {
            heartAnimation.setValue(1);
        }

        if (previousHearts.current !== hearts) {
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 0, 
                    duration: 150, 
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: -10, 
                    duration: 150, 
                    useNativeDriver: true,
                }),
            ]).start(() => {
                Animated.parallel([
                    Animated.timing(textOpacity, {
                        toValue: 1, 
                        duration: 150, 
                        useNativeDriver: true,
                    }),
                    Animated.timing(textTranslateY, {
                        toValue: 0, 
                        duration: 150, 
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        }

        previousHearts.current = hearts;
    }, [hearts]);

    return (
        <View className="flex-row items-center justify-center">
            {hearts > 0 ? (
                <Animated.View
                    className="relative items-center justify-center"
                    style={{ transform: [{ scale: heartAnimation }] }} 
                >
                    <HeartIcon className="h-7 w-7 text-white" />
                </Animated.View>
            ) : (
                <BlackHeartIcon className="h-10 w-10 text-white" />
            )}

            <Animated.Text
                className="text-white font-bold ml-1"
                style={{
                    opacity: textOpacity,
                    transform: [{ translateY: textTranslateY }],
                    color: hearts > previousHearts.current ? 'yellow' : 'white', 
                }}
            >
                {hearts}
            </Animated.Text>
        </View>
    );
};

export default HeartComponent;
