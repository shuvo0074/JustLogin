import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from '../types/navigation';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC = () => {
    const navigation = useNavigation<SplashScreenNavigationProp>();
    const { checkAuthStatus, isAuthenticated, isLoading } = useAuth();
    const isDarkMode = useColorScheme() === 'dark';

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
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <View style={styles.content}>
                <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                    NSF GYM
                </Text>

                <Text style={[styles.subtitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
                    NEVER STOP FIGHTING
                </Text>

                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={isDarkMode ? '#007AFF' : '#007AFF'}
                        testID="activity-indicator"
                    />
                    <Text style={[styles.loadingText, { color: isDarkMode ? '#ccc' : '#666' }]}>
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
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 22,
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
});

export default SplashScreen;
