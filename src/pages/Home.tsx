import react from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default function Home(){

    const visibleBalance=()=>{
        

    }

    const balance = '46.030,42';
    const balanceNone = '******'
    
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(18,28,38)' barStyle="light-content" />
            <View style={styles.header}>
                <View><Text style={{color:'white',fontSize:RFPercentage(1.8), top:-10}}>Saldo</Text></View>
                <View style={styles.containerBalance}>
                    <Text style={styles.balance}>R$ {balance}</Text>
                </View>

                <TouchableOpacity>
                <Ionicons name="eye-outline" size={RFPercentage(3.5)} color="white" />
                </TouchableOpacity>

                <View style={styles.ContainerButtomBalance}>
                    <View style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-up" size={RFPercentage(4.5)} color="green" style={{paddingEnd:13}}/>
                    <View >
                        <Text style={{color:'white',fontSize:RFPercentage(1.8)}}>Entrada</Text>
                        <Text style={{color:'green',fontSize:RFPercentage(2.7)}}>R$ 49.000,80</Text>
                    </View>
                    </View>

                    <View style={{ width:0.4, height:'70%',backgroundColor:'white', margin:10}}></View>

                    <View style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-down" size={RFPercentage(4.5)} color="red" style={{paddingEnd:13}}/>
                    <View>
                        <Text style={{color:'white',fontSize:RFPercentage(1.8)}}>saída</Text>
                        <Text style={{color:'red',fontSize:RFPercentage(2.7)}}> R$ 1.335,92</Text>
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
        fontSize: RFPercentage(5),
        color: 'white'
    },
    ContainerButtomBalance:{
        justifyContent:'center',
        alignItems:'center', 
        flexDirection:'row',
        top:35,
        

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

