/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import Button from '../../../common/Button/Button';
import Input from '../../../common/Input/Input';
import Checkbox from '../../../common/Checkbox/Checkbox';
import {
  addNewUser,
  changeUserData,
  changeUserManageAccess,
  deleteUserDetails,
  getAllClientList,
  getAllOrganisationModulesList,
  getSelectedUserData,
  resendVerificationMail,
  setNewUserInitialStates,
  updateUserDetails,
} from '../redux/UserManagementAction';
import { USER_MODULE_ACCESS, USER_ROLES } from '../../../constants/UserlistConstants';
import { errorNotification } from '../../../common/Toast';
import { EMAIL_ADDRESS_REGEX, MOBILE_NUMBER_REGEX } from '../../../constants/RegexConstants';
import { USER_MANAGEMENT_CRUD_REDUX_CONSTANTS } from '../redux/UserManagementReduxConstants';
import Modal from '../../../common/Modal/Modal';
import UserPrivilegeWrapper from '../../../common/UserPrivilegeWrapper/UserPrivilegeWrapper';
import { SIDEBAR_NAMES } from '../../../constants/SidebarConstants';
import Loader from '../../../common/Loader/Loader';
import { NumberCommaSeparator } from '../../../helpers/NumberCommaSeparator';
import Select from '../../../common/Select/Select';

