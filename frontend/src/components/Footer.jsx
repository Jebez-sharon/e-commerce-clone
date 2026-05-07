import { Link } from "react-router-dom";
import {FiShield, FiRefreshCw, FiCheck} from "react-icons/fi";
import{FaFacebook, FaInstagram, FaTwitter, FaPinterest} from "react-icons/fa";
import "../styles/Footer.css";
function Footer(){
    return(
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-col">
                    <h4>AJIO</h4>
                    <ul>
                        <li><a href="#">Who We Are</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Fees & Payments</a></li>
                        <li><a href="#">Returns & Refunds</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Help</h4>
                    <ul>
                        <li><Link to="/orders">Track Your Order</Link></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Returns</a></li>
                        <li><a href="#">Cancellations</a></li>
                        <li><a href="#">Payments</a></li>
                        <li><a href="#">Customer Care</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Shop By</h4>
                    <ul>
                        <li><Link to="/men">Men</Link></li>
                        <li><Link to="/women">Women</Link></li>
                        <li><Link to="/kids">Kids</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/wishlist">Wishlist</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Follow Us</h4>
                    <div className="footer-social">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaPinterest /></a>
                    </div>

                    <h4 style={{marginTop:"24px"}}>We Accept</h4>
                    <ul>
                        <li><a href="#">Credit / Debit Cards</a></li>
                        <li><a href="#">Net Banking</a></li>
                        <li><a href="#">UPI</a></li>
                        <li><a href="#">Cash on Delivery</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-bottom-logo">AJIO</span>

                <div className="footer-badges">
                    <div className="footer-badge">
                        <FiRefreshCw size={14}/>
                        <span>Easy Exchange</span>
                    </div>
                    <div className="footer-badge">
                        <FiCheck size={14}/>
                        <span>100% Handpicked</span>
                    </div>
                    <div className="footer-badge">
                        <FiShield size={14}/>
                        <span>Assured Quality</span>
                    </div>
                </div>

                <p> &copy; 2026 AJIO Clone. All rights reserved</p>
            </div>
        </footer>
    )
}
export default Footer;