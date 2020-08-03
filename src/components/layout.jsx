import React, { useRef, useContext, useEffect } from 'react';
import config from '../data/config.json';
import InstancesTable from './instances-table';
import Loading from "./Loading";
import Filter from './filter';
import ModalShowInstanceDetails from './modal-show-instance-details';
import { Context } from "../store/context";
import { 
  FETCH_DATA,
  FILTER_INSTANCES,
  REFRESH_DATA
} from '../store/types';

const Layout = () => {
  const { state, dispatch } = useContext(Context);
  const { filtersOrdered, instances, loading, modalSettings, aws } = state;
  const filtersRef = useRef(null);

  const onClickRefresh = (event) => {
    event.preventDefault;
    dispatch({ type: REFRESH_DATA });
  };

  useEffect(() => {
    const region = filtersRef.current.querySelector("#Regions").value;
    dispatch({
      type: FETCH_DATA,
      payload: {
        region,
        accessKeyId: aws.accessKeyId,
        secretAccessKey: aws.secretAccessKey
      } 
    });
  }, [loading]);

  useEffect(() => {
    dispatch({ type: FILTER_INSTANCES });
  }, [instances]);

  return (
    <div className="main-wrapper">
        { loading ?
          <Loading />
          :
          <div id="loaded">
            <div id="instances" data-testid="instances" aria-placeholder="Your instances will be here in a instant!:p">
              <InstancesTable />
            </div>
          </div>
        }
        <div id="actions">
          <div id="filters" ref={filtersRef}>
            { filtersOrdered.map((filter, index) => (
                <Filter key={index} filter={filter} instances={instances} />
              ))
            }
          </div>
          <div id="refresh-container">
            <button id="btnRefreshInstances" title="Refresh then apply selected filters" data-testid="refresh-button" onClick={onClickRefresh}>Refresh Instances</button>
          </div>
          <div className="clear"></div>
        </div>
        { modalSettings.display &&
          <ModalShowInstanceDetails />
        }
    </div>
  )
}

export default Layout;