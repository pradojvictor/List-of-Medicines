import './index.css'
import CardMenu from '../CardMenu';

export default function Menu() {

    return (
        <div className='contane-menu'>
            <CardMenu title="contato" content={<div>oi</div>} />
            <CardMenu title="duvidas" content={<div></div>} />
            <CardMenu title="como usar" content={<div></div>} />
            <CardMenu title="autor" content={<div></div>} />
        </div>
    );
}