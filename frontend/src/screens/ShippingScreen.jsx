import React, { useState, useEffect } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getAddress, createAddress } from '../actions/addressActions'


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

    const [is_address, setIsAddress] = useState(false)
    const [was_clicked, setWasClicked] = useState(false)

    const [coords, setCoords] = useState([-34.608354, -58.438682])

    const dispatch = useDispatch()

    const addresses = useSelector(state => state.addresses)
    const { shippingAddresses } = addresses

    const addressCreate = useSelector(state => state.addressCreate)
    const { success } = addressCreate

    const [address, setAddress] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')

    const submitHandler = async (e) => {

        e.preventDefault()

        const { data } = await axios.get(`http://nominatim.openstreetmap.org/search?street=${address}&city=${city}&state=${province}&country=Argentina&postalcode=${postalCode}&format=json`)

        if (!was_clicked) {
            if (data[0]) {
                setIsAddress(true)
                setWasClicked(true)
                setCoords([data[0].lat, data[0].lon])

            } else {
                setIsAddress(false)
                setWasClicked(true)
                if (success) {
                    navigate('/payment')
                }
            }
        } else {
            e.preventDefault()
            dispatch(createAddress({
                address,
                postalCode,
                city,
                province,
                lat: coords[0],
                lon: coords[1]
            }))
            if (success) {
                navigate('/payment')
            }
        }
    }

    useEffect(() => {
        dispatch(getAddress())
    }, [dispatch])

    // set the address to the first address in the list
    useEffect(() => {
        if (shippingAddresses.length > 0) {
            setAddress(shippingAddresses[0].address)
            setPostalCode(shippingAddresses[0].postalCode)
            setCity(shippingAddresses[0].city)
            setProvince(shippingAddresses[0].province)
        }
    }, [shippingAddresses])

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
                            <Form.Label>Province</Form.Label>
                            {/* province choices */}
                            <Form.Select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            >
                                <option value="Capital Federal">Capital Federal</option>
                                <option value="Gran Buenos Aires">Gran Buenos Aires</option>
                                <option value="Buenos Aires">Buenos Aires</option>
                                <option value="Catamarca">Catamarca</option>
                                <option value="Chaco">Chaco</option>
                                <option value="Chubut">Chubut</option>
                                <option value="Córdoba">Córdoba</option>
                                <option value="Corrientes">Corrientes</option>
                                <option value="Entre Ríos">Entre Ríos</option>
                                <option value="Formosa">Formosa</option>
                                <option value="Jujuy">Jujuy</option>
                                <option value="La Pampa">La Pampa</option>
                                <option value="La Rioja">La Rioja</option>
                                <option value="Mendoza">Mendoza</option>
                                <option value="Misiones">Misiones</option>
                                <option value="Neuquén">Neuquén</option>
                                <option value="Río Negro">Río Negro</option>
                                <option value="Salta">Salta</option>
                                <option value="San Juan">San Juan</option>
                                <option value="San Luis">San Luis</option>
                                <option value="Santa Cruz">Santa Cruz</option>
                                <option value="Santa Fe">Santa Fe</option>
                                <option value="Santiago del Estero">Santiago del Estero</option>
                                <option value="Tierra del Fuego">Tierra del Fuego</option>
                                <option value="Tucumán">Tucumán</option>
                            </Form.Select>

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
                                onChange={(e) => { setAddress(e.target.value) }}
                                // onfocusout getCoordinates
                                // onBlur={() => getCoordinates()}
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

                {
                    is_address ?
                        (<Col xs={12} md={6}>

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
                        </Col>)
                        : null
                }
            </Row>
        </Container>

    )
}

export default ShippingScreen