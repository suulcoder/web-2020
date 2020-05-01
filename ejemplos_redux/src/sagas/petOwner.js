import {
    call,
    takeEvery,
    put,
    select,
  } from 'redux-saga/effects';
  
import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';
import { v4 } from 'uuid';

const API_BASE_URL = 'http://localhost:8000/api/v1/owner/';
  
function* fetchOwners(action) {
    try {
        const response = yield call(
            fetch,
            `${API_BASE_URL}`,
                {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            const data = yield response.json();
            let entities = {}
            let order = []
            data.forEach(element => {
                const id = v4()
                entities = {...entities,[id]: element,}
                order = [...order,id]
            });
            yield put(actions.completeFetchingPetOwners(entities,order));
        } else {
            const { detail } = yield response.json();
            yield put(actions.failFetchingPetOwners(detail));
        }
    } catch (error) {
        yield put(actions.failFetchingPetOwners('Falló en la conexión'));
    }
}

export function* watchFetchOwners() {
    yield takeEvery(
        types.PET_OWNERS_FETCH_STARTED,
        fetchOwners,
    );
}

function* removeOwners(action) {
    const { id } = action.payload
    try {
        const isAuth = yield select(selectors.isAuthenticated);
        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}${id}/delete/`,
                    {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                yield put(actions.completeRemovingPetOwner());
            } else {
                const { detail } = yield response.json();
                yield put(actions.failRemovingPetOwner(id,detail));
            }
        }
        else{
            yield put(actions.failRemovingPetOwner(id,'NOT AUTHENTICATED'));
        }
    } catch (error) {
        console.log(error)
        yield put(actions.failRemovingPetOwner('Falló en la conexión'));
    }
}

export function* watchRemoveOwners() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removeOwners,
    );
}

function* addOwners(action) {
    try {
        const { oldId, petOwner } = action.payload
        const isAuth = yield select(selectors.isAuthenticated);
        if (isAuth) {
        
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}`,
                    {
                    method: 'POST',
                    body: JSON.stringify({name: petOwner}),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                const { id, name } = yield response.json();
                yield put(actions.completeAddingPetOwner(oldId,{id,name}));
            } else {
                const { detail } = yield response.json();
                yield put(actions.failAddingPetOwner(oldId,detail));
            }
        }
        else{
            yield put(actions.failAddingPetOwner(oldId,'NOT AUTHENTICATED'));
        }
    } catch (error) {
        console.log(error)
        yield put(actions.failAddingPetOwner('Falló en la conexión'));
    }
}

export function* watchAddOwners() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addOwners,
    );
}