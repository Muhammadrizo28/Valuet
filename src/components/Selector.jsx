import { useState } from "react";
import "../style/selector.css"; 
import narrow_img from '../images/Overview_page/narrowDown.png';
import PropTypes from 'prop-types';

function Selector({ main, options, customStyles = {}, arrowSize = null, onDataChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(main);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onDataChange(option); 
        setIsOpen(false);
    };
  
    return (
      <div style={customStyles} className={'selector'}>
        <div className="selector-main" onClick={toggleDropdown}>
          <span>{selectedOption}</span>
          <img 
            className={`arrow ${isOpen ? "open" : ""}`} 
            style={arrowSize ? arrowSize : {width : "7%"}} 
            src={narrow_img}
            alt="dropdown arrow" 
          />
        </div>
        {isOpen && (
          <div className="selector-options">
            {options.map((option, index) => (
              <div
                key={index}
                className="selector-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
}

Selector.propTypes = {
    main: PropTypes.string,
    options: PropTypes.array,
    customStyles: PropTypes.any,
    arrowSize : PropTypes.object,
    onDataChange: PropTypes.func.isRequired, 
};

export default Selector;
