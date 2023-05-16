import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Test from './Test'

import { Container, Image } from 'react-bootstrap'

import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetailsUnlogged } from '../actions/orderActions'
import BASE_URL from '../../constants'

function PaymentProofScreen() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('orderId')
    const token = searchParams.get('token')


    const dispatch = useDispatch()
    const navigate = useNavigate()


    const orderDetails = useSelector(state => state.orderDetailsUnlogged)
    const { order, loading, error } = orderDetails


    useEffect(() => {
        dispatch(getOrderDetailsUnlogged(orderId, token))
    }, [dispatch, orderId, token])

    useEffect(() => {
        if (order && order.token !== token) {
            console.log('Order Found, but not for this token, redirecting to home screen')
            navigate(`/`)
        }
        if (order && !order.isPaid) {
            console.log('Unpaid order Found, Please upload your payment proof')
        }
        else if (order && order.isPaid) {
            console.log('Order Found, Payment already made, redirecting to order screen')
            navigate(`/order/${orderId}`)
        }
    }, [order])


    return (
        <Container className="text-center">

            <h1>Upload Payment Proof</h1>
            {/* If order.paymentProof is not null, show the image, else show the form. */}
            {order && order.paymentProof ? (
                <Image src={`${BASE_URL}${order.paymentProof}`} alt={order.paymentProof} fluid rounded />
            ) : (
                loading ? (
                    <h2>Loading...</h2>
                ) : error ? (
                    <h2>{error}</h2>
                ) : (
                    <>
                        <Test id={orderId} token={token} logged={false} />
                    </>
                )
            )}


            {/* <Test>


        </Test> */}
        </Container>
    )
}

export default PaymentProofScreen
