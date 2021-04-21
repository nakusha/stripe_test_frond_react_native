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
  const [deposit, setDeposit] = useState();
  const [subscription, setSubscription] = useState();
  const [subSchedule, setSubSchedule] = useState();
  const sub_id = "sub_JIzT7IjEC3VGBW";
  const sub_id2 = "sub_JKnHVonieIYl91";

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
      name:'Subscription Test',
      isRecurring:true,
      interval:'day',
      amount:3000,
    }
    const result = await BillingService.createPrice(price);
    setPrice(result.data.id)
  }

  const createDeposit = async () => {
    const price = {
      name:'Deposit',
      isRecurring:false,
      amount:4000
    }
    const result = await BillingService.createPrice(price);
    setDeposit(result.data.id)
  }

  const createSubscription = async () => {
    const sub = {
      customer:customer,
      price:price,
      deposit: deposit ? deposit : null,
    }

    const result = await BillingService.createSubscription(sub);
    console.log("URLS", result.data.items.url)
    if (result.data.status === 'active') {
      setSubscription(result.data.id)
    }else if (result.data.status === 'incomplete') {
      setSubscription(result.data.status)
      let param = `?id=${result.data.latest_invoice}`
      const invoiceInfo = await BillingService.getInvoice(param);
      console.log("INVOCIE STATUS : ", invoiceInfo.status)
      if (invoiceInfo.data.payment_intent) {
        param = `?id=${invoiceInfo.data.payment_intent}`;
        const paymentIntent = await PaymentService.getPaymentIntet(param);
        console.log("PI : ", paymentIntent.data.next_action.use_stripe_sdk.stripe_js)
      }
    }else {
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
      deposit: deposit ? deposit : null,
      // start_date:moment().add(1, 'M').set('hour',9).set('minute',0).set('second',0).set('millisecond',0).format('x')/1000,
      start_date:moment().add(1, 'm').set('second',0).set('millisecond',0).format('x')/1000,
      iterations:3
    }

    const result = await BillingService.createSubSchedule(sub);
    if (result.data.status === 'active') {
      setSubSchedule(result.data.id)
    }else if (result.data.status === 'incomplete') {
      setSubSchedule(result.data.status)
      let param = `?id=${result.data.latest_invoice}`
      const invoiceInfo = await BillingService.getInvoice(param);
    
      if (invoiceInfo.data.payment_intent) {
        param = `?id=${invoiceInfo.data.payment_intent}`;
        const paymentIntent = await PaymentService.getPaymentIntet(param);
        console.log("PI : ", paymentIntent.data.next_action.use_stripe_sdk.stripe_js)
      }
    }else {
      setSubSchedule(result.data.status)
    }
  }

  const getSubscription = async () => {
    const param = `?id=${sub_id}`
    const result = await BillingService.getSubscription(param);
    console.log("Subscription Info : ", JSON.stringify(result.data))
  }
   
  const getCustomer = async () => {
    const param = '?id=cus_JIzQU7bSjvg8JM'
    const result = await BillingService.getCustomer(param);
    console.log(JSON.stringify(result.data))
  }

  const refundInvoice = async () => {
    const param = `?id=${sub_id2}`
    const result = await BillingService.getInvoiceListBySubscription(param);
    const pi_list = result.data.data.map(data => {
      return data.payment_intent;
    })
    
    await Promise.all(pi_list.map(pi => {
      if (pi) {
        console.log(pi)
        refundPayment(pi);
      }  
    }))
  }

  const refundPayment = async (pi) => {
    const param = `?id=${pi}`
    const result = await PaymentService.refundPaymentIntent(param)
    console.log(result.data);
  }

  const cancelSubscription = async () => {
    const param = `?id=${sub_id2}`
    const result = await BillingService.cancelSubscription(param)
    console.log(result.data);
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
      <Text style={styles.infoText}>{deposit}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createDeposit}>
        <Text>Create Deposit</Text>
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
       onPress={cancelSubscription}>
        <Text>Cancel Subscription</Text>
      </TouchableOpacity>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={refundInvoice}>
        <Text>Refund Invoice</Text>
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
