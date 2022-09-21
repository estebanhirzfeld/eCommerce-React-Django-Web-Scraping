import { Container } from 'react-bootstrap'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import Test from './screens/Test'

import { useState } from 'react'
import reactLogo from './assets/react.svg'

import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import ShippingScreen from './screens/ShippingScreen.jsx'
import PaymentScreen from './screens/PaymentScreen.jsx'
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx'
import OrderScreen from './screens/OrderScreen.jsx'

function App() {

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Routes>
          <Route path='/' element={
            <Container>
              <HomeScreen />
            </Container>
          } />
          <Route path='/product/:id' element={
            <Container>
              <ProductScreen />
            </Container>
          } />
          <Route path='/cart/' element={
            <Container>
              <CartScreen />
            </Container>
          } />
          <Route path='/test'
            element={
              <Container>
                <Test />
              </Container>
            }
          />
          <Route path='/login' element={
            <Container>
              <LoginScreen />
            </Container>
          }
          />
          <Route path='/register' element={
            <Container>
              <RegisterScreen />
            </Container>
          }
          />
          <Route path='/profile' element={
            <Container>
              <ProfileScreen />
            </Container>
          }
          />
          <Route path='/shipping' element={
            <Container>
              <ShippingScreen />
            </Container>
          }
          />
          <Route path='/payment' element={
            <Container>
              <PaymentScreen/>
            </Container>
          }
          />
          <Route path='placeorder' element={
            <Container>
              <PlaceOrderScreen />
            </Container>
          }
          />
          <Route path='/order/:id' element={
            <Container>
              <OrderScreen/>
            </Container>
          }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
