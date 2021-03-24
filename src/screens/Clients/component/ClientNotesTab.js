import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Pagination from '../../../common/Pagination/Pagination';
import Table, { TABLE_ROW_ACTIONS } from '../../../common/Table/Table';
import Button from '../../../common/Button/Button';
import BigInput from '../../../common/BigInput/BigInput';
import Loader from '../../../common/Loader/Loader';
import {
  addClientNoteAction,
  deleteClientNoteAction,
  getClientNotesListDataAction,
  updateClientNoteAction,
} from '../redux/ClientAction';
import Modal from '../../../common/Modal/Modal';
import Switch from '../../../common/Switch/Switch';
import { errorNotification } from '../../../common/Toast';
import Input from '../../../common/Input/Input';

const NOTE_ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

const initialClientNoteState = {
  noteId: null,
  description: '',
  isPublic: false,
  type: NOTE_ACTIONS.ADD,
};

const CLIENT_NOTE_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  UPDATE_SINGLE_DATA: 'UPDATE_SINGLE_DATA',
  RESET_STATE: 'RESET_STATE',
};

function clientNoteReducer(state, action) {
  switch (action.type) {
    case CLIENT_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA:
      return {
        ...state,
        [`${action.name}`]: action.value,
      };
    case CLIENT_NOTE_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        ...action.data,
      };
    case CLIENT_NOTE_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialClientNoteState };
    default:
      return state;
  }
}

