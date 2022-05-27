import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { calcularValor, convertForInt, maskCurrency } from "./function";
import { Entypo } from '@expo/vector-icons';


interface cardMetaProps extends TouchableOpacityProps {
    title: string;
    date: string;
    saldo: number;
    meta: string;
    porcent: number;
    visible:boolean
    lerDados: () => void;
    longPress:()=> void;

}

export default function cardMeta({ title, lerDados, date, saldo, meta, porcent,visible,longPress, ...rest }: cardMetaProps) {

    let metaString = String(meta)
    let saldoString = String(saldo)

    return (
        <TouchableOpacity {...rest} style={styles.container} onPress={lerDados} onLongPress={longPress}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View >
                    <Text style={styles.text}>{title}</Text>
                    <Text style={{ fontSize: 14, color: '#606060', fontWeight: 'bold', }}>{date}</Text>
                </View>
                <View>
                    { visible && <Entypo name="check" size={24} color="#09AB4F" />}
                </View>
            </View>
            <View style={{ bottom: -15 }}>
                <View style={styles.ProgressBar}>
                    <View style={{
                        width: porcent + '%',
                        height: '100%',
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#09AB4F'
                    }}>
                    </View>
                </View>
                <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 14, color: '#606060', fontWeight: 'bold', }}>
                        R$ {maskCurrency(saldoString)}
                    </Text>
                    <Text style={{ fontSize: 16, color: '#606060', fontWeight: 'bold', }}>

                        R$ {maskCurrency(metaString)}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 130,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: "#000",
        elevation: 1,
    },
    text: {
        fontSize: 21,
        color: '#606060',
        fontWeight: 'bold',

    },
    ProgressBar: {
        width: '100%',
        height: '22%',
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: 'rgb(243,243,243)'
    },
})