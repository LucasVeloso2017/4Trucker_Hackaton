import React,{useState, ChangeEvent, useEffect} from 'react';
import { 
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ImageStyle,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Select from 'react-native-picker-select';
import axios from 'axios'

import { useNavigation } from '@react-navigation/native'
import { Feather as Icon } from '@expo/vector-icons'
import { RectButton} from 'react-native-gesture-handler'

// se a uf for igual a selecionada  fazer a req

import api from '../../services/api'

interface ibgeUfResponse{
    sigla:string
}
interface ibgeCityResponse{
    nome:string
}
const Home: React.FC = () => {

    const navigation = useNavigation()

    const[uf,setUf]=useState('')
    const[city,setCity]=useState('')

    const[ufs,setUfs]=useState<string[]>([])
    const[citys,setCitys]=useState<string[]>([])

    function handleNavigationToPoint(){
        navigation.navigate('point',{uf,city})
    }

    useEffect(()=>{
        axios.get<ibgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res =>{
            const ufInitials = res.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    },[])

    useEffect(()=>{
        if(!uf)
        return
         axios.get<ibgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(res =>{
            const cityNames = res.data.map( city => city.nome)
            setCitys(cityNames)
        })

    },[uf])

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios'?'padding':undefined }>
        <View 
            style={styles.container}
        >
        <View style={styles.main}>   
            <Image 
                source={require('../../assets2/logo.png')}
                style={{width:100,height:100, resizeMode:'contain'}}
            />

            <View>
            <Text style={styles.title}>Transformando sua rotina da estrada.</Text>
            <Text style={styles.description}>Levando sua experiência profissional ao próximo nível!</Text>
            </View>
        </View>
        <View style={styles.footer}>
            <Select
                onValueChange={(value) => setUf(value)}
                items={ufs.map((uf,val)=>{
                    return(
                        {label:uf,value:uf,id:val++}
                    )

                })}
            />
            <Select
                onValueChange={(value) => setCity(value)}
                items={citys.map((city,val)=>{
                    return(
                        {label:city,value:city,id:val++}
                    )
                })}
            />

            
            <RectButton 
                style={styles.button}
                onPress={handleNavigationToPoint}
            >
                <View style={styles.buttonIcon}>
                    <Text> 
                        <Icon 
                            name="arrow-right" 
                            color="white" 
                            size={26}
                        /> 
                    </Text>
                </View>
                <Text style={styles.buttonText}>
                    Entrar
                </Text>

            </RectButton>

        </View>
      </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },
  
    main: {
        flex: 1,
        justifyContent: 'center',
    },
  
    title: {
        color: '#322153',
        fontSize: 29,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },
  
    description: {
        color: '#6C6C80',
        fontSize: 14,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },
  
    button: {
        backgroundColor: '#9159c1',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },
  
    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
  
    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;