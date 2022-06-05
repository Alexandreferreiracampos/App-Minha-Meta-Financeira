import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView, StatusBar, Platform, FlatList, ToastAndroid, Alert} from 'react-native';
import CardMeta from "../component/cardMeta";
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ScreenModal from "../component/modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core'
import * as LocalAuthentication from 'expo-local-authentication';


export default function Home() {



    const [updateFlastlist, setUpdateFlastlist] = useState(true)
    const [modalActive, setModalAtive] = useState(false);
    const [dataMeta, setDataMeta] = useState()
    const [load, setLoad] = useState(true)
    const navigation = useNavigation();

    const readData = async () => {

        try {

            const data = await AsyncStorage.getItem('@financa:data10') || ''
            const jsonData = JSON.parse(data)
            setDataMeta(jsonData)

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
                porcent: 0
            })
        }


    }

    useEffect(() => {
        readData()
        navigation.addListener('focus', () => setLoad(!load))
    }, [load, navigation])

    const data = () => {
        setModalAtive(false)
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

    return (
        
        < SafeAreaView style={styles.container}>
            
            <StatusBar backgroundColor='rgb(243,243,243)' barStyle="dark-content" />
            
            <ScreenModal statusModal={modalActive} deposit={() => data()} changeStatusModal={() => setModalAtive(false)} />
        
            <View style={styles.listCard}>
                <FlatList
                    data={dataMeta}
                    renderItem={({ item }) =>
                        <CardMeta
                            title={item.title}
                            saldo={item.saldo}
                            meta={item.meta}
                            date={item.date}
                            porcent={item.porcent}
                            visible={item.visible}
                            lerDados={() => abrirMeta(item)}
                            longPress={() => deletarItemExtrato(item)}
                        />
                    }
                    keyExtractor={(item) => item.id}
                    extraData={updateFlastlist}
                />
            </View>
            <TouchableOpacity style={{ bottom: '4%', left: '82%'}} onPress={() => setModalAtive(true)}>
                <AntDesign name="pluscircle" size={RFPercentage(7)} color="#09AB4F" />
            </TouchableOpacity>
           
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
        height: '85%',
        paddingTop:0,
        padding: RFPercentage(3),
        justifyContent:'center',
      
    }
})