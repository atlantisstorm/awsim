import React, { useContext } from 'react';
import ModalDetailsHeader from './modal-details-header';
import ModalDetailsRow from './modal-details-row';
import { compare } from '../utils';
import { Context } from "../store/context";
import { MODAL_SET_DISPLAY } from '../store/types';

const ModalShowInstanceDetails = () => {
  const { state, dispatch } = useContext(Context);
  const settings = state.modalSettings;
  const instanceData = settings.instance;
  const iamInstanceProfile = instanceData.IamInstanceProfile || { "Id": "Not defined", "Arn": "Not defined"};

  const onClickCloseModal = () => {
    dispatch({ type: MODAL_SET_DISPLAY, payload: { display: false } });
  }

  // Specific fields we want to display - general.
  const generalFieldNames = [
    "Architecture",
    "Hypervisor",
    "Name",
    "PrivateDnsName",
    "PublicDnsName",
    "RootDeviceType",
    "RootDeviceName",
    "VirtualizationType"
  ];

  // Specific fields we want to display - tags.
  const tags = instanceData.Tags;

  // Specific fields we want to display - IAM instance profile.
  const iamFieldNames = [
    "Id",
    "Arn"
  ];

  return (
    <div data-testid="modal-close" className='context-menu' style={{top :settings.pageY + 'px', left: settings.pageX + 'px'}} onClick={onClickCloseModal}>
      <div id="instance-tags">
        <table><tbody>
          <ModalDetailsHeader title={'General'}/>
          { generalFieldNames.map((fieldName, index) => (
            <ModalDetailsRow key={index} title={fieldName} data={instanceData[fieldName]} />
          ))}

          <ModalDetailsHeader title={'Tags'}/>
          { tags.sort(compare("Key", "asc")).map((tag, index) => (
            <ModalDetailsRow key={index} title={tag.Key} data={tag.Value} />
          ))}

          <ModalDetailsHeader title={'Iam Instance Profile'}/>
          { iamFieldNames.map((fieldName, index) => (
            <ModalDetailsRow key={index} title={fieldName} data={iamInstanceProfile[fieldName]} />
          ))}
        </tbody></table>
      </div>
    </div>
  )
}

export default ModalShowInstanceDetails;