import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableOpacityProps} from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


interface cardMetaProps extends TouchableOpacityProps {
    title: string;
    date:string;
    saldo:number;
    meta:string;
    lerDados:()=>void;
    
}

export default function cardMeta({ title,lerDados, date, saldo, meta,...rest }: cardMetaProps) {
    const [progress, setProgress] = useState(23);
    const [ProgressBarValue, setProgressBarValue] = useState(23);

    return (
        <TouchableOpacity {...rest} style={styles.container} onPress={lerDados}>
            <View >
                <Text style={styles.text}>{title}</Text>
                <Text style={{fontSize:14, color: '#868686',fontWeight: 'bold',}}>{date}</Text>
            </View>
                <View style={{bottom:-15}}>
                <View style={styles.ProgressBar}>
                    <View style={{
                        width: ProgressBarValue + '%',
                        height: '100%',
                        borderRadius: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'green'
                    }}>
                    </View>
                </View>
            <View style={{width:'100%', justifyContent: 'space-between', flexDirection:'row'}}>
            <Text style={{fontSize:14, color: '#868686',fontWeight: 'bold',}}>
                R$ {saldo}
                </Text>
            <Text style={{fontSize:16, color: '#868686',fontWeight: 'bold',}}>
                
                R$ {meta}
            </Text>
            </View>
                </View>
            
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height:130,
        backgroundColor: 'rgb(243,243,243)',
        justifyContent:'space-between',
        flexDirection:'column',
        padding:10,
        marginBottom:10,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 1.22,
        elevation: 3,

    },
    text: {
        fontSize: 21,
        color: '#868686',
        fontWeight: 'bold',
     
    },
    ProgressBar: {
        width: '100%',
        height: '22%',
        borderRadius: 18,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
})