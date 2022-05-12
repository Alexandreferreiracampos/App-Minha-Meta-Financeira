import react from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function Home(){

    
    
    return(
        <View style={styles.container}>
            <Text>Ola</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})

