import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function Alert(props) {
  return (    
    <Modal show={true} onHide={props.handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>{props.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            OK
          </Button>         
        </Modal.Footer>
      </Modal>
  )
}

export default Alert