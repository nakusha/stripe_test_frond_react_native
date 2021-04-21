import request from "./Request";

const BillingService = {
  createCustomer: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/createCustomer';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  createPrice: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/createPrice';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  createSubscription: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/createSubscription';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  createSubSchedule: (data) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/createSubSchedule';

    return request({
      url:`${host}${path}`,
      method:'post',
      data:data
    });
  },
  getSubscription:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/getSubscription';

    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  },
  cancelSubscription:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/cancelSubscription';

    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  },
  getInvoice:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/getInvocie';
    
    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  },
  getInvoiceListBySubscription:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/getInvocieBySubscription';
    
    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  },
  getCustomer:(param) => {
    const host = 'http://10.0.2.2:4242';
    const path = '/billing/getCustomer';

    return request({
      url:`${host}${path}${param}`,
      method:'get',
    });
  },
}

export default BillingService;