import React, { useState } from "react"

//  Map with custom flyTo animation
const Test = () => {

    const [nombre, setNombre] = useState()
    const [direccion, setDireccion] = useState()
    const [telefono, setTelefono] = useState()


    const handleSubmit = () => {
        alert('nombre: ' + nombre +' direccion: '+ direccion +' telefono: '+ telefono)
    }

    return (
        <>
            <h1>Formulario</h1>

            <form action="" onSubmit={handleSubmit}>
                <p>
                    <label htmlFor="nombre">nombre</label>
                    <input value={nombre} onChange={(e) => { setNombre(e.target.value) }} type="text" name="nombre" />
                </p>

                <p>
                    <label htmlFor="direccion">direccion</label>
                    <input required value={direccion} onChange={(e) => { setDireccion(e.target.value) }} type="text" name="direccion" />
                </p>

                <p>
                    <label htmlFor="nro. de telefono">nro. de telefono</label>
                    <input value={telefono} onChange={(e) => { setTelefono(e.target.value) }} type="text" name="nro. de telefono" />
                </p>

                <p>
                    <button type="submit">Submit</button>
                </p>
            </form>
        </>
    )
}

export default Test