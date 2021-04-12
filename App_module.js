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

const STRIPE_PUBLISHABLE_KEY = "pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx";
const server_key = "sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6";

const App = () => {
  // const [number, setNumber] = useState("4000002500003155");
  const [number, setNumber] = useState("4242424242424242");
  const [expYear, setExpYear] = useState(2022);
  const [expMonth, setExpMonth] = useState(12);
  const [cvc, setCVC] = useState("123");
  const [pm, setPM] = useState();
  const [cs, setCS] = useState();
  const [uri, setUri] = useState("https://www.naver.com")

  const scaWebView = () => {

  }

  const getPaymentMethod = () => {
    const card = {
      "card[number]": number,
      "card[exp_month]": expMonth,
      "card[exp_year]": expYear,
      "card[cvc]": cvc
    };
    return fetch('https://api.stripe.com/v1/payment_methods?type=card', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`
      },
      method: 'post',
      body: Object.keys(card)
        .map(key => key + '=' + card[key])
        .join('&')
    }).then((response) => {
      if (response.status == 200) {
        return response.json();
      }
    })
      .then((responseJson) => {
        setPM(responseJson.id);
        return responseJson;
    })
      .catch((error) => {
      return error;
    });
  };

  const createPaymentIntent =  ( amount ) => {
    return fetch(`https://api.stripe.com/v1/payment_intents?amount=10000&currency=eur&payment_method_types[]=card`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + server_key
      },
      method: 'post',
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
    })
      .then((responseJson) => {
        const payment_intent = responseJson.client_secret.substring(0, responseJson.client_secret.indexOf("_secret_"));
        setCS(payment_intent)
        return responseJson;
    })
      .catch((error) => {
        return error;
    });
  }

  const createPayment = async () => {
    
    const result = await fetch(`https://api.stripe.com/v1/payment_intents/${cs}/confirm?payment_method=${pm}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + server_key
      },
    })
    .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
    })
      .then((responseJson) => {
        // console.log(responseJson)
        return responseJson;
    })
      .catch((error) => {
        return error;
    });

    if (result.next_action){
      console.log("Final Result",result.next_action.use_stripe_sdk.stripe_js)
      setUri(result.next_action.use_stripe_sdk.stripe_js)
    }else{
      console.log("Complete")
    }
    
  }

  const capturePayment = async () => {
//     # To create a requires_capture PaymentIntent, see our guide at: https://stripe.com/docs/payments/capture-later
// curl https://api.stripe.com/v1/payment_intents/pi_1IJx412eZvKYlo2COLw1kISf/capture \
//   -u sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6: \
//   -X POST
    // console.log("Capture URL",`https://api.stripe.com/v1/payment_intents/${cs}/capture`);
    const result = await fetch(`https://api.stripe.com/v1/payment_intents/${cs}/capture`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + server_key
      },
    }).then((response) => {
      // console.log("Response", JSON.stringify(response));
      // if (response.status == 200) {
        return response.json();
      // }
    }).then((responseJson) => {
        
        return responseJson;
    }).catch((error) => {
      console.log("ERROR")
      return error;
    });

    console.log("Capture Result : ", result.error.payment_intent.status)
  }
   
  return (
    <View style={{paddingTop:10, backgroundColor:'#1e1f34', flex:1}}>
      <Text style={styles.infoText}>{pm}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={getPaymentMethod}>
        <Text>Payment Method</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>{cs}</Text>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createPaymentIntent}>
        <Text>ClientSecret</Text>
      </TouchableOpacity>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={createPayment}>
        <Text>Create Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
       style={styles.blueButton}
       onPress={capturePayment}>
        <Text>Capture Payment</Text>
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
