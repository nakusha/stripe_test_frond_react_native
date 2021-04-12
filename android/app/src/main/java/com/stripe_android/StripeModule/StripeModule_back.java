package com.stripe_android.StripeModule;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.PaymentIntentResult;
import com.stripe.android.Stripe;
import com.stripe.android.model.ConfirmPaymentIntentParams;
import com.stripe.android.model.PaymentIntent;
import com.stripe.android.model.PaymentMethodCreateParams;

import java.lang.ref.WeakReference;
import java.util.Objects;



public class StripeModule_back extends ReactContextBaseJavaModule {
    private static final int PAYMENT_REQUEST = 1;
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
    private static final String E_PAYMENT_CANCEL = "CANCELLED";
    private static final String E_PAYMENT_FAIL = "FAILED";
    private static final String E_PAYMENT_SUCCESS = "SUCCESS";

    private Callback mCallback;
    private Promise mPickerPromise;
    private Stripe stripe;
    private ReactApplicationContext mContext;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == PAYMENT_REQUEST) {
                Log.d("TEST","@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                stripe.onPaymentResult(requestCode, intent, new PaymentResultCallback(mPickerPromise));
            }
        }
    };


    @NonNull
    @Override
    public String getName() {
        return "StripeModule";
    }

    StripeModule_back(ReactApplicationContext context){
        super(context);
        context.addActivityEventListener(mActivityEventListener);
        mContext = context;

        stripe = new Stripe(context,
                Objects.requireNonNull("pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx")
        );
    }

    @ReactMethod
//    public void createPayment(String clientSecret, String cc, Integer month, Integer year, String cvc, Callback callback){
    public void createPayment(String clientSecret, String cc, Integer month, Integer year, String cvc, final Promise promise){
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject( E_PAYMENT_FAIL, "FAIL");
            return;
        }

        mPickerPromise = promise;

        try{
//            final Intent intent = new Intent(Intent.ACTION_PICK);

            PaymentMethodCreateParams.Card card = new PaymentMethodCreateParams.Card.Builder()
                    .setNumber(cc).setCvc(cvc).setExpiryMonth(month).setExpiryYear(year).build();
            PaymentMethodCreateParams params = PaymentMethodCreateParams.create(card);

            if (params != null) {
                ConfirmPaymentIntentParams confirmParams = ConfirmPaymentIntentParams
                        .createWithPaymentMethodCreateParams(params, clientSecret);
                stripe.confirmPayment(currentActivity, confirmParams);

            }

//            currentActivity.startActivityForResult(intent, PAYMENT_REQUEST);
        } catch (Exception e) {
            mPickerPromise.reject( E_PAYMENT_FAIL, "FAIL");
        }
    }

    private static final class PaymentResultCallback implements ApiResultCallback<PaymentIntentResult> {
        @NonNull private final WeakReference<Promise> mPromise;
        PaymentResultCallback(@NonNull Promise promise) {
            Log.d("TEST","#############################################################");
            mPromise = new WeakReference<>(promise);
        }
        @Override
        public void onSuccess(@NonNull PaymentIntentResult result) {
            Log.d("TEST","$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            PaymentIntent paymentIntent = result.getIntent();
            PaymentIntent.Status status = paymentIntent.getStatus();
            if (status == PaymentIntent.Status.Succeeded) {
                // Payment completed successfully
                final Promise cb = mPromise.get();
//                paymentIntent.getClientSecret()
                cb.resolve(E_PAYMENT_SUCCESS);
            } else if (status == PaymentIntent.Status.RequiresPaymentMethod) {
                // Payment failed – allow retrying using a different payment method
                final Promise cb = mPromise.get();
                cb.reject(E_PAYMENT_FAIL, "NEED PAYMENT METHOD");
            } else if (status == PaymentIntent.Status.Canceled){
                final Promise cb = mPromise.get();
                cb.reject(E_PAYMENT_CANCEL, "NEED PAYMENT METHOD");
            }
        }
        @Override
        public void onError(@NonNull Exception e) {
            Log.d("TEST","%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            // Payment request failed – allow retrying using the same payment method
            final Promise cb = mPromise.get();
            cb.reject(E_PAYMENT_FAIL, "FAIL REQUEST PAYMENT");

        }
    }

}
