import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Accordion from '../../../common/Accordion/Accordion';
import {
  getApplicationDetailById,
  getApplicationModuleList,
  getApplicationNotesList,
  getApplicationTaskList,
  getViewApplicationDocumentTypeList,
  resetApplicationDetail,
} from '../redux/ApplicationAction';
import TableApiService from '../../../common/Table/TableApiService';
import Drawer from '../../../common/Drawer/Drawer';
import ApplicationReportAccordion from './component/ApplicationReportAccordion';
import ApplicationTaskAccordion from './component/ApplicationTaskAccordion';
import ApplicationNotesAccordion from './component/ApplicationNotesAccordion';
import ApplicationAlertsAccordion from './component/ApplicationAlertsAccordion';
import ApplicationDocumentsAccordion from './component/ApplicationDocumentsAccordion';
import ApplicationLogsAccordion from './component/ApplicationLogsAccordion';
import { errorNotification } from '../../../common/Toast';
import Loader from '../../../common/Loader/Loader';

export const DRAWER_ACTIONS = {
  SHOW_DRAWER: 'SHOW_DRAWER',
  HIDE_DRAWER: 'HIDE_DRAWER',
};

const drawerInitialState = {
  visible: false,
  data: [],
};

const drawerReducer = (state, action) => {
  switch (action.type) {
    case DRAWER_ACTIONS.SHOW_DRAWER:
      return {
        visible: true,
        data: action.data,
      };
    case DRAWER_ACTIONS.HIDE_DRAWER:
      return { ...drawerInitialState };

    default:
      return state;
  }
};

