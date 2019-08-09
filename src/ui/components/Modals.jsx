import React from 'react';

// import BoxLogo from './3BoxLogo';
import CrossOut from '../../assets/CrossOut.svg';
import '../styles/index.scss';

export const ModalBackground = () => <div className="modal_overlay" />;

export const NewTopicModal = (props) => {
  const {
    handleAppModals,
    isMembersOnly,
    handleCreateTopic,
    topicName,
    handleFormChange
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
            value={topicName}
            onChange={e => handleFormChange(e, 'topicName')}
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
                name="members"
                // checked={!isMembersOnly}
                defaultChecked
                value={false}
                onChange={e => handleFormChange(e, 'isMembersOnly')}
                id="topicOpen"
              />
            </div>

            <div className="modal_options_menu_choice">
              <label for="topicClosed">
                Members
              </label>
              {console.log('isMembersOnly', isMembersOnly)}
              <input
                type="radio"
                name="members"
                value={true}
                // checked={isMembersOnly}
                onChange={e => handleFormChange(e, 'isMembersOnly')}
                id="isMembersOnly"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateTopic}
        >
          CREATE
        </button>
      </div>
    </div>
  )
};

export const AddNewModeratorModal = (props) => {
  const {
    handleAppModals,
    addThreadMod,
    handleFormChange,
    threadMod
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
            value={threadMod}
            onChange={e => handleFormChange(e, 'threadMod')}
          />
        </div>

        <button onClick={addThreadMod}>
          ADD
        </button>
      </div>
    </div>
  )
};

export const AddNewMemberModal = (props) => {
  const {
    handleAppModals,
    addThreadMember,
    threadMember,
    handleFormChange
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
            value={threadMember}
            onChange={e => handleFormChange(e, 'threadMember')}
          />
        </div>

        <button onClick={addThreadMember}>
          ADD
        </button>
      </div>
    </div>
  )
};
