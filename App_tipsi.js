import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import stripe from 'tipsi-stripe'

stripe.setOptions({
  publishableKey: 'pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx',
  androidPayMode: 'test', // Android only
})

const App = () => {
  const [number, setNumber] = useState("4000002500003155");
  const [year, setYear] = useState("22");
  const [month, setMonth] = useState("12");
  const [cvc, setCVC] = useState("123");
  const [pm, setPM] = useState();
  const [cs, setCS] = useState(); 
  
  const getPaymentMethod = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card : {number, cvc, month, year }
      })
      setPM(paymentMethod.id);
    } catch (e) {
      console.log("Create Payment Method Error : ", e)
    }
  }

  const getClientSecret = () => {
    fetch('http://10.0.2.2:4242/create-payment-intent', {
      
      method:"POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8'        
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      setCS(responseJson.clientSecret);
    })
    .catch(error => {
      console.log(error)
      setCS("Catch");
    })
  }
  
  const createPayment = async () => {
    const confirmPaymentIntent =await stripe.confirmPaymentIntent({ 
      clientSecret:cs,
      paymentMethodId:pm
    })
  }

  return (
    <View style={{paddingTop:100, backgroundColor:'#1e1f34', flex:1}}>
      <Text style={styles.infoText}>{pm}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={getPaymentMethod}>
        <Text>Payment Method</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{cs}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={getClientSecret}>
        <Text>ClientSecret</Text>
      </TouchableOpacity>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createPayment}>
        <Text>Create Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blueButton:{
    marginTop:50,
    height:40,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:300,
    backgroundColor:'#5ed9f5',
    borderWidth:1,
    borderColor:'#5ed9f5',
    borderRadius:5,
  }, 
});

export default App;
