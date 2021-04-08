import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiConfig from '../../../../apiConfig';
import { loginSelector } from '../../../userFarmSlice';
import { axios, getHeader } from '../../../saga';
import { createAction } from '@reduxjs/toolkit';
import {
  editNaturalAreaSuccess,
  getLocationObjectFromNaturalArea,
  postNaturalAreaSuccess,
} from '../../../naturalAreaSlice';
import { canShowSuccessHeader, setSuccessMessage } from '../../../mapSlice';
import i18n from '../../../../locales/i18n';
import history from '../../../../history';
import { resetAndLockFormData } from '../../../hooks/useHookFormPersist/hookFormPersistSlice';

export const postNaturalAreaLocation = createAction(`postNaturalAreaLocationSaga`);

export function* postNaturalAreaLocationSaga({ payload: data }) {
  const formData = data.formData;
  const { locationURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  formData.farm_id = farm_id;
  const header = getHeader(user_id, farm_id);
  const locationObject = getLocationObjectFromNaturalArea(formData);

  try {
    const result = yield call(
      axios.post,
      `${locationURL}/${locationObject.figure.type}`,
      locationObject,
      header,
    );
    yield put(postNaturalAreaSuccess(result.data));
    yield put(resetAndLockFormData());
    yield put(
      setSuccessMessage([i18n.t('FARM_MAP.MAP_FILTER.NA'), i18n.t('message:MAP.SUCCESS_POST')]),
    );
    yield put(canShowSuccessHeader(true));
    history.push({ pathname: '/map' });
  } catch (e) {
    history.push({
      path: history.location.pathname,
      state: {
        error: `${i18n.t('message:MAP.FAIL_POST')} ${i18n
          .t('FARM_MAP.MAP_FILTER.NA')
          .toLowerCase()}`,
      },
    });
    console.log(e);
  }
}

export const editNaturalAreaLocation = createAction(`editNaturalAreaLocationSaga`);

export function* editNaturalAreaLocationSaga({ payload: data }) {
  const { formData, location_id } = data;
  const { locationURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  formData.farm_id = farm_id;
  const header = getHeader(user_id, farm_id);
  const locationObject = getLocationObjectFromNaturalArea({ ...formData, location_id });

  try {
    const result = yield call(
      axios.put,
      `${locationURL}/${locationObject.figure.type}/${location_id}`,
      locationObject,
      header,
    );
    yield put(editNaturalAreaSuccess(result.data));
    yield put(resetAndLockFormData());
    yield put(
      setSuccessMessage([i18n.t('FARM_MAP.MAP_FILTER.NA'), i18n.t('message:MAP.SUCCESS_PATCH')]),
    );
    yield put(canShowSuccessHeader(true));
    history.push({ pathname: '/map' });
  } catch (e) {
    history.push({
      path: history.location.pathname,
      state: {
        error: `${i18n.t('message:MAP.FAIL_PATCH')} ${i18n
          .t('FARM_MAP.MAP_FILTER.NA')
          .toLowerCase()}`,
      },
    });
    console.log(e);
  }
}

export default function* naturalAreaLocationSaga() {
  yield takeLatest(postNaturalAreaLocation.type, postNaturalAreaLocationSaga);
  yield takeLatest(editNaturalAreaLocation.type, editNaturalAreaLocationSaga);
}
