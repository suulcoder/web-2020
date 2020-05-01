import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import { watchAddOwners, watchRemoveOwners, watchFetchOwners} from './petOwner';

function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchAddOwners),
    fork(watchFetchOwners),
    fork(watchRemoveOwners)
  ]);
}


export default mainSaga;
