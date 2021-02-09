import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../components/PageTitle';
import { actions, Form } from 'react-redux-form';
import moment from 'moment';
import styles from '../HarvestUseType/styles.module.scss';
import mainStyles from '../styles.module.scss'
import { getUnit, convertToMetric } from '../../../util';
import Unit from '../../../components/Inputs/Unit';
import { withTranslation } from 'react-i18next';
import { getFieldCrops } from '../../saga';
import {
  formDataSelector,
  selectedUseTypeSelector,
  formValueSelector,
  harvestAllocationSelector,
} from '../selectors';
import { toastr } from 'react-redux-toastr';
import { addLog, editLog } from '../Utility/actions';
import { userFarmSelector } from '../../userFarmSlice';
import { saveHarvestAllocationWip, setSelectedUseTypes } from '../actions';

class HarvestAllocation extends Component {
  constructor(props) {
    super(props);
    const { farm, dispatch } = this.props;
    this.props.dispatch(actions.reset('logReducer.forms.harvestAllocation'));

    this.state = {
      date: moment(),
      quantity_unit: getUnit(farm, 'kg', 'lb'),
    };
    this.setDate = this.setDate.bind(this);
    dispatch(getFieldCrops());
  }

  setDate(date) {
    this.setState({
      date: date,
    });
  }

  handleSubmit(val) {
    this.props.useType.map((obj) => {
      if (obj.harvest_use_type_name in val) {
        obj.quantity = val[obj.harvest_use_type_name];
      }
    });
    let sum = Object.keys(val).reduce((sum, key) => sum + Number(val[key]), 0);

    if (
      sum >= Number(this.props.formData.quantity_kg) - 0.01 &&
      sum < Number(this.props.formData.quantity_kg) + 0.01
    ) {
      if (!!this.props.formValue?.activity_id) {
        this.props.dispatch(editLog(this.props.formValue));
      } else {
        this.props.useType.forEach((element) => {
          element.quantity = convertToMetric(element.quantity, this.state.quantity_unit, 'kg');
        });
        this.props.dispatch(addLog(this.props.formValue));
      }
    } else {
      toastr.error('Total does not equal the amount to allocate');
    }
  }

  handleChange(event) {
    this.props.dispatch(saveHarvestAllocationWip(event.harvestAllocation));
  }

  render() {
    return (
      <div className="page-container">
          <PageTitle
            backUrl="/harvest_use_type"
            title={this.props.t('LOG_HARVEST.HARVEST_ALLOCATION_TITLE')}
          />
        <h4>{this.props.t('LOG_HARVEST.HARVEST_ALLOCATION_SUBTITLE')}</h4>
        <p>{this.props.t('LOG_HARVEST.HARVEST_ALLOCATION_SUBTITLE_TWO')}</p>
        <div style={{ color: '#085D50', fontWeight: 'bold' }}>
          <p>{this.props.formData.quantity_kg + this.state.quantity_unit}</p>
        </div>

        <Form
          className={mainStyles.formContainer}
          model="logReducer.forms"
          onSubmit={(val) => this.handleSubmit(val.harvestAllocation)}
          onChange={this.handleChange.bind(this)}
        >
          {this.props.useType.map((type, index) => {
            const typeName = this.props.t(`harvest_uses:${type.harvest_use_type_translation_key}`);
            let model = '.harvestAllocation.' + type.harvest_use_type_name;
            return (
              <div
                style={
                  index === this.props.useType.length - 1
                    ? { marginBottom: '100px', paddingTop: '20px' }
                    : { paddingTop: '20px' }
                }
              >
                <Unit
                  model={model}
                  title={typeName}
                  type={this.state.quantity_unit}
                  validate
                  isHarvestAllocation={true}
                  defaultValue={type.quantity !== 0 ? type.quantity : null}
                />
              </div>
            );
          })}

          <div className={styles.bottomContainer}>
            <div
              className={styles.backButton}
              onClick={() => {
                this.props.history.push('/harvest_use_type');
              }}
            >
              {this.props.t('common:BACK')}
            </div>
            <button className="btn btn-primary-round" disabled={this.state.disabled}>
              {this.props.t('common:FINISH')}
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    farm: userFarmSelector(state),
    formData: formDataSelector(state),
    useType: selectedUseTypeSelector(state),
    formValue: formValueSelector(state),
    harvestAllocation: harvestAllocationSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HarvestAllocation));
