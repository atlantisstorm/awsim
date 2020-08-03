import React, { useContext } from 'react';
import { launchRemoteSession } from '../utils';
import { Context } from "../store/context";
import { MODAL_SHOW_INSTANCE } from '../store/types';

const InstancesBodyTr = ({ instance, sortField }) => {
  const { state, dispatch } = useContext(Context);
  const { fields, selectedInstance } = state;

  const onClickShowInstanceDetails = (event) => {
    event.preventDefault;

    const payload = {
      pageX: event.nativeEvent.pageX || 0,
      pageY: event.nativeEvent.pageY || 0,
      instanceId: event.target.parentNode.getAttribute("data-instance-id") || ''
    };
    dispatch({ type: MODAL_SHOW_INSTANCE, payload});
  }

  const onClickIpAddress = (event) => {
    event.stopPropagation();
    const data_ip_address = event.target.getAttribute("data-ip-address");
    const data_target_platform = event.target.getAttribute("data-target-platform");

    launchRemoteSession(data_ip_address, data_target_platform);
  }

  return (
    <tr data-testid="show-instance-details"
      data-instance-id={instance.InstanceId}
      className={selectedInstance === instance.InstanceId ? 'clicked' : '' }
      onClick={onClickShowInstanceDetails}
      >
      {fields.map((fieldName, index) => {
        let extra_class = [];
        if (fieldName === sortField) {
            extra_class.push("sorted");
        }

        let extra_attribs = {};
        if (fieldName === "PublicIpAddress" || fieldName === "PrivateIpAddress") {
            extra_class.push("launch-ssh");
            extra_class.push("js-launch-ssh");
            extra_attribs = { 
              title: "Launch remote connection",
              "data-ip-address": instance[fieldName], 
              "data-target-platform": instance.Platform,
              onClick: onClickIpAddress
            };
        }

        return (
          <td key={index} className={extra_class.join(' ')} {...extra_attribs}>{instance[fieldName]}</td>
        )
      })}
    </tr>
  )
}

export default InstancesBodyTr;