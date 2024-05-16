/* eslint-disable react-native/sort-styles */
import React, { FC, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";
import { RFValue } from "react-native-responsive-fontsize";

interface SpinnerProps {
    isLoading?: boolean;
    message?: string;
}

export const Spinner: FC<SpinnerProps> = ({ isLoading = false, message = "" }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading) {
            startAnimation();
        } else {
            stopAnimation();
        }
    }, [isLoading]);

    const startAnimation = () => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    const stopAnimation = () => {
        Animated.timing(spinValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    if (!isLoading) return null;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]} />
            <Text style={{ marginTop: 10, fontSize: RFValue(18), color: "#000000" }}>{isLoading ? message : 'Loading....'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        zIndex: 1,
        opacity: 0.9,
    },
    loader: {
        borderColor: colors.palette.neutral900,
        borderRadius: 30,
        borderStyle: "solid",
        borderTopColor: colors.background,
        borderWidth: 4,
        height: 60,
        width: 60,
    },
});

