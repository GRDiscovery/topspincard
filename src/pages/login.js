import React, { Component } from 'react';
import { StyleSheet, TextInput, Alert, View, SafeAreaView, Image, ScrollView, AsyncStorage, Vibration, Platform, Switch } from 'react-native'
import { Notifications } from 'expo';
import { TextInputMask } from 'react-native-masked-text'

import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
//import * as WebBrowser from 'expo-web-browser';
import base64 from 'react-native-base64';


import { Container, Header, Button, Icon, Text, Form, Item, Input, Content, Grid, Col} from 'native-base';
export default class Login extends Component {
  static navigationOptions = { headerShown: false }
  

  
  state = {
    numcard: '',
    senha: '', 
    expoPushToken : '',
    notification: {},
    isReady: false,
    switchValue: false,
   
};


_handleTongleSw = () => {

  this.setState(state => ({
    switchValue: !state.switchValue
    
  }));

 if(this.state.switchValue == false){

  console.log('dados Salvos');
 }else{
  console.log('Dados eliminados');
 }

}
   
  

  constructor(props) {
    super(props);

 

  }

  
  
  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Falha ao gerar o push token!');
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({expoPushToken: token});
    } else {
  
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };
  

  componentDidMount() {

    this.setState({lembreme: 'O rato roue'})

    console.log(this.state.lembreme+'frase')

  
    //this.versionInfor()
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    this.setState({ notification: notification });

    if(notification.data.screen == 'resgate'){
      this.props.navigation.navigate("ConResg", { season: notification.data.codigo, })

    }


    


  }



  onPress() {


       this.setState(state => ({
      lembreme: !state.lembreme
      
    }));
    
console.log(this.state.lembreme);
    // console.log('teste');
    // if (this.state.numcard.length < 11) {
    //   Alert.alert('Coloque CPF Válido');
    // }else if(this.state.numcard == ''){
      
    //   Alert.alert('Campo CPF em branco');


    // }else if(this.state.senha == ''){

    //   Alert.alert('Campo senha em branco');

    // }else {

    //   this.getData(this.state.numcard, this.state.senha)
    // }
  }


  // (GETDATA) METODO QUE CHAMA A API


  versionInfor() {

  
  fetch('https://cmajoris.com.br/grdirect/versionApp/index.php')
    .then((response) => response.json())
    .then((response) => {  
      console.log(response.informacao[0].build_code)

       if(response.informacao[0].build_code !='1.2.5'){

        
        this.props.navigation.navigate('Manutencao')
       }
      
    }).catch(function(error) {
      Alert.alert('Sem conexão com a internet');
    });

  }


  




  getData(numcard, senha) {

    

    var pass64  = base64.encode(senha);    
    fetch('https://cmajoris.com.br/grdirect/loginDirect/index.php?User=GrdirectAdminGedai&Password=VhzTAJTO427dJmT9fa5WH8Xvl7rrWQ&Cpf='+numcard+'&Pass64='+pass64+'&TokenNotification='+this.state.expoPushToken)
      .then((response) => response.json())
      .then((response) => {  
        
        console.log(response)
        if(response.status == 1){
          AsyncStorage.setItem('nomeGrdirect', response.usuario[0].nome);
          AsyncStorage.setItem('codigo_investidorGrdirect', response.usuario[0].codigo_investidor);
          AsyncStorage.setItem('cpfGrdirect', response.usuario[0].cpf);
          AsyncStorage.setItem('plano', response.usuario[0].percentual);

          this.props.navigation.navigate('List');
        }else if(response.status == 0){
          Alert.alert(response.messagem);
        }
      }).catch(function(error) {
        Alert.alert('Sem conexão com a internet');
      });
  }




  render() {


    const _handlePressButtonAsync = async () => {
      let result = await WebBrowser.openBrowserAsync('https://cmajoris.com.br/portal/cadastro/cadastro_cliente.php');
      setResult(result);
    };
     
    
    return (

  
      <SafeAreaView style={styles.safeview}>
     

        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
          flex: 1,
          
        }}>
        
          <Image
            style={{ height: 300, width: 300, marginTop:-30}}
            source={require('../../assets/img/L512.png')}
            resizeMode="contain"
          />
        </View>

        <Text style={{textAlign:'center' , color: '#646463', marginTop:-50, fontSize:20}}>Acesse sua conta digital </Text> 
        <Form>
          
          <Item regular style={{ marginLeft: 30, marginRight: 30, borderRadius:10, marginTop:40, backgroundColor:'#FFF' }}>

<TextInputMask style={{backgroundColor:"#ff0000", width:"100%", backgroundColor:'#FFF', color: '#646464', fontSize:22  }}
  type={'credit-card'}
  options={{
    obfuscated: false,
    
  }}
  
  value={this.state.creditCard}
  onChangeText={text => {
    this.setState({
      creditCard: text
    })
  }}
  placeholder="Número do cartão" 
/>

            <Input onChangeText={numcard => this.setState({ numcard })}
              value={this.state.numcard} autoCapitalize="none" keyboardType='number-pad' style={{ color: '#646464' }} stackedLabel picker placeholder="Número do cartão" placeholderTextColor='#646464' />
          </Item>

 

          <Item regular style={{ marginLeft: 30, marginRight: 30, marginTop: 50, borderRadius:10, backgroundColor:'#FFF'  }}>
            <Input onChangeText={senha => this.setState({ senha })}
              value={this.state.senha} autoCapitalize="none"  secureTextEntry keyboardType='default' style={{ color: '#646464' }} stackedLabel picker placeholder="Senha" placeholderTextColor='#646464' />


          </Item>
        </Form>

        <Text style={{textAlign:'center' , marginTop:20, color: '#646464'}}>Esqueci minha senha </Text> 
        <Content>

        <Grid>
          <Col style={{ marginTop: 30, marginLeft:30}}>
          <Text style={{color: '#646464',}} > Lembrar de mim</Text>
          <Switch
          ios_backgroundColor="#3e3e3e"
          onValueChange={this._handleTongleSw}
          value={this.state.switchValue}
       
        />            
      </Col>
          <Col>
          <Button onPress={numcard => this.onPress()} style={{ marginTop: 30, marginLeft: 30, marginRight: 30, borderRadius: 10, backgroundColor: '#646464' }} full rounded>
            <Text style={{ color: '#FFF' }}>Acessar</Text>
          </Button>
    

          </Col>
        </Grid>


          
          
          {/* <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFF',
          marginTop: 30
        }}>  
          
          <Text style={{color:'#FFF'}} >               
          Não tem cadastro?
          </Text>

          <Text style={{textDecorationLine: 'underline', color:'#FFF'}} onPress={_handlePressButtonAsync}>
               Cadastra-se 
          </Text>

         </View> */}
        </Content>
       
      </SafeAreaView>


  



    );
  }
}

const styles = StyleSheet.create({
  safeview: {
    flex: 1,
    backgroundColor: '#efefef',
    justifyContent: "center",
  },

  container2: {
    marginTop: 10,
    textAlign: "center",
    alignItems: "center",
    color: "#FFF",
    justifyContent: "center",
  },

  form: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginTop: 50
  },

  btLogin: {
    borderRadius: 15,
    marginTop: 50,
    backgroundColor: "#02c19e",
    fontSize: 45,
  },
})