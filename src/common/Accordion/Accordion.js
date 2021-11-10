import React from 'react';
import PropTypes from 'prop-types';

export const AccordionContext = React.createContext();

const Accordion = props => {
  const { children, className } = props;
  const [openIndex, setOpenIndex] = React.useState(-1);
  const accordion = `accordion-container ${className}`;

  return (
    <div className={accordion}>
      <AccordionContext.Provider
        value={{
          openIndex,
          setOpenIndex,
        }}
      >
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

Accordion.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};

Accordion.defaultProps = {
  className: '',
  children: null,
};

export default Accordion;
