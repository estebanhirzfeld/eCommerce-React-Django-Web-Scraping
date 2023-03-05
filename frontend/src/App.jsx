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
import WishlistScreen from './screens/WishListScreen.jsx'

import ADMIN_PanelScreen from './screens/ADMIN_PanelScreen.jsx'

import ADMIN_ListUsersScreen from './screens/ADMIN_ListUsersScreen.jsx'
import ADMIN_UserDetailsScreen from './screens/ADMIN_UserDetailsScreen.jsx'
import ADMIN_EditUserScreen from './screens/ADMIN_EditUserScreen.jsx'

import ADMIN_ListOrdersScreen from './screens/ADMIN_ListOrdersScreen.jsx'
import ADMIN_ListOrdersStatusScreen from './screens/ADMIN_ListOrdersStatusScreen.jsx'

import ADMIN_ListProductsScreen from './screens/ADMIN_ListProductsScreen.jsx'
import ADMIN_EditProductScreen from './screens/ADMIN_EditProductScreen.jsx'

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
          <Route path='/category/:category' element={
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

          <Route path='/wishlist/' element={
            <Container>
              <WishlistScreen />
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
              <PaymentScreen />
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
              <OrderScreen />
            </Container>
          }
          />
          <Route path='/admin/users' element={
            <Container>
              <ADMIN_ListUsersScreen />
            </Container>
          }
          />
          <Route path='admin/user/:id' element={
            <Container>
              <ADMIN_UserDetailsScreen />
            </Container>
          }
          />
          <Route path='/admin/user/:id/edit' element={
            <Container>
              <ADMIN_EditUserScreen />
            </Container>
          }
          />
          <Route path='admin/orders' element={
            <Container>
              <ADMIN_ListOrdersScreen />
            </Container>
          }
          />
          <Route path='admin/orders/:status' element={
            <Container>
              <ADMIN_ListOrdersStatusScreen />
            </Container>
          }
          />
          <Route path='admin' element={
            <Container>
              <ADMIN_PanelScreen />
            </Container>
          }
          />
          <Route path='admin/products' element={
            <Container>
              <ADMIN_ListProductsScreen />
            </Container>
          }
          />
          <Route path='admin/product/:id/edit' element={
            <Container>
              <ADMIN_EditProductScreen />
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
