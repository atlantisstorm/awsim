import React from 'react';

const ModalDetailsHeader = props => {
  const { title } = props;

  return (
    <tr><td colSpan="2" className="header">{ title }</td></tr>
  )
}

export default ModalDetailsHeader;