import React from "react"
import ContentLoader from "react-content-loader"
import { Row, Col } from 'react-bootstrap'


const ItemDetailLoader = () => (

    <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
            <ContentLoader
                speed={2}
                viewBox="0 0 500 200"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
            >
                <rect x="3" y="10" rx="0" ry="0" width="203" height="177" />
                <rect x="223" y="10" rx="0" ry="0" width="123" height="60" />
                <rect x="223" y="126" rx="0" ry="0" width="123" height="6" />
                <rect x="223" y="136" rx="0" ry="0" width="123" height="6" />
                <rect x="223" y="146" rx="0" ry="0" width="123" height="6" />
                <rect x="223" y="90" rx="0" ry="0" width="64" height="27" />
                <rect x="357" y="10" rx="0" ry="0" width="105" height="80" />

                <rect x="225" y="76" rx="2" ry="2" width="7" height="7" />
                <rect x="236" y="76" rx="2" ry="2" width="7" height="7" />
                <rect x="247" y="76" rx="2" ry="2" width="7" height="7" />
                <rect x="258" y="76" rx="2" ry="2" width="7" height="7" />
                <rect x="269" y="76" rx="2" ry="2" width="7" height="7" />
            </ContentLoader>
        </Col>
    </Row>
)

export default ItemDetailLoader