const ViewApplication = () => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const viewApplicationData = useSelector(({ application }) => application?.viewApplication ?? {});
  const { applicationDetail, isLoading } = useMemo(
    () => viewApplicationData,
    [viewApplicationData]
  );
  const {
    tradingName,
    entityType,
    entityName,
    abn,
    debtorId,
    clientId,
    creditLimit,
    outstandingAmount,
    ordersOnHand,
    applicationId,
    status,
  } = useMemo(() => applicationDetail ?? {}, [applicationDetail]);

  useEffect(() => {
    dispatch(getApplicationDetailById(id));
    dispatch(getApplicationNotesList(id));
    dispatch(getApplicationModuleList(id));
    dispatch(getApplicationTaskList(id));
    dispatch(getViewApplicationDocumentTypeList());
    return () => dispatch(resetApplicationDetail());
  }, [id]);

  const [drawerState, dispatchDrawerState] = useReducer(drawerReducer, drawerInitialState);
  const handleDrawerState = useCallback(async (idDrawer, headers) => {
    try {
      const response = await TableApiService.tableActions({
        url: headers[0].request.url,
        method: headers[0].request.method,
        id: idDrawer,
      });

      dispatchDrawerState({
        type: DRAWER_ACTIONS.SHOW_DRAWER,
        data: response.data.data,
      });
    } catch (e) {
      errorNotification('Something went wrong.');
    }
  }, []);
  const closeDrawer = useCallback(() => {
    dispatchDrawerState({
      type: DRAWER_ACTIONS.HIDE_DRAWER,
    });
  }, []);

  const backToApplicationList = () => {
    history.replace('/applications');
  };
  const applicationDetails = useMemo(
    () => [
      {
        title: 'Application ID',
        value: applicationId,
        name: '_id',
        type: 'text',
      },
      {
        title: 'Credit Limit Amount',
        value: creditLimit,
        name: 'creditLimit',
        type: 'text',
      },
      {
        title: 'Outstanding Amount',
        value: outstandingAmount,
        name: 'outstandingAmount',
        type: 'text',
      },
      {
        title: 'Order on Hand',
        value: ordersOnHand,
        name: 'ordersOnHand',
        type: 'text',
      },
      {
        title: 'Client Name',
        value: clientId?.[0],
        name: 'clientId',
        type: 'link',
      },
      {
        title: 'Debtor Name',
        value: debtorId?.[0],
        name: 'debtorId',
        type: 'link',
      },
      {
        title: 'ABN',
        value: abn,
        name: 'abn',
        type: 'text',
      },
      {
        title: 'Entity Name',
        value: entityName,
        name: 'entityName',
        type: 'text',
      },
      {
        title: 'Entity Type',
        value: entityType,
        name: 'entityType',
        type: 'text',
      },
      {
        title: 'Trading Name',
        value: tradingName,
        name: 'tradingName',
        type: 'text',
      },
    ],
    [tradingName, entityType, entityName, abn, debtorId, clientId, creditLimit, applicationId]
  );
  const blockers = applicationDetails?.blockers;

  return (
    <>
      {!isLoading ? (
        <>
          <div className="breadcrumb mt-10">
            <span onClick={backToApplicationList}>Application List</span>
            <span className="material-icons-round">navigate_next</span>
            <span>View Application</span>
          </div>
          <TableLinkDrawer drawerState={drawerState} closeDrawer={closeDrawer} />
          <div className="view-application-container">
            <div className="view-application-details-left">
              <div className="common-white-container">
                <div className="">Status</div>
                {status?.label === 'Approved' || status?.label === 'Declined' ? (
                  <>
                    {['APPROVED'].includes(status?.value) && (
                      <div className="application-status approved-application-status">
                        {status?.label}
                      </div>
                    )}
                    {['DECLINED'].includes(status?.value) && (
                      <div className="application-status declined-application-status">
                        {status?.label}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="view-application-status">{status?.label ?? '-'}</div>
                )}
                <div className="application-details-grid">
                  {applicationDetails?.map(detail => (
                    <div>
                      <div className="font-field mb-5">{detail?.title}</div>
                      {detail?.type === 'text' && (
                        <div className="detail">{detail.value || '-'}</div>
                      )}
                      {detail?.type === 'link' && (
                        <div
                          style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          className="detail"
                          onClick={() => {
                            handleDrawerState(
                              detail?.value?._id,
                              applicationDetail?.headers?.filter(
                                header => header?.name === detail?.name
                              )
                            );
                          }}
                        >
                          {detail?.value?.value || '-'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {blockers && (
                  <>
                    <div className="blockers-title">Blockers</div>

                    {blockers.map(blocker => (
                      <div className="guideline" key={Math.random()}>
                        {blocker?.value}
                      </div>
                    ))}
                  </>
                )}
                <div className="current-business-address-title">Current Business Address</div>
                <div className="current-business-address">
                  <div className="font-field mr-15">Address</div>
                  <div className="font-primary">{applicationDetail?.address || '-'}</div>
                </div>
                <div className="view-application-question">
                  Any extended payment terms outside your policy standard terms?
                </div>
                <div className="view-application-answer">
                  {applicationDetail?.isExtendedPaymentTerms
                    ? applicationDetail?.extendedPaymentTermsDetails
                    : ' No'}
                </div>
                <div className="view-application-question">
                  Any overdue amounts passed your maximum extension period / Credit period?
                </div>
                <div className="view-application-answer">
                  {applicationDetail?.isPassedOverdueAmount
                    ? applicationDetail?.passedOverdueDetails
                    : ' No'}
                </div>
              </div>
            </div>
            <div className="view-application-details-right">
              <div className="common-white-container">
                <Accordion className="view-application-accordion">
                  <ApplicationReportAccordion index={0} />
                  <ApplicationTaskAccordion applicationId={id} index={1} />
                  <ApplicationNotesAccordion applicationId={id} index={2} />
                  <ApplicationAlertsAccordion index={3} />
                  <ApplicationDocumentsAccordion applicationId={id} index={4} />
                  <ApplicationLogsAccordion index={5} />
                </Accordion>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ViewApplication;

function TableLinkDrawer(props) {
  const { drawerState, closeDrawer } = props;
  const checkValue = row => {
    switch (row.type) {
      case 'dollar':
        return row.value ? `$ ${row.value}` : '-';
      case 'percent':
        return row.value ? `${row.value} %` : '-';
      case 'date':
        return row.value ? moment(row.value).format('DD-MMM-YYYY') : '-';
      default:
        return row.value || '-';
    }
  };

  return (
    <Drawer header="Contact Details" drawerState={drawerState.visible} closeDrawer={closeDrawer}>
      <div className="contacts-grid">
        {drawerState?.data?.map(row => (
          <>
            <div className="title" key={Math.random()}>
              {row.label}
            </div>
            <div>{checkValue(row)}</div>
          </>
        ))}
      </div>
    </Drawer>
  );
}

TableLinkDrawer.propTypes = {
  drawerState: PropTypes.shape({
    visible: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
  }).isRequired,
  closeDrawer: PropTypes.func.isRequired,
};

TableLinkDrawer.defaultProps = {};
