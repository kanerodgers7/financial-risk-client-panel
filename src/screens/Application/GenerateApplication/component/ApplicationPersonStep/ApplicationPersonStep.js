import React, { useCallback, useEffect, useMemo } from 'react';
import './ApplicationPersonStep.scss';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '../../../../../common/Accordion/Accordion';
import PersonIndividualDetail from './personIndividualDetail/PersonIndividualDetail';
import { addPersonDetail } from '../../../redux/ApplicationAction';

const ApplicationPersonStep = () => {
  const personState = useSelector(({ application }) => application?.editApplication?.partners ?? []);
  const entityType = useSelector(
          ({ application }) => application?.editApplication?.company?.entityType ?? []
  );

  const entityTypeFromCompany = entityType?.[0]?.value;
  const dispatch = useDispatch();

  useEffect(() => {
    if (personState?.length < 1 && entityTypeFromCompany === 'SOLE_TRADER') {
      dispatch(addPersonDetail('individual'));
    } else if (entityTypeFromCompany === 'PARTNERSHIP' && personState?.length <= 1) {
      dispatch(addPersonDetail('individual'));
    } else if (personState?.length < 1) {
      dispatch(addPersonDetail('individual'));
    }
  }, []);

  const hasRadio = useMemo(() => ['PARTNERSHIP', 'TRUST'].includes(entityTypeFromCompany), [
    entityTypeFromCompany,
  ]);

  const getAccordionAccordingEntityType = useCallback(
          (person, index) => {
            let itemHeader = 'Director Details';
            switch (entityTypeFromCompany) {
              case 'PARTNERSHIP':
                itemHeader = 'Partner Details';
                break;
              case 'SOLE_TRADER':
                itemHeader = 'Sole Trader Details';
                break;
              case 'TRUST':
                itemHeader = 'Trustee Details';
                break;
              case 'BUSINESS':
                itemHeader = 'Proprietor Details';
                break;
              default:
                break;
            }
            return (
                    <PersonIndividualDetail
                            itemHeader={itemHeader}
                            hasRadio={hasRadio}
                            index={index}
                            entityTypeFromCompany={entityTypeFromCompany}
                    />
            );
          },
          [hasRadio]
  );

  return (
          <>
            <Accordion>
              {personState && personState ? personState?.map(getAccordionAccordingEntityType) : ''}
            </Accordion>
          </>
  );
};

export default ApplicationPersonStep;
