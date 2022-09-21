import React from 'react'

import { Link } from 'react-router-dom'

const categories = ['hombre', 'mujer', 'ninos', 'accesorios']

function Test() {
    return (
        <>

            <div className="container">
                <div className="row">
                    <h1 className='col-12 my-2 text-center text-primary'>Rusty</h1>
                    <h2 className='col-12 my-2 text-center text-primary'>Temporada 2023 Comming Soon</h2>
                    <img className='col-12 my-5 rounded' src="https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />

                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 1</p>
                    </div>
                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 2</p>
                    </div>
                    <div className='col-4'>
                        <img className='col-12 rounded' src="https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
                        <p className='text-center'>texto imagen 3</p>
                    </div>
                </div>
            </div>


            <div className="container">
                <div className="row">
                    <strong class='col-12 col-lg-6'>Pack Monotributo</strong>
                    <p class='col-12 col-lg-6'>
                        Inscripción en el Régimen Simplificado de Monotributo
                        Inscripción en Impuestos Provinciales
                        Recategorizaciones Semestrales
                        Presentaciones Mensuales y Anuales de Impuestos Provinciales
                        Avisos de vencimientos
                    </p>
                </div>
                <div className="row">
                    <strong class='col-12 col-lg-6'>Pack Responsable Inscripto</strong>
                    <p class='col-12 col-lg-6'>
                        Inscripciones en IVA, Impuesto a las Ganancias, Autónomos e Impuestos Provinciales
                        Presentación mensual de IVA y Libro IVA Digital
                        Proyección de Impuesto a las Ganancias
                        Avisos de vencimientos y generación de Volantes Electrónicos de Pago
                    </p>
                </div>
                <div className="row">
                    <strong class='col-12 col-lg-6'>Regularizaciones</strong>
                    <p class='col-12 col-lg-6'>
                        Elaboración de un diagnóstico de la situación actual y propuestas con las posibles alternativas de solución
                    </p>
                </div>
                <div className="row">
                    <strong class='col-12 col-lg-6'>Sueldos y Cargas Sociales</strong>
                    <p class='col-12 col-lg-6'>
                        Elaboración de presupuestos
                        Liquidación mensual de sueldos y cargas sociales según el Convenio Colectivo de Trabajo correspondiente
                        Renuncias, despidos, licencias, etc
                    </p>
                </div>
            </div>

        </>
    )
}

export default Test