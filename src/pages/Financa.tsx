import react, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ScreenModalDeposito from "../component/modalDeposito";
import ScreenModalRetirada from "../component/modalRetirada";
import { calcularValor, convertForInt, maskCurrency } from "../component/function";
import { VictoryPie } from 'victory-native';


export default function Financa({ route }) {


    const balanceNone = '******';
    const [balance, setBalance] = useState('');
    const [deposit, setDeposit] = useState('');
    const [withdrawal, setWithdrawal] = useState('');
    const [progress, setProgress] = useState(0);
    const [dataMeta, setDataMeta] = useState()
    const [modalDepositoActive, setModalDepositoAtive] = useState(false);
    const [modalRetiradaActive, setModalRetiradaAtive] = useState(false);

    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)
    const data1 = [
        { quarter: 1, earnings: 13000,color:randomColor() },
        { quarter: 2, earnings: 16500, color:randomColor()},
        { quarter: 3, earnings: 14250, color:randomColor()},
        { quarter: 4, earnings: 19000, color:randomColor()}
    ];
   
   


    const [visibleBalance, setVisibleBalance] = useState('eye-outline')
    const [visibleBalancevalue, setVisibleBalancevalue] = useState(balance)

    useEffect(() => {
        data()
    }, [balance])

    const data = () => {
        setModalDepositoAtive(false)
        setModalRetiradaAtive(false)
        somarDepositos()
        somarRetiradas()
        somarBalance()
    }

    useEffect(() => {
        salvarSaldo()
    }, [balance])

    const salvarSaldo = async () => {
        const data = await AsyncStorage.getItem('@financa:data') || ''
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
    }

    const storeData = async (value: any) => {
        try {

            const jsonData = JSON.stringify(value)
            await AsyncStorage.setItem('@financa:data', jsonData)

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }
    }




    const somarBalance = async () => {
        const data = await AsyncStorage.getItem('@financa:data') || ''
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
        const data = await AsyncStorage.getItem('@financa:data') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        let dataSomaDeposito = 0
        for (let i = 0; i < jsonData[index].deposito.length; i++) {
            dataSomaDeposito = jsonData[index].deposito[i].valor + dataSomaDeposito
        }
        setDeposit(maskCurrency(String(dataSomaDeposito)))
    }
    const somarRetiradas = async () => {
        const data = await AsyncStorage.getItem('@financa:data') || ''
        const jsonData = JSON.parse(data)
        const index = jsonData.findIndex((element: any) => element.id == route.params.id)
        let dataSomaDeposito = 0
        for (let i = 0; i < jsonData[index].retirada.length; i++) {
            dataSomaDeposito = jsonData[index].retirada[i].valor + dataSomaDeposito
        }
        setWithdrawal(maskCurrency(String(dataSomaDeposito)))
        somarBalance()

    }

    const BalanceVisible = () => {
        if (visibleBalance == "eye-off-outline") {
            setVisibleBalance('eye-outline')
            setVisibleBalancevalue(balance)

        } else {
            setVisibleBalance('eye-off-outline')
            setVisibleBalancevalue(balanceNone)
        }

    }


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />
            <ScreenModalDeposito statusModal={modalDepositoActive} deposit={() => data()} changeStatusModal={() => setModalDepositoAtive(false)} id={route.params.id} />
            <ScreenModalRetirada statusModal={modalRetiradaActive} deposit={() => data()} changeStatusModal={() => setModalRetiradaAtive(false)} id={route.params.id} />
            <View style={styles.header}>
                <View><Text style={{ color: '#868686', fontWeight: 'bold', fontSize: RFPercentage(1.8), top: -10 }}>{route.params.title}</Text></View>
                <View style={styles.containerBalance}>
                    <Text style={styles.balance}>R$ {balance}</Text>
                </View>

                <TouchableOpacity onPress={() => BalanceVisible()}>
                    <Ionicons name={visibleBalance} size={RFPercentage(3.5)} color='#868686' />
                </TouchableOpacity>

                <View style={styles.ContainerButtomBalance}>
                    <TouchableOpacity onPress={() => setModalDepositoAtive(true)} style={styles.ButtomBalance}>
                        <FontAwesome name="arrow-circle-up" size={RFPercentage(4.5)} color="green" style={{ paddingEnd: 13 }} />
                        <View >
                            <Text style={{ color: '#868686', fontSize: RFPercentage(1.8), fontWeight: 'bold' }}>Entrada</Text>
                            <Text style={{ color: 'green', fontSize: RFPercentage(2.7), fontWeight: 'bold' }}>R$ {deposit}</Text>
                        </View>
                    </TouchableOpacity >

                    <View style={{ width: 0.4, height: '70%', backgroundColor: 'black', margin: 10 }}></View>

                    <TouchableOpacity onPress={() => setModalRetiradaAtive(true)} style={styles.ButtomBalance}>
                        <FontAwesome name="arrow-circle-down" size={RFPercentage(4.5)} color="red" style={{ paddingEnd: 13 }} />
                        <View>
                            <Text style={{ color: '#868686', fontSize: RFPercentage(1.8), fontWeight: 'bold' }}>saída</Text>
                            <Text style={{ color: 'red', fontSize: RFPercentage(2.7), fontWeight: 'bold' }}> R$ {withdrawal}</Text>
                        </View>
                    </TouchableOpacity >

                </View>

            </View>
            <View style={styles.cardMeta}>
                <Text style={{ color: '#868686', fontSize: RFPercentage(2.8), fontWeight: 'bold' }}>Meta:</Text>
                <Text style={{ color: '#868686', fontSize: RFPercentage(3), fontWeight: 'bold' }}>R$ {maskCurrency(String(route.params.meta))}</Text>
            </View>
            <View style={styles.cardProgresso}>

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#868686', fontSize: RFPercentage(2), marginBottom: 10, fontWeight: 'bold' }}>Você guardou até agora</Text>
                    <Text style={{ color: '#868686', fontSize: RFPercentage(2), marginBottom: 10, fontWeight: 'bold' }}>{progress.toFixed(1)}%</Text>
                </View>

                <View style={styles.barraProgresso}>
                    <View style={{
                        width: progress + '%',
                        height: '100%',
                        borderRadius: 18,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'green'
                    }}>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                <VictoryPie
                    data={data1}
                    // data accessor for x values
                    x="quarter"
                    // data accessor for y values
                    y="earnings"
                    colorScale={data1.map(expense=> expense.color)}

                />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(210,210,210,0.9)',
    },
    header: {
        width: '100%',
        height: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomEndRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: 'rgb(243,243,243)',
    },
    containerBalance: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    balance: {
        fontSize: RFPercentage(5),
        color: '#868686'
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
    cardMeta: {
        width: '97%',
        height: '8%',
        borderRadius: 18,
        marginTop: 10,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgb(243,243,243)',
    },
    cardProgresso: {
        width: '97%',
        height: '10%',
        borderRadius: 18,
        marginTop: 10,
        padding: 18,
        backgroundColor: 'rgb(243,243,243)',
    },
    barraProgresso: {
        width: '100%',
        height: '32%',
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: 'white',

    },

})

