import BASE_URL from '../../constants';

import Carousel from 'react-bootstrap/Carousel';
import {Image} from 'react-bootstrap';
function CustomCarrousel({items}) {

    console.log('props', items)

    return (
        <Carousel>
            {
                items.map((item, index) => {
                    return (
                        <Carousel.Item key={index} className="text-center">
                            <span>{item.name} ({item.size}) x {item.qty}</span>
                            <p>{item.description}</p>
                            <Image src={`${BASE_URL}${item?.image}`} alt={item.name} fluid rounded />
                        </Carousel.Item>
                    )
                })
            }
        </Carousel>
    );
}
export default CustomCarrousel;