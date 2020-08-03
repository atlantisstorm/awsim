import React from 'react';

const ModalDetailsRow = props => {
  const { title, data } = props;

  return (
    <tr><td className="title">{title}</td><td className="data">{data}</td></tr>
  )
}

export default ModalDetailsRow;