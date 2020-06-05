import React from "react";
import { Modal } from "react-responsive-modal";

import { FiCheckCircle } from "react-icons/fi";

export interface ModalProps {
  setModalVisible: (visible: boolean) => void;
  modalVisible: boolean;
}

const GenericModal = ({ setModalVisible, modalVisible }: ModalProps) => {
  return (
    <Modal
      open={modalVisible}
      onClose={() => setModalVisible(false)}
      closeOnOverlayClick
    >
      <FiCheckCircle />
      <h2>Cadastro concluído!</h2>
    </Modal>
  );
};

export default GenericModal;
