import '../style/container.css';
import PropTypes from 'prop-types';
import ModalWindow from './ModalWindow';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModalValue } from '../store';

function Container({ children }) {
  const [show, setShow] = useState(false);
  const isFirstRender = useRef(true);

  const modalWind = useSelector((state) => state.modalWindow.value);

  const dispatch = useDispatch()

  useEffect(() => {

    if (isFirstRender.current) {

      isFirstRender.current = false; 

    } 
    else if (modalWind) {

      setShow(true); 
    }

    

  }, [modalWind]);

  const clickFunc = () => {

    setShow(false);
    dispatch(setModalValue(null))

  };

  return (

    <div className='container'>

      {children}

      {show && <ModalWindow click={clickFunc} type = {modalWind} />}

    </div>
  );
}

Container.propTypes = {

  children: PropTypes.node.isRequired

};

export default Container;
