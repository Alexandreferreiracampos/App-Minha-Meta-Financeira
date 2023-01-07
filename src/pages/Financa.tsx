import react, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScreenModalDeposito from "../component/modalDeposito";
import ScreenModalRetirada from "../component/modalRetirada";
import { convertForInt, maskCurrency } from "../component/function";
import { FlatList } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function Financa({ route }) {

    const balanceNone = '******';
    const [balance, setBalance] = useState('');
    const [meta, setMeta] = useState();
    const [deposit, setDeposit] = useState();
    const [withdrawal, setWithdrawal] = useState();
    const [progress, setProgress] = useState(0);
    const [modalDepositoActive, setModalDepositoAtive] = useState(false);
    const [modalRetiradaActive, setModalRetiradaAtive] = useState(false);
    const [updateFlastlist, setUpdateFlastlist] = useState(true)
    const [visible, setVisible] = useState(true);
    const [visible1, setVisible1] = useState(false);
    const [visibleAnimatino, setVisibleAnimatino] = useState(true);
    const [dataDeposito, setDataDeposito] = useState();
    const [dataRetirada, setDataRetirada] = useState();
    const [moneyRemaining, setMoneyRemaining] = useState('');
    const [saveForMonth, setSaveForMonth] = useState();
    const [month, setMonth] = useState(0);
    const [itemDate, setItemDate] = useState()



    const readData = async () => {
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const value = jsonData
        const index = value.findIndex((element: any) => element.id == route.params.id)
        setDataDeposito(jsonData[index].deposito.reverse())
        setDataRetirada(jsonData[index].retirada.reverse())
        setUpdateFlastlist(!updateFlastlist)
        
    }

    useEffect(() => {
        readData()
        let newDate = new Date()
        let dataInvertida = route.params.date.substring(3, 5) +'/'+route.params.date.substring(0, 2) +'/'+ route.params.date.substring(10, 6)
        let dateGoal = new Date(dataInvertida)
        let datasomada = Math.abs(dateGoal - newDate)
        let timeinoneday = 1000 * 60 * 60 * 24
        let restam = datasomada / timeinoneday / 30
        setMonth(restam.toFixed(0))
        
        setTimeout(() => {
            setVisibleAnimatino(false)
        }, 700)
        DataMeta()
    }, [])

    useEffect(() => {
        data()
        salvarSaldo()   
        guardarpormes()
        DataMeta()
        
    }, [balance, moneyRemaining, visible1 ])

    const data = () => {
        setModalDepositoAtive(false)
        setModalRetiradaAtive(false)
        somarDepositos()
        somarRetiradas()
        somarBalance()
       
    }

    const modalRetirada=()=>{
        setModalRetiradaAtive(true)
        setVisible1(false)
    }

    const guardarpormes=()=>{
        let moneyRemainingInt = convertForInt(moneyRemaining) / month
        if(month == 0){
            setSaveForMonth(maskCurrency(moneyRemaining))
        }else{
            setSaveForMonth(maskCurrency(String(moneyRemainingInt.toFixed(0))))
        }
        
    }

    const salvarSaldo = async () => {
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const value = jsonData
        const index = value.findIndex((element: any) => element.id == route.params.id)
        value[index].saldo = convertForInt(balance)
        let porecent = value[index].saldo / value[index].meta * 100

        if (porecent >= 100) {
            value[index].visible = true
            value[index].porcent = 100
        }
        if (porecent < 100) {
            value[index].visible = false
            value[index].porcent = porecent
        }
        setProgress(jsonData[index].porcent)
        storeData(value)
        let balanceInt = convertForInt(balance)
        let moneyRemainingInt = meta - balanceInt
        if(balanceInt > meta){
            setMoneyRemaining('0')

        }else{
            setMoneyRemaining(maskCurrency(String(moneyRemainingInt)))
        }
       
    }

    const storeData = async (value: any) => {
        try {

            const jsonData = JSON.stringify(value)
            await AsyncStorage.setItem('@financa:data10', jsonData)
            data()
            readData()

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }
    }

    const DataMeta= async ()=>{
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        setMeta(jsonData[index].meta) 
    }

    const somarBalance = async () => {
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        let dataSomaDeposito = 0
        for (let i = 0; i < jsonData[index].deposito.length; i++) {
            dataSomaDeposito = jsonData[index].deposito[i].valor + dataSomaDeposito
        }
        let dataSomaRetirada = 0
        for (let i = 0; i < jsonData[index].retirada.length; i++) {
            dataSomaRetirada = jsonData[index].retirada[i].valor + dataSomaRetirada
        }
        let somaBalanca = dataSomaDeposito - dataSomaRetirada
        setBalance(maskCurrency(String(somaBalanca)))

    }

    const somarDepositos = async () => {
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        let dataSomaDeposito = 0
        for (let i = 0; i < jsonData[index].deposito.length; i++) {
            dataSomaDeposito = jsonData[index].deposito[i].valor + dataSomaDeposito
        }
        setDeposit(dataSomaDeposito)
    }
    const somarRetiradas = async () => {
        const data = await AsyncStorage.getItem('@financa:data10') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        let dataSomaDeposito = 0
        for (let i = 0; i < jsonData[index].retirada.length; i++) {
            dataSomaDeposito = jsonData[index].retirada[i].valor + dataSomaDeposito
        }
        
       data

        setWithdrawal(dataSomaDeposito)
        somarBalance()
     
        

    }


    const deletarItemDeposito = async (item: any) => {
        Alert.alert(
            `Tem certeza de que deseja excluir esse lançamento ${item.nome} ?`,
            'Excluir',
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => biometric() }
               
            ]
        );

        const biometric = async () => {

            const authenticationBiometric = await LocalAuthentication.authenticateAsync({
                promptMessage: `Excluir ${item.nome} ?`,
                cancelLabel: "Cancelar",
                disableDeviceFallback: false,
            });

            if (authenticationBiometric.success) {
                excluir()
            }

        };

        const excluir = async () => {
            
            const data = await AsyncStorage.getItem('@financa:data10') || ''
            const jsonData = JSON.parse(data)
            const index = jsonData.findIndex((element: any) => element.id == route.params.id)
            const indexDeposito = jsonData[index].deposito.findIndex((element: any) => element.date == item.date)
            jsonData[index].deposito.splice(indexDeposito, 1)
            storeData(jsonData)

        }
    }
    const deletarItemRetirada = async (item: any) => {
        setVisible1(true)
        Alert.alert(
            `Tem certeza de que deseja excluir lançamento ${item.nome} ?`,
            'Excluir',
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                { text: "Excluir", onPress: () => biometric() }
            ]
        );

        const biometric = async () => {

            const authenticationBiometric = await LocalAuthentication.authenticateAsync({
                promptMessage: `Excluir ${item.nome} ?`,
                cancelLabel: "Cancelar",
                disableDeviceFallback: false,
            });

            if (authenticationBiometric.success) {
                excluir()
                
            }
        };

        const excluir = async () => {
            const data = await AsyncStorage.getItem('@financa:data10') || ''
            const jsonData = JSON.parse(data)
            const index = jsonData.findIndex((element: any) => element.id == route.params.id)
            const indexRetirada = jsonData[index].retirada.findIndex((element: any) => element.date == item.date)
            if(jsonData[index].retirada[indexRetirada].retirarMeta == "Debitado da meta"){
                const data = await AsyncStorage.getItem('@financa:data10')
                const jsonData = JSON.parse(data)

                const value = jsonData

                const index = value.findIndex((element: any) => element.id == route.params.id)
                 value[index].meta = value[index].meta + jsonData[index].retirada[indexRetirada].valor
                 jsonData[index].retirada.splice(indexRetirada, 1)
                 storeData(value)
              
            }else{
                jsonData[index].retirada.splice(indexRetirada, 1)
                storeData(jsonData)

            }

            setVisible1(false)
            
            
           
        }

    }

    const concluirMeta= async ()=>{
        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
                promptMessage: "Concluir Meta",
                cancelLabel: "Cancelar",
                disableDeviceFallback: false,
            });

            if (authenticationBiometric.success) {
               const data = await AsyncStorage.getItem('@financa:data10') || ''
               const jsonData = JSON.parse(data)
               const index = jsonData.findIndex((element: any) => element.id == route.params.id)
               const value = jsonData
               value[index].concluido = !value[index].concluido
               value[index].metaTotal = deposit
            
               storeData(value)
                 
            }
    }

    return (

        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />
            {visibleAnimatino && <View style={{ width: '100%', height: '100%', backgroundColor: 'rgb(243,243,243)' }}>
                <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />
                <LottieView
                    source={require('../../assets/money.json')}
                    autoPlay
                />
            </View>}
            <ScreenModalDeposito statusModal={modalDepositoActive} deposit={() => data()} changeStatusModal={() => setModalDepositoAtive(false)} id={route.params.id} />
            <ScreenModalRetirada statusModal={modalRetiradaActive} deposit={() => data()} changeStatusModal={() => setModalRetiradaAtive(false)} id={route.params.id} />
            <View style={styles.header}>
                <View><Text style={{ color: '#606060', fontWeight: 'bold', fontSize: RFPercentage(1.8), top: -10 }}>{route.params.title}</Text></View>
                <View style={styles.containerBalance}>
                    <Text style={styles.balance}>R$ {balance}</Text>
                </View>

                <View style={styles.ContainerButtomBalance}>
                    <TouchableOpacity onPress={() => setModalDepositoAtive(true)} style={styles.ButtomBalance}>
                        <FontAwesome name="arrow-circle-up" size={RFPercentage(4.5)} color="#09AB4F" style={{ paddingEnd: 13 }} />
                        <View >
                            <Text style={{ color: '#606060', fontSize: RFPercentage(1.8), fontWeight: 'bold' }}>Entrada</Text>
                            <Text style={{ color: '#09AB4F', fontSize: RFPercentage(2.7), fontWeight: 'bold' }}>R$ {maskCurrency(String(deposit))}</Text>
                        </View>
                    </TouchableOpacity >

                    <View style={{ width: 0.4, height: '70%', backgroundColor: 'black', margin: 10 }}></View>

                    <TouchableOpacity onPress={() => modalRetirada()} style={styles.ButtomBalance}>
                        <FontAwesome name="arrow-circle-down" size={RFPercentage(4.5)} color="red" style={{ paddingEnd: 13 }} />
                        <View>
                            <Text style={{ color: '#606060', fontSize: RFPercentage(1.8), fontWeight: 'bold' }}>saída</Text>
                            <Text style={{ color: 'red', fontSize: RFPercentage(2.7), fontWeight: 'bold' }}>R$ {maskCurrency(String(withdrawal))}</Text>
                        </View>
                    </TouchableOpacity >

                </View>

            </View>

            <TouchableOpacity activeOpacity={0.8}  onLongPress={()=>concluirMeta()} onPress={() => setVisible1(!visible1)} style={visible1 && styles.cardProgresso || styles.cardProgresso1}>
                {visible1 && <View style={{width:"100%", height:"50%", flexDirection:'row', justifyContent:'space-between', padding:10, marginBottom:18}}>
                    <View style={{width:"32%", height:"100%", justifyContent:'space-between', alignItems:'center',}}>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>Falta guardar</Text>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>R$ {moneyRemaining}</Text>
                        </View>
                        <View style={{ width: 0.6, height: '100%', backgroundColor: 'black'}}></View>
                    <View style={{width:"32%", height:"100%", justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>Guardar por mes</Text>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>R${saveForMonth}</Text>
                        </View>
                        <View style={{ width: 0.8, height: '100%', backgroundColor: 'black' }}></View>
                    <View style={{width:"32%", height:"100%", justifyContent:'space-between', alignItems:'center'}}>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>Falta</Text>
                        <Text style={{ color: '#606060', fontSize: RFPercentage(1.6), fontWeight: 'bold' }}>{month} { month == 1 && 'Mês' || 'Meses'}</Text>
                        </View>
                </View>}

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#606060', fontSize: RFPercentage(2), marginBottom: 10, fontWeight: 'bold' }}>Minha Meta: R$ {maskCurrency(String(meta))} </Text>
                    <Text style={{ color: '#606060', fontSize: RFPercentage(2), marginBottom: 10, fontWeight: 'bold' }}>{progress.toFixed(1)}%</Text>
                </View>

                <View style={styles.barraProgresso}>
                    <View style={{
                        width: progress + '%',
                        height: '100%',
                        borderRadius: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#09AB4F'
                    }}>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.cardExtrato}>
                <View style={{ top: -10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, margin: 5 }}>
                    <View>
                        <TouchableOpacity onPress={() => setVisible(true)} style={{ width: 150, height: 50, borderRadius: 10, backgroundColor: '#09AB4F', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}> Extrato Depositos</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setVisible(false)} style={{ width: 150, height: 50, borderRadius: 10, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Extrato Retiradas</Text>
                    </TouchableOpacity>
                </View>
                {visible &&
                    <FlatList
                        data={dataDeposito}
                        renderItem={({ item }) =>
                            <TouchableOpacity onLongPress={() => { deletarItemDeposito(item) }} style={{ backgroundColor: 'rgb(235,235,235)', shadowColor: "#000", elevation: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, margin: 5 }}>
                                <View>
                                    <Text style={{ color: '#868686', fontWeight: 'bold' }}>{item.nome}</Text>
                                    <Text style={{ color: '#868686', fontWeight: 'bold' }}>{item.date.substring(10, 't')}</Text>
                                </View>
                                <Text style={{ color: '#09AB4F', fontWeight: 'bold' }}>R$ {maskCurrency(String(item.valor))}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item) => item.name}
                        extraData={updateFlastlist}

                    />}
                {!visible &&
                    <FlatList
                        data={dataRetirada}
                        renderItem={({ item }) =>
                            <TouchableOpacity onLongPress={() => { deletarItemRetirada(item) }} style={{ backgroundColor: 'rgb(235,235,235)', shadowColor: "#000", elevation: 1, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, margin: 5 }}>
                                <View>
                                    <Text style={{ color: '#868686', fontWeight: 'bold' }}>{item.nome}</Text>
                                    <View style={{flexDirection:'row'}}>
                                    <Text style={{ color: '#868686', fontWeight: 'bold' }}>{item.date.substring(10, 't')}      </Text>
                                    <Text style={{ color: '#868686', fontWeight: 'bold' }}>{item.retirarMeta}</Text>
                                    </View>
                                </View>
                               
                                <Text style={{ color: 'red', fontWeight: 'bold' }}>R$ {maskCurrency(String(item.valor))}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(item) => item.name}
                        extraData={updateFlastlist}

                    />}

            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgb(220,220,220)',
    },
    header: {
        width: '100%',
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomEndRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: 'rgb(243,243,243)',
        shadowColor: "#000",
        elevation: 1,
    },
    containerBalance: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    balance: {
        fontSize: RFPercentage(5),
        color: '#606060',
        fontWeight: '400'
    },
    ContainerButtomBalance: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        top: 35,
    },
    ButtomBalance: {
        flex: 1,
        width: '100%',
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 5,

    },

    cardExtrato: {
        width: '97%',
        height: '52%',
        borderRadius: 18,
        marginTop: 10,
        padding: 18,
        backgroundColor: 'rgb(243,243,243)',
        shadowColor: "#000",
        elevation: 1,
    },
    cardProgresso: {
        width: '97%',
        height: '20%',
        borderRadius: 18,
        marginTop: 10,
        padding: 18,
        backgroundColor: 'rgb(243,243,243)',
        shadowColor: "#000",
        elevation: 1,
    },
    cardProgresso1: {
        width: '97%',
        height: '10%',
        borderRadius: 18,
        marginTop: 10,
        padding: 18,
        backgroundColor: 'rgb(243,243,243)',
        shadowColor: "#000",
        elevation: 1,
    },
    barraProgresso: {
        width: '100%',
        height: RFPercentage(1.5),
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: 'white',

    },

})

