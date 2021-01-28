/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (saga.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import { put, takeLatest, call, select } from 'redux-saga/effects';
import apiConfig, { url } from './../../apiConfig';
import {
  onLoadingUserFarmsStart,
  onLoadingUserFarmsFail,
  getUserFarmsSuccess,
  acceptInvitationSuccess,
} from '../userFarmSlice';
import { createAction } from '@reduxjs/toolkit';
import { loginSelector, loginSuccess } from '../userFarmSlice';
import { getHeader } from '../saga';
import history from '../../history';
import { startInvitationFlowOnChooseFarmScreen } from './chooseFarmFlowSlice';

const axios = require('axios');

const patchUserFarmStatusWithIdTokenUrl = (farm_id) =>
  `${url}/user_farm/accept_invitation/farm/${farm_id}`;

export const getUserFarms = createAction('getUserFarmsSaga');
export function* getUserFarmsSaga() {
  const { userFarmUrl } = apiConfig;
  try {
    const { user_id } = yield select(loginSelector);
    const header = getHeader(user_id);
    yield put(onLoadingUserFarmsStart());
    const result = yield call(axios.get, userFarmUrl + '/user/' + user_id, header);
    yield put(getUserFarmsSuccess(result.data));
  } catch (error) {
    yield put(onLoadingUserFarmsFail(error));
    console.log('failed to fetch task types from database');
  }
}
export const patchUserFarmStatusWithIDToken = createAction('patchUserFarmStatusWithIDTokenSaga');

export function* patchUserFarmStatusWithIDTokenSaga({ payload: userFarm }) {
  try {
    const { farm_id, user_id } = userFarm;
    const header = getHeader(user_id, farm_id);
    const result = yield call(axios.patch, patchUserFarmStatusWithIdTokenUrl(farm_id), {}, header);
    const { user: resUserFarm } = result.data;
    yield put(acceptInvitationSuccess(resUserFarm));
    yield put(startInvitationFlowOnChooseFarmScreen(resUserFarm.farm_id));
    history.push('/consent');
  } catch (e) {
    console.log(e);
  }
}

export default function* chooseFarmSaga() {
  yield takeLatest(getUserFarms.type, getUserFarmsSaga);
  yield takeLatest(patchUserFarmStatusWithIDToken.type, patchUserFarmStatusWithIDTokenSaga);
}
