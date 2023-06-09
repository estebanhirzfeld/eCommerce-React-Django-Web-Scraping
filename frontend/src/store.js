
import { createStore, applyMiddleware, combineReducers } from 'redux';

import { productListReducers, productDetailsReducers, productRecommendReducers, productDeleteReducers, productCreateReducers, productUpdateReducers, productCreateReviewReducers, productImageDeleteReducers, productNotifyReducers } from './reducers/productReducers.js';
import { cartReducer } from './reducers/cartReducers';
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer, userPasswordSendResetEmailReducer, userPasswordResetReducer } from './reducers/userReducers';
import { orderPreCreateReducer, orderCreateReducer, orderDetailsReducer, orderDetailsUnloggedReducer, orderPayReducer, ordersListReducer, ordersListAdminReducer, orderUpdatePaidReducer, orderUpdateDeliveredReducer, orderUploadProofUnloggedReducer, orderAddTrackingNumberReducer, orderDeleteTrackingNumberReducer, orderAddTrackingUrlReducer, orderDeleteTrackingUrlReducer } from './reducers/orderReducers';
import { addressReducer, addressCreateReducer } from './reducers/addressReducers';

import { wishlistReducer, saveForLaterReducer } from './reducers/listsReducers';
import { tickerMessageReducer } from './reducers/adminReducers';

import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';




const reducer = combineReducers({
    productList: productListReducers,
    productDetails: productDetailsReducers,
    productRecommend: productRecommendReducers,
    productDelete: productDeleteReducers,
    productCreate: productCreateReducers,
    productUpdate: productUpdateReducers,
    productImageDelete: productImageDeleteReducers,

    productCreateReview: productCreateReviewReducers,
    productNotify: productNotifyReducers,

    cart: cartReducer,
    wishlist: wishlistReducer,
    saveForLater: saveForLaterReducer,

    login: userLoginReducer,
    register: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,

    userPasswordSendResetEmail: userPasswordSendResetEmailReducer,
    userPasswordReset: userPasswordResetReducer,

    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    orderPreCreate: orderPreCreateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderDetailsUnlogged: orderDetailsUnloggedReducer,
    orderPay: orderPayReducer,
    orderUploadProofUnlogged: orderUploadProofUnloggedReducer,
    ordersList: ordersListReducer,

    orderAddTrackingNumber: orderAddTrackingNumberReducer,
    orderDeleteTrackingNumber: orderDeleteTrackingNumberReducer,
    orderAddTrackingUrl: orderAddTrackingUrlReducer,
    orderDeleteTrackingUrl: orderDeleteTrackingUrlReducer,

    addresses: addressReducer,
    addressCreate: addressCreateReducer,
    
    ordersListAdmin: ordersListAdminReducer,
    orderUpdatePaid: orderUpdatePaidReducer,
    orderUpdateDelivered: orderUpdateDeliveredReducer,
    
    tickerMessage: tickerMessageReducer,

});

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
    ? JSON.parse(localStorage.getItem('paymentMethod'))
    : {};


const initialState = {
    // cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage, paymentMethod: paymentMethodFromStorage },
    login: { userInfo: userInfoFromStorage }
};

const middleware = [thunk];

const store = createStore(reducer, initialState,
    // applyMiddleware(...middleware)

    composeWithDevTools(applyMiddleware(...middleware)));

export default store;