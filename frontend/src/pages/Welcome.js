import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Welcome.css'

function Welcome() {

    const navigate = useNavigate();
    const handleMoveForward = () => {
        navigate('/login');
    };

    return (
        <div className="welcome_container" >
            <div className="welcome_left_container">
                <h1 className="welcome_h1">StockSync</h1>
            </div>
            <div className="welcome_right_container">
                <h2 className="welcome_h2">We Welcome You To StockSync</h2>

                <p className="welcome_p">Efficient inventory management is crucial for businesses to track stock, reduce losses, and streamline operations. Without a proper system, businesses struggle with overstocking, stockouts, and mismanagement.
                    StockWise simplifies inventory tracking, optimizes stock levels, and ensures real-time updates, so you never lose control of your inventory again!
                </p>
                <button onClick={handleMoveForward} className="welbutton"  >Next</button>
                <p className="welcome_p">Get started today and take charge of your inventory effortlessly!</p>
            </div>




        </div>

    );

}

export default Welcome;