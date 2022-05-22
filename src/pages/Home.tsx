import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, SafeAreaView, StatusBar, Platform, FlatList, ToastAndroid } from 'react-native';
import CardMeta from "../component/cardMeta";
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ScreenModal from "../component/modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertForInt } from "../component/function";
import { useNavigation } from '@react-navigation/core'
import Financa from "./Financa";



export default function Home() {

    const [updateFlastlist, setUpdateFlastlist] = useState(true)
    const [modalActive, setModalAtive] = useState(false);
    const [dataMeta, setDataMeta] = useState()
    const navigation = useNavigation();

    const readData = async () => {

        try {

            const data = await AsyncStorage.getItem('@financa:data') || ''
            const jsonData = JSON.parse(data)
            setDataMeta(jsonData)

        } catch (e) {
            ToastAndroid.showWithGravityAndOffset(
                `Dados não encontrado${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }


    }

    useEffect(() => {
        readData()
        console.log(2)
    }, [])

    const data = () => {
        setModalAtive(false)
        setUpdateFlastlist(!updateFlastlist)
        readData()
    }

    const abrirMeta = (item: any) => {
        navigation.navigate(Financa)
        
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#cdcdcd' barStyle="dark-content" />
            <ScreenModal statusModal={modalActive} deposit={() => data()} changeStatusModal={() => setModalAtive(false)} />
            <View style={styles.listCard}>
                <FlatList
                    data={dataMeta}
                    renderItem={({ item }) =>
                        <CardMeta
                            title={item.title}
                            saldo={item.deposito[0].valor - item.retirada[0].valor}
                            meta={item.meta}
                            date={item.date}
                            lerDados={() => abrirMeta(item)} />
                    }
                    keyExtractor={(item) => item.id}
                    extraData={updateFlastlist}
                />
            </View>
            <TouchableOpacity style={{ bottom: '4%', left: '82%' }} onPress={() => setModalAtive(true)}>
                <AntDesign name="pluscircle" size={RFPercentage(7)} color="green" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cdcdcd',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    listCard: {
        width: '100%',
        height: '85%',
        padding: RFPercentage(2),

    }
})