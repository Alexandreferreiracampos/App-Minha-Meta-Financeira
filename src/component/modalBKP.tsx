import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, TouchableOpacityProps, ToastAndroid, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Input from './input'
import { calcularValor, convertForInt } from "./function";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as LocalAuthentication from 'expo-local-authentication';


interface ButtonProps extends TouchableOpacityProps {
    statusModal: boolean;
    deposit: () => void;
    changeStatusModal: () => void;


}
export default function ModalBKP({ statusModal, deposit, changeStatusModal, ...rest }: ButtonProps) {

    const [currency, setCurrency] = useState('');
    const [date, setDate] = useState('');

    const limparImput = () => {
        setCurrency('')
        setDate('')
    }

    const biometric = async (metodo:any) => {


        const authenticationBiometric = await LocalAuthentication.authenticateAsync({
            promptMessage: ` Deseja restaurar a meta informado no JSON ?`,
            cancelLabel: "Cancelar",
            disableDeviceFallback: false,
        });

        if (authenticationBiometric.success && metodo == 1) {
            try {

                const jsonData = JSON.parse(date)
                storeData(date)

            } catch (e) {

                ToastAndroid.showWithGravityAndOffset(
                    `Informe um JSON valido.`,
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25, 50)
            }
            }

            if(authenticationBiometric.success && metodo == 2){
                
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == XMLHttpRequest.DONE) {
                            storeData(xhr.responseText);
                        }
                    }
                    xhr.open('GET', 'https://meta-40e80-default-rtdb.firebaseio.com/data.json?auth='${'meu token'}, true);
                    xhr.send(null);
                
            }

            

    };

    const storeData = async (value:any) => {

        try {

            const jsonData = JSON.stringify(value)
            await AsyncStorage.setItem('@financa:data10', value)
            //console.log(JSON.parse(jsonData))
            deposit()
            limparImput()


        } catch (e) {
            setDate('')
            ToastAndroid.showWithGravityAndOffset(
                `Não foi possivel salvar os dados${e}`,
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25, 50)
        }
    }

    return (

        <Modal
            animationType='fade'
            transparent={true}
            statusBarTranslucent={true}
            visible={statusModal}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.outerView}>
                    <KeyboardAvoidingView style={styles.modalView} behavior='padding'>
                        
                        <View style={{ width: '100%', height: '80%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: RFPercentage(30), height: RFPercentage(5), top: RFPercentage(-5), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <AntDesign onPress={() => changeStatusModal()} name="back" size={34} color='#09AB4F' />
                            <Text style={{ fontSize: RFPercentage(3), fontWeight: 'bold', color: '#09AB4F' }}>Restaurar backup</Text>
                        </View>
                            <View style={styles.containerInput}>
                                <MaterialIcons name="drive-file-rename-outline" size={24} color='#868686' />
                                <TextInput
                                    style={styles.inputText}
                                    value={date}
                                    placeholder="Json"
                                    placeholderTextColor="#000"
                                    maxLength={1000000000000000000000000}
                                    onChangeText={(text) => setDate(text)}
                                />
                            </View>

                        </View>
                        <View style={{height:RFPercentage(20), bottom:RFPercentage(5),flexDirection:'row', gap:10, justifyContent:'center', alignItems:'center'}}>

                            <TouchableOpacity style={styles.buttonSalvar} onPress={() => biometric(1)}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2) }}>Ler JSON</Text></TouchableOpacity>

                            <TouchableOpacity style={styles.buttonSalvar} onPress={() => biometric(2)}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2) }}>Baixar da Nuvem</Text></TouchableOpacity>

                        </View>

                    </KeyboardAvoidingView>
                </View >
            </TouchableWithoutFeedback>

        </Modal>

    )
}

const styles = StyleSheet.create({
    outerView: {
        flex: 1,
        paddingTop: '35%',
        backgroundColor: 'rgba(210,210,210,0.9)',
        alignItems: 'center'
    },
    modalView: {
        backgroundColor: 'rgb(243,243,243)',
        borderRadius: 20,
        padding: 20,
        width: 350,
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        elevation: 1,
    },
    containerInput: {
        width: '100%',
        height: '25%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSalvar: {
        width: "50%",
        height: "18%",
        backgroundColor: '#09AB4F',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        bottom: RFPercentage(4)
    },
    inputText: {
        width: "90%",
        height: "70%",
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 10,
        padding: 10,

    }
})
