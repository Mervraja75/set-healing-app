// -------------------------------
// Imports
// -------------------------------

import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

// -------------------------------
// Export (Test Screen Component)
// -------------------------------

export default function TestScreen(){
    return (
        <View style={styles.container}>
            {/* Screen Title */}
            <Text style={styles.title}>Test Screen</Text>
            { /* Info Message */ }
            <Text style={styles.info}>This is a Test Screen</Text>
            {/* Back Navigation 8 */ }
            <Link href='/' asChild>
                <Text style={styles.back}>Go Back Home</Text>
            </Link>

        </View>

    )
}

// -------------------------------
// Styles (UI)
// -------------------------------

const styles = StyleSheet.create({

    //This is for the Main Layout
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F6FF',
    },

    //This is for the Title
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#3A0CA3',
        marginBottom: 10,
    },

    //This is for the INFO
    info: {
        fontSize: 16, 
        color: '#555',
        marginBottom: 20,
    },

    //This is for the Go Back link
    back: {
        marginTop: 20, 
        fontSize: 16, 
        color: '#3A0CA3',
        textAlign: 'center',
    },


});
