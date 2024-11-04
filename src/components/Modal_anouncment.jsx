import "../style/modal_anouncment.css"

function Modal_anouncment(modalText) {


    return ( 

        <div className="modalBox">
            <p>{modalText.modalText.value}</p>
        </div>

    );
}

export default Modal_anouncment;