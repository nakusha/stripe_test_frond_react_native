import moment from 'moment';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import { WebView } from 'react-native-webview'
import BillingService from './api/Billing';
import PaymentService from './api/Payment';

// const STRIPE_PUBLISHABLE_KEY = "pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx";
// const server_key = "sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6";

const App = () => {
  // const [number, setNumber] = useState("4000002500003155");
  const [pm, setPM] = useState();
  const [customer, setCustomer] = useState();
  const [price, setPrice] = useState();
  const [subscription, setSubscription] = useState();
  const [subSchedule, setSubSchedule] = useState();

  const getPaymentMethod = async () => {
    const card = {
      // number: "4000002500003155",
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2022,
      cvc: "123"
    };
    const result = await PaymentService.createPaymentMethod(card);
    setPM(result.data.id)
  };

  const createCustomer = async () => {
    const customer = {
      email:`runnway@naver.com`,
      pm:pm
    }
    const result = await BillingService.createCustomer(customer);
    setCustomer(result.data.id)
  }

  const createPrice = async () => {
    const price = {
      name:'Car Name',
      amount:10000
    }
    const result = await BillingService.createPrice(price);
    setPrice(result.data.id)
  }

  const createSubscription = async () => {
    const sub = {
      customer:customer,
      price:price
    }

    const result = await BillingService.createSubscription(sub);
    console.log(result.data.status)
    if (result.data.status === 'active') {
      setSubscription(result.data.id)
    }else if (result.data.status === 'incomplete') {
      setSubscription(result.data.status)
      console.log(result.data)
    }
    //active
    //incomplete
    
  }

  const createSubSchedule = async () => {
    const sub = {
      customer:customer,
      price:price,
      start_date:'',
      iterations:3
    }

    const result = await BillingService.createSubscription(sub);
    setSubscription(result.data.id)
  }
   
  return (
    <View style={{paddingTop:10, backgroundColor:'#1e1f34', flex:1}}>
      <Text style={styles.infoText}>{pm}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={getPaymentMethod}>
        <Text>Payment Method</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{customer}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createCustomer}>
        <Text>Create Customer</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{price}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createPrice}>
        <Text>Create Price</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{subscription}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createSubscription}>
        <Text>Create Subscription</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{subSchedule}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createSubSchedule}>
        <Text>Create SubSchedule</Text>
      </TouchableOpacity>
      {/* <WebView
        source={{uri: uri}}
        style={{flex:1}}/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  infoText:{
    marginTop:10,
    height:20,
    justifyContent:'center',
    alignSelf:'center',
    alignItems:'center',
    width:300,
    color:'#FFF'
  },
  blueButton:{
    marginTop:10,
    marginBottom:10,
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