const AddUser = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const allOrganisationList = useSelector(({ organizationModulesList }) => organizationModulesList);
  const allClientList = useSelector(({ userManagementClientList }) => userManagementClientList);

  const selectedUser = useSelector(({ selectedUserData }) => selectedUserData);

  const { action, id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const prevUserRoleData = useRef(null);

  const {
    viewUserUpdateUserButtonLoaderAction,
    viewUserAddNewUserButtonLoaderAction,
    viewUserDeleteUserButtonLoaderAction,
    viewUserPageLoaderAction,
    viewUserResendMailButtonLoaderAction,
  } = useSelector(({ generalLoaderReducer }) => generalLoaderReducer ?? false);

  const filteredOrganisationList = useMemo(
    () => selectedUser?.moduleAccess?.filter(e => !e.isDefault) ?? [],
    [selectedUser]
  );

  const { name, role, email, contactNumber, maxCreditLimit, clientIds } = useMemo(() => {
    if (selectedUser) {
      // eslint-disable-next-line no-shadow
      const { name, role, email, contactNumber, maxCreditLimit, clientIds } = selectedUser;

      return {
        name: name || '',
        role: role || '',
        email: email || '',
        clientIds: clientIds || [],
        contactNumber: contactNumber || '',
        maxCreditLimit: maxCreditLimit || '',
      };
    }
    return { name: '', role: '', email: '', contactNumber: '', maxCreditLimit: '', clientIds: [] };
  }, [selectedUser]);
  const userRoleSelectedValue = useMemo(() => {
    const foundValue = USER_ROLES.find(e => {
      return e.value === role;
    });
    return foundValue ? [foundValue] : [];
  }, [role]);

  useEffect(() => {
    dispatch(getAllOrganisationModulesList());
    dispatch(getAllClientList());
    if (action !== 'add' && id) {
      dispatch(getSelectedUserData(id));
    }
    return () => {
      dispatch({
        type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_GET_USER_ACTION,
        data: null,
      });
    };
  }, [id]);

  useEffect(() => {
    if (action === 'add' && allOrganisationList && allOrganisationList.length !== 0) {
      dispatch(setNewUserInitialStates(allOrganisationList));
    }
  }, [allOrganisationList]);

  const backToUser = useCallback(() => {
    history.replace('/users');
  }, [history]);

  // const [storeSelectedClient, setStoreSelectedClient] = useState([]);
  const onChangeUserData = useCallback(e => {
    const { name, value } = e.target;

    dispatch(changeUserData({ name, value }));
  }, []);

  const onChangeMaxLimit = useCallback(e => {
    const { name, value } = e.target;
    const updatedVal = value?.toString()?.replaceAll(',', '');
    dispatch(changeUserData({ name, value: parseInt(updatedVal, 10) }));
  }, []);

  const clientSelected = useCallback(value => {
    //   setStoreSelectedClient([value]);
    dispatch(changeUserData({ name: 'clientIds', value }));
  }, []);

  const onChangeUserRole = useCallback(
    e => {
      const value = e?.value ?? '';
      if (prevUserRoleData?.current === null) {
        prevUserRoleData.current = {
          role: userRoleSelectedValue,
          clientIds,
        };
      }

      if (value === prevUserRoleData?.current?.role?.[0]?.value) {
        clientSelected(prevUserRoleData.current.clientIds);
      } else {
        clientSelected([]);
      }

      const data = {
        target: {
          name: 'role',
          value,
        },
      };

      onChangeUserData(data);
    },
    [onChangeUserData, clientSelected, prevUserRoleData?.current, clientIds, userRoleSelectedValue]
  );

  const onChangeUserAccess = useCallback((module, access) => {
    const { name } = module;
    const { value } = access;
    
    const hasFullAccess = module.accessTypes.includes('full-access');
    const hasReadAccess = module.accessTypes.includes('read');
    const hasWriteAccess = module.accessTypes.includes('write');

    switch (value) {
      case 'full-access':
        if (hasFullAccess) {
          if (!hasReadAccess) {
            dispatch(changeUserManageAccess({ name, value: 'read' }));
          }
          if (!hasWriteAccess) {
            dispatch(changeUserManageAccess({ name, value: 'write' }));
          }
        } else {
          if (hasReadAccess) {
            dispatch(changeUserManageAccess({ name, value: 'read' }));
          }
          if (hasWriteAccess) {
            dispatch(changeUserManageAccess({ name, value: 'write' }));
          }
        }
        dispatch(changeUserManageAccess({ name, value: 'read' }));
        dispatch(changeUserManageAccess({ name, value: 'write' }));
        dispatch(changeUserManageAccess({ name, value }));
        break;
      case 'write':
        if (hasWriteAccess) {
          if (!hasReadAccess) {
            dispatch(changeUserManageAccess({ name, value: 'read' }));
          }
        } else if (hasReadAccess) {
          dispatch(changeUserManageAccess({ name, value: 'read' }));
        }
        dispatch(changeUserManageAccess({ name, value: 'read' }));
        dispatch(changeUserManageAccess({ name, value }));
        break;
      default:
        dispatch(changeUserManageAccess({ name, value }));
    }
  }, []);

  const onClickAddUser = useCallback(async () => {
    if (!selectedUser) {
      return;
    }
    if (!name || name.trim().length === 0) {
      errorNotification('Please enter name');
    } else if (!email || email.trim().length === 0) {
      errorNotification('Please enter email');
    } else if (!email.match(EMAIL_ADDRESS_REGEX)) {
      errorNotification('Please enter a valid email');
    } else if (!role || role.trim().length === 0) {
      errorNotification('Please select role');
    } else if (contactNumber && !contactNumber.match(MOBILE_NUMBER_REGEX)) {
      errorNotification('Please enter valid contact number');
      // eslint-disable-next-line no-restricted-globals
    } else if (maxCreditLimit && isNaN(maxCreditLimit)) {
      errorNotification('Please enter number for maximum credit limit');
    } else {
      try {
        if (action === 'add') {
          const response = await dispatch(addNewUser({...selectedUser, duplicateUserDetails: undefined}));
          if (response) {
            history.replace(`/users/user/view/${response}`);
          }
        } else if (action === 'edit') {
          await dispatch(updateUserDetails(id, {...selectedUser, duplicateUserDetails: undefined}));
          history.replace(`/users/user/view/${id}`);
        }
      } catch (e) {
        /**/
      }
    }
  }, [selectedUser, name, email, role, contactNumber, maxCreditLimit, action, id, backToUser]);

  const editUserClick = useCallback(() => {
    history.replace(`/users/user/edit/${id}`);
  }, [history, id]);

  const toggleConfirmationModal = useCallback(
    value => setShowModal(value !== undefined ? value : e => !e),
    [setShowModal]
  );

  const deleteUserClick = useCallback(async () => {
    try {
      toggleConfirmationModal(false);
      await dispatch(deleteUserDetails(id));
      backToUser();
    } catch (e) {
      /**/
    }
  }, [id, backToUser]);

  const deleteModalButtonClick = useCallback(() => {
    setModalData({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user?',
      buttons: [
        { title: 'Close', buttonType: 'primary-1', onClick: () => toggleConfirmationModal(false) },
        {
          title: 'Delete',
          buttonType: 'danger',
          onClick: deleteUserClick,
          isLoading: viewUserDeleteUserButtonLoaderAction,
        },
      ],
    });
    toggleConfirmationModal(true);
  }, [deleteUserClick, toggleConfirmationModal, viewUserDeleteUserButtonLoaderAction]);

  const clients = useMemo(() => {
    let finalData = [];

    if (allClientList && role !== '') {
      if (role === 'riskAnalyst') {
        finalData = allClientList.riskAnalystList;
      }
      if (role === 'serviceManager') {
        finalData = allClientList.serviceManagerList;
      }
    }

    return finalData.map(e => ({
      label: e.name,
      value: e._id,
    }));
  }, [role, allClientList]);

  const getBreadcrumbTitle = useMemo(() => {
    switch (action) {
      case 'edit':
        return 'Edit';
      case 'add':
        return 'Add';
      default:
        return 'View';
    }
  }, [action]);

  const onResendEmailButtonClick = useCallback(() => {
    dispatch(resendVerificationMail(selectedUser?._id));
  }, [selectedUser]);

  const onClickCloseButton = useCallback(() => {
    if (id === 'new') {
      history.replace('/users');
    } else {
      history.replace(`/users/user/view/${id}`);
      dispatch({type: USER_MANAGEMENT_CRUD_REDUX_CONSTANTS.USER_MANAGEMENT_UNDO_SELECTED_USER_DATA_ON_CLOSE})
    }
  }, [history, id]);

  return (
    <>
      {!viewUserPageLoaderAction ? [(
          !_.isEmpty(selectedUser) ? (
            <>
              {showModal && (
                <Modal
                  header={modalData.title}
                  buttons={modalData.buttons}
                  hideModal={toggleConfirmationModal}
                >
                  <span className="confirmation-message">{modalData.description}</span>
                </Modal>
              )}
              <div className="breadcrumb-button-row">
                <div className="breadcrumb">
                  <span onClick={backToUser}>User List</span>
                  <span className="material-icons-round">navigate_next</span>
                  <span>{getBreadcrumbTitle} User</span>
                </div>
                <div className="buttons-row">
                  {action === 'view' ? (
                    <>
                      {selectedUser?.status !== 'Active' && (
                        <Button
                          buttonType="secondary"
                          title="Resend Email"
                          onClick={onResendEmailButtonClick}
                          isLoading={viewUserResendMailButtonLoaderAction}
                        />
                      )}
                      <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.USER}>
                        <Button buttonType="primary" title="Edit" onClick={editUserClick} />
                        <Button
                          buttonType="danger"
                          title="Delete"
                          onClick={deleteModalButtonClick}
                        />
                      </UserPrivilegeWrapper>
                    </>
                  ) : (
                    <>
                      <Button buttonType="primary-1" title="Close" onClick={onClickCloseButton} />
                      <UserPrivilegeWrapper moduleName={SIDEBAR_NAMES.USER}>
                        <Button
                          buttonType="primary"
                          title="Save"
                          onClick={onClickAddUser}
                          isLoading={
                            action === 'add'
                              ? viewUserAddNewUserButtonLoaderAction
                              : viewUserUpdateUserButtonLoaderAction
                          }
                        />
                      </UserPrivilegeWrapper>
                    </>
                  )}
                </div>
              </div>
              <div className="common-detail-container add-user-detail-container">
                <div className="common-detail-grid">
                  <div className="common-detail-field">
                    <div className="common-detail-title">Name</div>
                    {action === 'view' ? (
                      <span>{name}</span>
                    ) : (
                      <Input
                        type="text"
                        placeholder="Jason Gatt"
                        name="name"
                        value={name}
                        onChange={onChangeUserData}
                      />
                    )}
                  </div>
                  <div className="common-detail-field">
                    <div className="common-detail-title">Email</div>
                    {action === 'view' || action === 'edit' ? (
                      <span className="mail-id-value">{email}</span>
                    ) : (
                      <Input
                        type="email"
                        placeholder="jason@trad.au"
                        name="email"
                        value={email}
                        onChange={onChangeUserData}
                      />
                    )}
                  </div>
                  <div className="common-detail-field">
                    <div className="common-detail-title">Role</div>
                    {action === 'view' ? (
                      <span>{userRoleSelectedValue?.[0]?.label}</span>
                    ) : (
                      <Select
                        className={action === 'view' && 'disabled-control'}
                        placeholder="Select"
                        name="role"
                        options={USER_ROLES}
                        menuIsOpen
                        value={userRoleSelectedValue}
                        onChange={onChangeUserRole}
                        searchable={false}
                      />
                    )}
                  </div>
                  <div className="common-detail-field">
                    <div className="common-detail-title">Phone Number</div>
                    {action === 'view' ? (
                      <span>{contactNumber ?? '-'}</span>
                    ) : (
                      <Input
                        name="contactNumber"
                        value={contactNumber}
                        type="text"
                        placeholder="1234567890"
                        onChange={onChangeUserData}
                      />
                    )}
                  </div>
                  <div className="common-detail-field">
                    <div className="common-detail-title">Max credit limit approval</div>
                    {action === 'view' ? (
                      <span>{maxCreditLimit ? NumberCommaSeparator(maxCreditLimit) : '-'}</span>
                    ) : (
                      <Input
                        name="maxCreditLimit"
                        value={NumberCommaSeparator(maxCreditLimit)}
                        type="text"
                        placeholder="Enter credit limit"
                        onChange={onChangeMaxLimit}
                      />
                    )}
                  </div>
                  {role !== 'superAdmin' && (
                    <div className="common-detail-field user-select-client">
                      <div className="common-detail-title">{action === 'view' ? 'Selected Clients' : 'Select Client'}</div>
                      <Select
                        isMulti
                        value={clientIds}
                        onChange={clientSelected}
                        options={clients}
                        isDisabled={action === 'view' || role === 'superAdmin'}
                        className="isMulti-react-select"
                        color="#003A78"
                        placeholder={action === 'view' ? 'No client selected' : 'Select Client'}
                        dropdownHandle={false}
                        keepSelectedInList={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="module-container">
                {filteredOrganisationList.map(module => (
                  <div key={module.label} className="module">
                    <div className="module-title">{module.label}</div>
                    {USER_MODULE_ACCESS.map(access =>
                      module.label === 'Insurer' && access.value === 'full-access' ? (
                        <div />
                      ) : (
                        <Checkbox
                          key={access.label}
                          disabled={
                            action === 'view' ||
                            (module?.accessTypes?.includes('full-access') &&
                              (access.value === 'read' || access.value === 'write')) ||
                            (module?.accessTypes?.includes('write') && access.value === 'read')
                          }
                          title={access.label}
                          name={access.value}
                          className={`${
                            (action === 'view' ||
                              (module?.accessTypes?.includes('full-access') &&
                                (access.value === 'read' || access.value === 'write')) ||
                              (module?.accessTypes?.includes('write') &&
                                access.value === 'read')) &&
                            'checkbox-disabled'
                          }`}
                          checked={module.accessTypes.includes(access.value)}
                          onChange={() => onChangeUserAccess(module, access)}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            id !== 'new' && <div className="no-record-found">No record found</div>
          )
      )] : (
        <Loader />
      )}
    </>
  );
};

export default AddUser;
