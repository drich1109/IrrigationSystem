import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import SnowFlake from '../assets/svg/SnowFlake';

const { height: screenHeight } = Dimensions.get('window');

const SnowflakeComponent = () => {
    const [snowflakes, setSnowflakes] = useState<number[]>([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setSnowflakes(prev => [...prev, Math.random()]);
        }, 500);

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            setSnowflakes([]);
        }, 15000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            {snowflakes.map((flake, index) => (
                <Snowflake key={flake} index={index} />
            ))}
        </View>
    );
};

interface SnowflakeProps {
    index: number;
}

const Snowflake: React.FC<SnowflakeProps> = ({ index }) => {
    const fallAnimation = useRef(new Animated.Value(0)).current;
    const leftPosition = useRef(Math.random() * 100); 

    useEffect(() => {
        const fallingDuration = 5000; 
        Animated.timing(fallAnimation, {
            toValue: 1,
            duration: fallingDuration,
            useNativeDriver: true,
        }).start();
    }, [fallAnimation]);

    return (
        <Animated.View
            style={[
                styles.snowflake,
                {
                    left: `${leftPosition.current}%`, 
                    transform: [
                        {
                            translateY: fallAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-50, screenHeight + 50], 
                            }),
                        },
                    ],
                },
            ]}
        >
            <SnowFlake className="h-7 w-7 text-blue-300" />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    snowflake: {
        position: 'absolute',
        top: 0, 
    },
});

export default SnowflakeComponent;