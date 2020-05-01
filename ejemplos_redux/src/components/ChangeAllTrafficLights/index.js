import React from 'react';
import { connect } from 'react-redux';

import './styles.css';
import * as actions from '../../actions/trafficLights';
import * as myActions from '../../actions/petOwners';
import { v4 } from 'uuid';


const ChangeAllTrafficLights = ({ onClick }) => (
  <button className='change-all-traffic-lights' onClick={onClick}>
    {'*'}
  </button>
);


export default connect(
  state=>{
    console.log(state)
  },
  dispatch => ({
    onClick() {
      dispatch(actions.changeAllTrafficLights());
      dispatch(myActions.startFetchingPetOwners());
      dispatch(myActions.startRemovingPetOwner(5));
      dispatch(myActions.startAddingPetOwner(v4(),'me'));
    },
  })
)(ChangeAllTrafficLights);
