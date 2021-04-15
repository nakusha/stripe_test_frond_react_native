import request from "./Request";

const PaymentService = {
  createPaymentMethod: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/createPaymentMethod';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  createPaymentIntent: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/paymentMethod';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  getPaymentIntet:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/payment/paymentIntent';

    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  }
}

export default PaymentService;