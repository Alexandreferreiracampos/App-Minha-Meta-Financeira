import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView, StatusBar, Platform, FlatList, ToastAndroid, Alert } from 'react-native';
import CardMeta from "../component/cardMeta";
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ScreenModal from "../component/modal";
import ModalBKP from "../component/modalBKP";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core'
import * as LocalAuthentication from 'expo-local-authentication';
import { Entypo } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';


export default function Home() {



    const [updateFlastlist, setUpdateFlastlist] = useState(true)
    const [modalActive, setModalAtive] = useState(false);
    const [modalActiveBKP, setModalAtiveBKP] = useState(false);
    const [dataMeta, setDataMeta] = useState()
    const [load, setLoad] = useState(true)
    const [saveData, setSaveData] = useState('')
    const navigation = useNavigation();

    const readData = async () => {

        try {

            const data = await AsyncStorage.getItem('@financa:data10') || ''
            const jsonData = JSON.parse(data)
            setSaveData(data)
            setDataMeta(jsonData.reverse())
            dateFirebase(data)

        } catch (e) {
            setDataMeta({
                id: 0,
                title: '',
                date: '',
                deposito: [
                    {
                        nome: '',
                        valor: 0,
                        date: ''
                    },
                ],
                retirada: [
                    {
                        nome: '',
                        valor: 0,
                        date: ''
                    },
                ],
                meta: 0,
                saldo: 0,
                porcent: 0,
                concluido: false,
                metaTotal: 0,
            })
        }


    }

    

    useEffect(() => {
        readData()
        
        navigation.addListener('focus', () => setLoad(!load))
    }, [load, navigation])

    const data = () => {
        setModalAtiveBKP(false)
        setUpdateFlastlist(!updateFlastlist)
        readData()
    }

    const abrirMeta = (item: any) => {
        navigation.navigate("Financa", item)

    }

    const deletarItemExtrato = async (item: any) => {
        Alert.alert(
            `Tem certeza de que deseja excluir a Meta ${item.title} ?`,
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
                promptMessage: `Excluir Meta ${item.title} ?`,
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
            const index = jsonData.findIndex((element: any) => element.id == item.id)
            jsonData.splice(index, 1)
            storeData(jsonData)
        }
    }


    const storeData = async (value: any) => {
        try {

            const jsonData = JSON.stringify(value)
            await AsyncStorage.setItem('@financa:data10', jsonData)
            readData()
            setUpdateFlastlist(!updateFlastlist)

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }
    }


    const saveFile = async () => {
        await Clipboard.setString(saveData)
        dateFirebase(saveData)
        ToastAndroid.showWithGravityAndOffset(
            "Dados copiados com sucesso!",
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25, 50)
        console.log(saveData)


    }

    const dateFirebase = (value:any) => {

        let url = 'https://meta-40e80-default-rtdb.firebaseio.com/data.json?auth='${'meu token'}'
        let req = new XMLHttpRequest();
        req.open('PUT', url)
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(value);

        ToastAndroid.showWithGravityAndOffset(
            'Dados salvos na nuvem com sucesso!',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50
        );


    }

    return (

        < SafeAreaView style={styles.container}>

            <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />

            <ScreenModal statusModal={modalActive} deposit={() => data()} changeStatusModal={() => setModalAtive(false)} />
            <ModalBKP statusModal={modalActiveBKP} deposit={() => data()} changeStatusModal={() => setModalAtiveBKP(false)}  />
            <View style={styles.listCard}>
                <FlatList
                    data={dataMeta}
                    renderItem={({ item }) =>
                        <CardMeta
                            title={item.title}
                            saldo={item.saldo}
                            meta={item.meta}
                            date={item.date}
                            concluido={item.concluido}
                            porcent={item.porcent}
                            visible={item.visible}
                            metatotal={item.metaTotal}
                            lerDados={() => abrirMeta(item)}
                            longPress={() => deletarItemExtrato(item)}
                        />
                    }
                    keyExtractor={(item) => item.id}
                    extraData={updateFlastlist}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 19, alignItems: 'center' }}>
                <TouchableOpacity style={{ bottom: '5%' }} onPress={() => saveFile()}>
                    <Entypo name="save" size={RFPercentage(5)} color="#09AB4F" />
                </TouchableOpacity>
                <TouchableOpacity style={{ bottom: '5%' }} onPress={() => setModalAtiveBKP(true)}>
                    <Entypo name="back" size={RFPercentage(4)} color="#09AB4F" />
                </TouchableOpacity>

                <Text style={{ bottom: '5%', color: "#09AB4F", fontSize: RFPercentage(3), fontWeight: 'bold' }}>Minhas metas</Text>
                <TouchableOpacity style={{ bottom: '5%', }} onPress={() => setModalAtive(true)}>
                    <AntDesign name="pluscircle" size={RFPercentage(7)} color="#09AB4F" />

                </TouchableOpacity>

            </View>


        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(243,243,243)',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    listCard: {
        width: '100%',
        height: '90%',
        paddingTop: 0,
        padding: RFPercentage(3),
        justifyContent: 'center',

    }
})