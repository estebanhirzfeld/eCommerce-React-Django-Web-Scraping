
import { createStore, applyMiddleware, combineReducers } from 'redux';

import { productListReducers, productDetailsReducers, productDeleteReducers, productCreateReducers, productUpdateReducers, productCreateReviewReducers} from './reducers/productReducers.js';
import { cartReducer } from './reducers/cartReducers';
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, ordersListReducer, ordersListAdminReducer, orderUpdatePaidReducer, orderUpdateDeliveredReducer } from './reducers/orderReducers';

import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({
    productList: productListReducers,
    productDetails: productDetailsReducers,
    productDelete: productDeleteReducers,
    productCreate: productCreateReducers,
    productUpdate: productUpdateReducers,

    productCreateReview: productCreateReviewReducers,

    cart: cartReducer,

    login: userLoginReducer,
    register: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    ordersList: ordersListReducer,



    ordersListAdmin: ordersListAdminReducer,
    orderUpdatePaid: orderUpdatePaidReducer,
    orderUpdateDelivered: orderUpdateDeliveredReducer,

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