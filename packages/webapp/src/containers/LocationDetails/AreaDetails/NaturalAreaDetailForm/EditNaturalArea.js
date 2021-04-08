import React, { useEffect } from 'react';
import PureNaturalArea from '../../../../components/LocationDetailLayout/AreaDetails/NaturalArea';
import { editNaturalAreaLocation } from './saga';
import { useDispatch, useSelector } from 'react-redux';
import { measurementSelector } from '../../../userFarmSlice';
import useHookFormPersist from '../../../hooks/useHookFormPersist';
import { naturalAreaSelector } from '../../../naturalAreaSlice';
import {
  hookFormPersistSelector,
  setAreaDetailFormData,
} from '../../../hooks/useHookFormPersist/hookFormPersistSlice';
import { getFormData } from '../../utils';

function EditNaturalAreaDetailForm({ history, match }) {
  const dispatch = useDispatch();
  const system = useSelector(measurementSelector);
  const submitForm = (data) => {
    dispatch(editNaturalAreaLocation({ ...data, ...match.params }));
  };
  const naturalArea = useSelector(naturalAreaSelector(match.params.location_id));
  const formData = useSelector(hookFormPersistSelector);
  useEffect(() => {
    !formData.name && dispatch(setAreaDetailFormData(getFormData(naturalArea)));
  }, []);

  return (
    <PureNaturalArea
      history={history}
      match={match}
      submitForm={submitForm}
      system={system}
      useHookFormPersist={useHookFormPersist}
      isEditLocationPage
    />
  );
}

export default EditNaturalAreaDetailForm;
