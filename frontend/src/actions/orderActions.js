import axios from "axios";
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_PAYMENT_MP,

    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,

    ORDERS_LIST_REQUEST,
    ORDERS_LIST_SUCCESS,
    ORDERS_LIST_FAIL,
    ORDERS_LIST_RESET,

    ORDERS_ALL_LIST_REQUEST,
    ORDERS_ALL_LIST_SUCCESS,
    ORDERS_ALL_LIST_FAIL,

    ORDER_UPDATE_PAID_REQUEST,
    ORDER_UPDATE_PAID_SUCCESS,
    ORDER_UPDATE_PAID_FAIL,

    ORDER_UPDATE_DELIVERED_REQUEST,
    ORDER_UPDATE_DELIVERED_SUCCESS,
    ORDER_UPDATE_DELIVERED_FAIL,

} from "../constants/orderConstants";



export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.post(`http://localhost:8000/api/orders/add/`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/orders/${id}/`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const getUserOrders = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDERS_LIST_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/orders/user/${id}/`, config);

        dispatch({
            type: ORDERS_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDERS_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}


export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST,
        });


        /// MercadoPago //////////////////////////////

        const { orderDetails: { order }, } = getState();

        const expirationDate = new Date(order.expiryDate).getTime()

        if (expirationDate < Date.now()) {
            dispatch({
                type: ORDER_PAY_FAIL,
                payload: "La orden ha expirado",
            });

        } else {

            const url = "https://api.mercadopago.com/checkout/preferences";

            let orderNames = order.OrderItems.map((item) => item.name + ' x ' + item.qty + ' | \n').join(" ");
            const body = {
                "items": [
                    {
                        "id": order.id,
                        "title": orderNames,
                        "picture_url": "https://http2.mlstatic.com/D_NQ_NP_2X_692019-MLA43820000001_102020-O.webp",
                        "quantity": 1,
                        "description": 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                        "currency_id": "ARS",
                        "unit_price": Number(order.totalPrice),
                    }
                ],
                "payer": {
                    "name": order.user.name,
                    "email": order.user.email,
                    "address": {
                        "street_name": `${order.ShippingAddress.address}, ${order.ShippingAddress.city}`,
                        "zip_code": order.ShippingAddress.postalCode
                    }
                },
                "back_urls": {
                    "success": "http://localhost:5173",
                    "failure": "http://www.failure.com",
                    "pending": "http://www.pending.com"
                },
                "auto_return": "approved",
                // "notification_url": "http://localhost:8000/api/orders/pay/",
                "statement_descriptor": "Zoldyck Store",
                "external_reference": order.id,
                "expires": false,
            }

            const { data } = await axios.post(url, body, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer APP_USR-944357534465341-092314-60cc827acfdc0e3ff80e99b84db94e81-1203886094"
                }
            });

            // //////////////////////////////////////////////

            dispatch({
                type: ORDER_PAY_SUCCESS,
                payload: data,
            });

        }
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDERS_LIST_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/orders/myorders/`, config);

        dispatch({
            type: ORDERS_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDERS_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const listAllOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDERS_ALL_LIST_REQUEST,
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`http://localhost:8000/api/orders/`, config);

        dispatch({
            type: ORDERS_ALL_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDERS_ALL_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const updateDeliverOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_UPDATE_DELIVERED_REQUEST
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`http://localhost:8000/api/orders/update/delivered/${id}/`, {}, config);

        dispatch({
            type: ORDER_UPDATE_DELIVERED_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_DELIVERED_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

export const updatePaidOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_UPDATE_PAID_REQUEST
        });

        const {
            login: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`http://localhost:8000/api/orders/update/paid/${id}/`, {}, config);

        dispatch({
            type: ORDER_UPDATE_PAID_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ORDER_UPDATE_PAID_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}