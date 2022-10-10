import React, { useState } from "react"
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import 'leaflet/dist/leaflet.css'

//  Map with custom flyTo animation
function ChangeView({ center, zoom }) {
    const map = useMap()
    map.flyTo(center, zoom)
    return null
}

//  Map with custom flyTo animation
const Test = () => {

    const url = 'https://nominatim.openstreetmap.org/search?street=1824&city=Teniente Mario Agustin Del Castillo &state=Buenos+Aires&country=Argentina&postalcode=1838&format=json'

// const url = 'https://nominatim.openstreetmap.org/search?format=json&q='

    let markers = [
        {
            name: "Steve's House",
            position: [-34.7968543, -58.4570987]
        },
        {
            name: "Marker 2",
            position: [51.51, -0.1]
        },
        {
            name: "Marker 3",
            position: [51.51, -0.12]
        }
    ]

    const [position, setPosition] = useState([51.505, -0.09])

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}
            style={{ height: "100vh", width: "100%" }}>
            <ChangeView center={position} zoom={16} />
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} eventHandlers={{
                    click: () => {
                        setPosition(marker.position)
                    }
                }}>
                    <Popup>
                        {marker.name}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}

export default Test