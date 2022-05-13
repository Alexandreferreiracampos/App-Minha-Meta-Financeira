import react, { useState } from 'react';
import {View, Text, StyleSheet,TouchableOpacity, StatusBar, ToastAndroid} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Home(){

    const balanceNone = '******';
    const [balance, setBalance] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [withdrawal, setWithdrawal] = useState(0);
    const [goal, setGoal] = useState('0');
    const [progress, setProgress] = useState('0');
    

    const [visibleBalance, setVisibleBalance] = useState('eye-outline')
    const [visibleBalancevalue, setVisibleBalancevalue] = useState(balance)

    const soma=(metodo:any, value:any)=>{
        if(metodo == 0){
            setDeposit(deposit + value)
            setBalance(balance + value)

        }else if(metodo == 1){
            setWithdrawal(withdrawal - value)
            setBalance(balance - value)
        }

    }

    const BalanceVisible=()=>{
        if(visibleBalance == "eye-off-outline"){
            setVisibleBalance('eye-outline')
            setVisibleBalancevalue(balance)
        }else{
            setVisibleBalance('eye-off-outline')
            setVisibleBalancevalue(balanceNone)
        }
        
    }

     
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(18,28,38)' barStyle="light-content" />
            <View style={styles.header}>
                <View><Text style={{color:'white',fontSize:RFPercentage(1.8), top:-10}}>Saldo</Text></View>
                <View style={styles.containerBalance}>
                    <Text style={styles.balance}>R$ {balance}</Text>
                </View>

                <TouchableOpacity onPress={()=>BalanceVisible()}>
                <Ionicons name={visibleBalance} size={RFPercentage(3.5)} color="white" />
                </TouchableOpacity>

                <View style={styles.ContainerButtomBalance}>
                    <TouchableOpacity onPress={()=>soma(0,20)} style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-up" size={RFPercentage(4.5)} color="green" style={{paddingEnd:13}}/>
                    <View >
                        <Text style={{color:'white',fontSize:RFPercentage(1.8)}}>Entrada</Text>
                        <Text style={{color:'green',fontSize:RFPercentage(2.7)}}>R$ {deposit}</Text>
                    </View>
                    </TouchableOpacity >

                    <View style={{ width:0.4, height:'70%',backgroundColor:'white', margin:10}}></View>

                    <TouchableOpacity  onPress={()=>soma(1,20)} style={styles.ButtomBalance}>
                    <FontAwesome name="arrow-circle-down" size={RFPercentage(4.5)} color="red" style={{paddingEnd:13}}/>
                    <View>
                        <Text style={{color:'white',fontSize:RFPercentage(1.8)}}>saída</Text>
                        <Text style={{color:'red',fontSize:RFPercentage(2.7)}}> R$ {withdrawal}</Text>
                    </View>
                    </TouchableOpacity >

                </View>

            </View>
            <View style={styles.cardMeta}>
                <Text style={{color:'white',fontSize:RFPercentage(2.8)}}>Meta:</Text>
                <Text style={{color:'white',fontSize:RFPercentage(3)}}>R$ {goal}</Text>
            </View>
            <View style={styles.cardProgresso}>

                <View style={{width:'100%',flexDirection:'row', justifyContent: 'space-between'}}>
                <Text style={{color:'white',fontSize:RFPercentage(2), marginBottom:10}}>Você guardou até agora</Text>
                <Text style={{color:'white',fontSize:RFPercentage(2), marginBottom:10}}>{progress}%</Text>
                </View>
                
                <View style={styles.barraProgresso}>
                <View style={{ 
                    width:progress+'%',
                    height:'100%',
                    borderRadius: 18,  
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'green'}}>
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
        backgroundColor: 'rgb(54,54,59)'
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
        
    },
    cardMeta:{
        width:'97%',
        height:'12%',
        borderRadius: 18,
        marginTop:10,
        padding:18,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'rgb(18,28,38)'
    },
    cardProgresso:{
        width:'97%',
        height:'12%',
        borderRadius: 18,
        marginTop:10,
        padding:18,
        backgroundColor:'rgb(18,28,38)'
    },
    barraProgresso:{
        width:'100%',
        height:'32%',
        borderRadius: 18,  
        justifyContent:'center',
        
        backgroundColor:'white'
    },

})

