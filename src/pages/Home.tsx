import react from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 

export default function Home(){

    const balance = '6.030,00';
    const balanceNone = '******'
    
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View><Text style={{color:'white'}}>Saldo</Text></View>
                <View style={styles.containerBalance}>
                    <Text style={styles.balance}>R$ {balance}</Text>
                </View>

                <View>
                <Ionicons name="eye-outline" size={25} color="white" />
                </View>

                <View style={styles.ContainerButtomBalance}>
                    <View style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-up" size={34} color="green" style={{paddingEnd:13}}/>
                    <View >
                        <Text style={{color:'white'}}>Entrada</Text>
                        <Text style={{color:'green',fontSize:20}}>R$ 49.000,80</Text>
                    </View>
                    </View>

                    <View style={{ width:0.4, height:'70%',backgroundColor:'white', margin:10}}></View>

                    <View style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-down" size={34} color="red" style={{paddingEnd:13}}/>
                    <View>
                        <Text style={{color:'white'}}>saída</Text>
                        <Text style={{color:'red',fontSize:20}}> R$ 1.335,92</Text>
                    </View>
                    </View>

                </View>

            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor: 'rgb(18,22,23)'
    },
    header:{
        width:'100%',
        height:'33%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomEndRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: 'rgb(18,28,38)'
    },
    containerBalance:{
        justifyContent:'center',
        alignItems:'center',
        padding:10,
    },
    balance:{
        fontSize: 36,
        color: 'white'
    },
    ContainerButtomBalance:{
        justifyContent:'center',
        alignItems:'center', 
        flexDirection:'row',
        top:48,
        

    },
    ButtomBalance:{
        flex:1,
        width:'100%',
        height:'70%',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        margin:5,  
        
    }
})

