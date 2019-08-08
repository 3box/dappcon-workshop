import React from 'react';

// import BoxLogo from './3BoxLogo';
import CrossOut from '../../assets/CrossOut.svg';
import '../styles/index.scss';

export const ModalBackground = () => <div className="modal_overlay" />;

export const NewTopicModal = (props) => {
  const {
    handleAppModals,
    isTopicOpen,
    isTopicClosed,
    handleTopicModalRadio,
  } = props;

  return (
    <div className="modal__container">
      <div className="modal">
        <button
          className="modal_closeModal"
          onClick={() => handleAppModals('NewTopicModal')}
        >
          <img src={CrossOut} alt="close" />
        </button>

        <div className="modal_form">
          <h2>What do you want to discuss?</h2>
          <input
            className="modal_form_input"
            type="text"
            placeholder="Name your topic"
          />
        </div>

        <div className="modal_options">
          <p>
            Who can join this topic?
          </p>
          <div className="modal_options_menu">
            <div className="modal_options_menu_choice">
              <label for="topicOpen">
                Anyone
              </label>
              <input
                type="radio"
                name="address"
                value={isTopicOpen}
                checked={isTopicOpen}
                onChange={handleTopicModalRadio}
                id="topicOpen"
              />
            </div>

            <div className="modal_options_menu_choice">
              <label for="topicClosed">
                Members
              </label>
              <input
                type="radio"
                name="address"
                value={isTopicClosed}
                checked={isTopicClosed}
                onChange={handleTopicModalRadio}
                id="topicClosed"
              />
            </div>
          </div>
        </div>

        <button>
          CREATE
        </button>
      </div>
    </div>
  )
};
export const AddNewModeratorModal = (props) => {
  const {
    handleAppModals,
  } = props;

  return (
    <div className="modal__container">
      <div className="modal">
        <button
          className="modal_closeModal"
          onClick={() => handleAppModals('AddNewModeratorModal')}
        >
          <img src={CrossOut} alt="close" />
        </button>

        <div className="modal_form">
          <h2>Add new moderator</h2>
          <input
            className="modal_form_input"
            type="text"
            placeholder="Paste Eth address"
          />
        </div>

        <button>
          ADD
        </button>
      </div>
    </div>
  )
};

export const AddNewMemberModal = (props) => {
  const {
    handleAppModals,
  } = props;

  return (
    <div className="modal__container">
      <div className="modal">
        <button
          className="modal_closeModal"
          onClick={() => handleAppModals('AddNewMemberModal')}
        >
          <img src={CrossOut} alt="close" />
        </button>

        <div className="modal_form">
          <h2>Add new member</h2>
          <input
            className="modal_form_input"
            type="text"
            placeholder="Paste Eth address"
          />
        </div>

        <button>
          ADD
        </button>
      </div>
    </div>
  )
};
