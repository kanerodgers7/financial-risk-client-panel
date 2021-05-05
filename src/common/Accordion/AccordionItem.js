import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './Accordion.scss';

const AccordionItem = props => {
  const {
    className,
    headerClass,
    prefix,
    prefixClass,
    suffix,
    suffixClass,
    header,
    count,
    accordionBodyClass,
    children,
  } = props;
  const accordionClass = `accordion-item ${className}`;
  const headerClassName = `accordion-item-header-container ${headerClass}`;
  const prefixClassName = `material-icons-round ${prefixClass}`;
  const suffixClassName = `material-icons-round ${suffixClass}`;
  const accordionBodyClassName = `accordion-body-container ${accordionBodyClass}`;
  const [activeAccordion, setActiveAccordion] = useState(false);

  const content = useRef(null);

  const onClickAccordionItem = () => {
    setActiveAccordion(e => !e);
  };
  return (
    <div className={accordionClass}>
      <div className={headerClassName} onClick={onClickAccordionItem}>
        <div className="d-flex align-center">
          {prefix && (
            <span
              className={`${prefixClassName} ${
                activeAccordion && prefix === 'expand_more' && 'rotate-icon'
              }`}
            >
              {prefix}
            </span>
          )}
          <label>{header}</label>
          {count && <span className="accordion-item-count">{count}</span>}
        </div>
        {suffix && (
          <span
            className={`${suffixClassName} ${
              activeAccordion && suffix === 'expand_more' && 'rotate-icon'
            }`}
          >
            {suffix}
          </span>
        )}
      </div>
      <div
        ref={content}
        className={`${accordionBodyClassName} ${activeAccordion && 'active-accordion'}`}
      >
        {children !== null ? children : <div className="no-record-found">No record found</div>}
      </div>
    </div>
  );
};

AccordionItem.propTypes = {
  className: PropTypes.string,
  headerClass: PropTypes.string,
  header: PropTypes.array.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  count: PropTypes.number,
  prefixClass: PropTypes.string,
  suffixClass: PropTypes.string,
  accordionBodyClass: PropTypes.string,
  children: PropTypes.element,
};

AccordionItem.defaultProps = {
  className: '',
  headerClass: '',
  prefix: '',
  suffix: '',
  count: '',
  prefixClass: '',
  suffixClass: '',
  accordionBodyClass: '',
  children: null,
};

export default AccordionItem;
