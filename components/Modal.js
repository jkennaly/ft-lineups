import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal = styled.div`
  max-width: 500px;
  background-color: white;
  position: fixed;
  top: 75px;
  z-index: 5;
  max-height: calc(100% - 200px);
  left: calc(50% - 250px);
  display: flex;
  flex-direction: column;
  @media (max-width: 500px) {
    left: 0px;
    margin: 0px 10px;
  }
`;
export const ModalContent = styled.div`
  overflow: auto;
  min-height: 200px;
  padding: 0px 40px;
  padding-bottom: 80px;
`;
export const ModalFooter = styled.div`
  box-shadow: 0px -2px 10px 0px grey;
  height: 60px;
  display: flex;
  justify-content: center;
`;
export const ConfirmButton = styled.div`
  margin: 10px;
  color: white;
  height: 40px;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  width: 200px;
  cursor: pointer;
  background-color: blue;
`;
const ModalShadow = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0px;
  background-color: black;
  opacity: 0.7;
  z-index: 4;
`;
const ModalBanner = styled.div`
  margin-bottom: 20px;
  background-color: blue;
  color: white;
  padding: 10px;
`;
const Input = styled.input`
  text-align: right;
  width: 200px;
  margin-left: 15px;
`;
function ModalContainer({ closeModal, openModal, buttonClasses, data, setData, content, withSubmit, title, submission }) {
  function close() {
    openModal(false);
  }
  function submit(e) {
  	e.preventDefault()
  	submission && submission[0](submission[1])
    close();
  }
  
  return ReactDOM.createPortal(
    <>
      <ModalShadow onClick={close} />
      <Modal>
        <ModalBanner>{title}</ModalBanner>
        <ModalContent>
          {content}
        </ModalContent>
        <ModalFooter>
	        <button
		        onClick={closeModal}
		        type="button"
		        className={"mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"}
		    >
		      	Cancel
		    </button>
		    {withSubmit ? 
          <ConfirmButton onClick={submit}> Submit </ConfirmButton>
           : ''}
        </ModalFooter>
      </Modal>
    </>,
    document.getElementById('app-modal'),
  );
}
export function ModalPopper(props) {

  return (
    <div>

      {!props.buttonHide && <button
        onClick={() => {
          props.openModal()

        }}
        type="button"
        className={props.buttonClasses}
      >
        {props.buttonContent}
      </button>}
      {!props.hidden && (
        <ModalContainer
          {...props}
        />
      )}
    </div>
  );
}