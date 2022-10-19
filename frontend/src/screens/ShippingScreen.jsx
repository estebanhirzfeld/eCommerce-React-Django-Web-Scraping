import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../actions/cartActions'

import CheckoutSteps from '../components/CheckoutSteps'

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

function ChangeView({ center, zoom }) {
    const map = useMap()
    map.flyTo(center, zoom)
    return null
}

function ShippingScreen() {

    const navigate = useNavigate()

    const [coords, setCoords] = useState([-34.608354, -58.438682])

    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch()



    const getCoordinates = async () => {
        const { data } = await axios.get(`http://nominatim.openstreetmap.org/search?street=${address}&city=${city}&state=${city}&country=${country}&postalcode=${postalCode}&format=json`)
        

        console.log(data)

        setCoords([
            // max digits 9 and 6 decimal places
            parseFloat(data[0].lat).toFixed(6),
            parseFloat(data[0].lon).toFixed(6)
        ])
    }


    useEffect(() => {
        if(shippingAddress.lat && shippingAddress.lon) {
            setCoords([
                shippingAddress.lat,
                shippingAddress.lon
            ])
        }
        else {
            getCoordinates()
        }
    }, [cart.shippingAddress])
    




    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country, lat: parseFloat(coords[0]), lon: parseFloat(coords[1]) }))
        navigate('/payment')
    }

    let paymentData = localStorage.getItem('paymentMethod')


    return (

        <Container className='mt-5'>
                    <h1 className='text-center'>Shipping</h1>
                    {
                        paymentData ? (
                            <CheckoutSteps step1 step2 />
                        ) : (
                            <CheckoutSteps step1 />
                        )
                    }
            <Row className='justify-content-md-center'>
                <Col xs={12} md={6}>
                    <Form onSubmit={(e) => { submitHandler(e) }}>

                        <Form.Group className="my-3" controlId='country'>
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter country'
                                onChange={(e) => setCountry(e.target.value)}
                                value={country}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='city'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter city'
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='postalCode'>
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter postal code'
                                onChange={(e) => setPostalCode(e.target.value)}
                                value={postalCode}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="my-3" controlId='address'>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                required
                                type='text'
                                placeholder='Enter address'
                                // onChange setAddress 
                                onChange={(e) => { setAddress(e.target.value)}}
                                // onfocusout getCoordinates
                                onBlur={() => getCoordinates()}
                                value={address}
                            ></Form.Control>
                        </Form.Group>

                        <div className='mt-5 d-flex justify-content-end'>
                            <Button type='submit' variant='primary'>
                                Continue
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={12} md={6}>

                    <MapContainer center={coords} zoom={15} scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}>
                        <ChangeView center={coords} zoom={18} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* draggable marker */}
                        <Marker position={coords} draggable={true}
                            eventHandlers={{
                                dragend: (e) => {
                                    setCoords([e.target.getLatLng().lat.toFixed(6), e.target.getLatLng().lng.toFixed(6)])
                                }
                            }}
                        >
                            <Popup>
                                {address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </Col>
            </Row>
        </Container>

    )
}

export default ShippingScreen