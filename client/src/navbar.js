

export default function Navbar(){
    return <nav className="nav">
        <h className="site-title">Press-NHT Division.</h>
        <ul>
            <li>
                <a href="curmodel">Set Current Model</a>
            </li>
            <li>
            <a href="check_material_size">Check Material Size</a>
            </li>
            <li className="active">
                <a href="upload">Upload</a>
            </li>
            <li>
                <a href="stock">Material Stock</a>
            </li>

        </ul>
    </nav>
}   