const ClientNotesTab = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [modifyNoteModal, setModifyNoteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const searchInputRef = useRef();

  const [selectedClientNote, dispatchSelectedClientNote] = useReducer(
    clientNoteReducer,
    initialClientNoteState
  );

  const toggleModifyNotes = useCallback(
    value => setModifyNoteModal(value !== undefined ? value : e => !e),
    [setModifyNoteModal]
  );

  const clientNotesList = useSelector(({ clientManagement }) => clientManagement.notes.notesList);

  const { total, pages, page, limit, docs, headers } = useMemo(() => clientNotesList, [
    clientNotesList,
  ]);

  const getClientNotesList = useCallback(
    (params = {}, cb) => {
      const data = {
        page: page || 1,
        limit: limit || 15,
        ...params,
      };
      dispatch(getClientNotesListDataAction(id, data));
      if (cb && typeof cb === 'function') {
        cb();
      }
    },
    [page, limit]
  );

  const onSelectLimit = useCallback(
    newLimit => {
      getClientNotesList({ page: 1, limit: newLimit });
    },
    [getClientNotesList]
  );

  const addOrUpdateNote = useCallback(async () => {
    const noteData = {
      description: selectedClientNote.description,
      isPublic: selectedClientNote.isPublic,
    };
    if (selectedClientNote.type === NOTE_ACTIONS.ADD) {
      await dispatch(addClientNoteAction(id, noteData));
    } else {
      noteData.noteId = selectedClientNote.noteId;
      await dispatch(updateClientNoteAction(id, noteData));
    }
    dispatchSelectedClientNote({
      type: CLIENT_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [selectedClientNote, toggleModifyNotes]);

  const onCloseNotePopup = useCallback(() => {
    dispatchSelectedClientNote({
      type: CLIENT_NOTE_REDUCER_ACTIONS.RESET_STATE,
    });
    toggleModifyNotes();
  }, [toggleModifyNotes, dispatchSelectedClientNote]);

  const addToCRMButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => onCloseNotePopup() },
      {
        title: `${selectedClientNote.type === 'EDIT' ? 'Edit' : 'Add'} `,
        buttonType: 'primary',
        onClick: addOrUpdateNote,
      },
    ],
    [onCloseNotePopup, addOrUpdateNote]
  );

  const pageActionClick = useCallback(
    newPage => {
      getClientNotesList({ page: newPage, limit });
    },
    [limit, getClientNotesList]
  );

  const toggleConfirmationModal = useCallback(
    value => setShowConfirmModal(value !== undefined ? value : e => !e),
    [setShowConfirmModal]
  );
  const checkIfEnterKeyPressed = e => {
    const searchKeyword = searchInputRef.current.value;
    if (e.target.value.trim().toString().length === 1) {
      getClientNotesList();
    } else if (e.key === 'Enter') {
      if (searchKeyword.trim().toString().length !== 0) {
        getClientNotesList({ search: searchKeyword.trim().toString() });
      } else {
        getClientNotesList();
        errorNotification('Please enter any value than press enter');
      }
    }
  };

  const onSelectUserRecordActionClick = useCallback(
    async (type, noteId, noteData) => {
      if (type === TABLE_ROW_ACTIONS.EDIT_ROW) {
        const { description, isPublic } = noteData;
        const data = {
          noteId,
          description,
          isPublic: isPublic === 'Yes',
          type: NOTE_ACTIONS.EDIT,
        };
        dispatchSelectedClientNote({
          type: CLIENT_NOTE_REDUCER_ACTIONS.UPDATE_DATA,
          data,
        });
        toggleModifyNotes();
      } else if (type === TABLE_ROW_ACTIONS.DELETE_ROW) {
        setDeleteId(noteId);
        toggleConfirmationModal();
      }
    },
    [toggleModifyNotes]
  );

  const callBack = () => {
    setDeleteId(null);
    toggleConfirmationModal();
    getClientNotesList();
  };

  const deleteNoteButtons = useMemo(
    () => [
      { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal() },
      {
        title: 'Delete',
        buttonType: 'danger',
        onClick: () => {
          try {
            dispatch(deleteClientNoteAction(deleteId, () => callBack()));
          } catch (e) {
            /**/
          }
        },
      },
    ],
    [toggleConfirmationModal, getClientNotesList, deleteId]
  );

  const onChangeSelectedNoteInput = useCallback(e => {
    dispatchSelectedClientNote({
      type: CLIENT_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.value,
    });
  }, []);

  const onChangeSelectedNoteSwitch = useCallback(e => {
    dispatchSelectedClientNote({
      type: CLIENT_NOTE_REDUCER_ACTIONS.UPDATE_SINGLE_DATA,
      name: e.target.name,
      value: e.target.checked,
    });
  }, []);

  useEffect(() => {
    getClientNotesList();
  }, []);

  return (
    <>
      {modifyNoteModal && (
        <Modal
          header={`${selectedClientNote.type === 'EDIT' ? 'Edit Note' : 'Add Note'} `}
          className="add-to-crm-modal"
          buttons={addToCRMButtons}
          hideModal={toggleModifyNotes}
        >
          <div className="add-notes-popup-container">
            <span>Description</span>
            <Input
              prefixClass="font-placeholder"
              placeholder="Note description"
              name="description"
              type="text"
              value={selectedClientNote.description}
              onChange={onChangeSelectedNoteInput}
            />
            <span>Private/Public</span>
            <Switch
              id="selected-note"
              name="isPublic"
              checked={selectedClientNote.isPublic}
              onChange={onChangeSelectedNoteSwitch}
            />
          </div>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal header="Delete Note" buttons={deleteNoteButtons} hideModal={toggleConfirmationModal}>
          <span className="confirmation-message">Are you sure you want to delete this note?</span>
        </Modal>
      )}
      <div className="tab-content-header-row">
        <div className="tab-content-header">Notes</div>
        <div className="buttons-row">
          <BigInput
            ref={searchInputRef}
            type="text"
            className="search"
            borderClass="tab-search"
            prefix="search"
            prefixClass="font-placeholder"
            placeholder="Search here"
            onKeyUp={checkIfEnterKeyPressed}
          />
          <Button buttonType="success" title="Add" onClick={toggleModifyNotes} />
        </div>
      </div>
      {docs ? (
        <>
          <div className="tab-table-container">
            <Table
              align="left"
              valign="center"
              data={docs}
              tableClass="white-header-table"
              headers={headers}
              recordActionClick={onSelectUserRecordActionClick}
              refreshData={getClientNotesList}
              haveActions
            />
          </div>
          <Pagination
            className="common-list-pagination"
            total={total}
            pages={pages}
            page={page}
            limit={limit}
            pageActionClick={pageActionClick}
            onSelectLimit={onSelectLimit}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ClientNotesTab;
