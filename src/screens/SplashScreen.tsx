import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../types/navigation';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
    const navigation = useNavigation<SplashScreenNavigationProp>();
    const { checkAuthStatus, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Check authentication status
                await checkAuthStatus();
            } catch (error) {
                console.error('Error checking auth status:', error);
            }
        };

        initializeApp();
    }, [checkAuthStatus]);

    useEffect(() => {
        // Navigate based on authentication status once loading is complete
        if (!isLoading) {
            setTimeout(_ => {
                if (isAuthenticated) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            }, 3000)
        }
    }, [isAuthenticated, isLoading, navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.content}>
                <Text style={styles.title}>
                    NSF GYM
                </Text>

                <Text style={styles.subtitle}>
                    NEVER STOP FIGHTING
                </Text>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color="#e96315"
                        testID="activity-indicator"
                    />
                    <Text style={styles.loadingText}>
                        Loading...
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3c3c3c',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#ffffff',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 22,
        color: '#ffffff',
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#ffffff',
    },
});

export default SplashScreen;
