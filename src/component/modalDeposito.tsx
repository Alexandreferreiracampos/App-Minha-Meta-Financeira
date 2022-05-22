import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, TouchableOpacityProps, ToastAndroid, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Input from './input'
import { calcularValor, convertForInt, maskCurrency } from "./function";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


interface ButtonProps extends TouchableOpacityProps {
    statusModal: boolean;
    deposit: () => void;
    changeStatusModal: () => void;
    id:number

}
export default function ScreenModal({ statusModal, deposit, changeStatusModal,id, ...rest }: ButtonProps) {

    const [currency, setCurrency] = useState('');
    const [title, setTitle] = useState('');

    const salvarMeta = async () => {
        const data = await AsyncStorage.getItem('@financa:data')
        const jsonData = JSON.parse(data)

        const value = jsonData

        const index = value.findIndex((element:any) => element.id == id)

        let dados = value[index]

        dados.deposito.push({
            "date": new Date(),
            "nome": title,
            "valor": convertForInt(currency),
          },)
        
          storeData(value)
          
        
        deposit()

       
    }



    const storeData = async (value: any) => {
        try {

            const jsonData = JSON.stringify(value)
            await AsyncStorage.setItem('@financa:data', jsonData)
            
            deposit()

        } catch (e) {
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
                <View style={styles.outerView} onPress={() => changeStatusModal()}>
                    <KeyboardAvoidingView style={styles.modalView} behavior='padding'>
                        <View style={{ width: RFPercentage(30), height: RFPercentage(5), top: RFPercentage(2), justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <AntDesign onPress={() => changeStatusModal()} name="back" size={34} color='green' />
                            <Text style={{ fontSize: RFPercentage(3), fontWeight: 'bold', color: 'green' }}>Depositar</Text>
                        </View>
                        <View style={{ width: '100%', height: '80%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={styles.containerInput}>
                                <MaterialIcons name="drive-file-rename-outline" size={24} color='#868686' />
                                <TextInput
                                    style={styles.inputText}
                                    value={title}
                                    placeholder="Descrição"
                                    placeholderTextColor="#000"
                                    maxLength={100}
                                    onChangeText={(text) => setTitle(text)}
                                />
                            </View>
        
                            <View style={styles.containerInput}>
                                <MaterialIcons name="attach-money" size={24} color='#868686' />
                                <Input
                                    style={styles.inputText}
                                    value={currency}
                                    mask="currency"
                                    keyboardType='numeric'
                                    placeholder="Digite o Valor"
                                    placeholderTextColor="#000"
                                    inputMaskChange={(text: string) => setCurrency(text)}
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.buttonSalvar} onPress={salvarMeta}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2) }}>Salvar</Text></TouchableOpacity>
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
        backgroundColor: '#39d76c',
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
