import React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import Input from '../Form/Input';
import { Underlined } from '../Typography';
import { useTranslation } from 'react-i18next';
import PureCropTile from '../CropTile';
import { useSelector } from 'react-redux';

export default function PureCropList({
  onFilterChange,
  onAddCrop,
  activeCrops,
  pastCrops,
  plannedCrops,
  ...props
}) {
  const isSearchable = true;
  const { t } = useTranslation();
  // const { idk } = useSelector();
  return (
    <div className={styles.container} {...props}>
      {isSearchable && (
        <Input
          style={{ marginBottom: '24px' }}
          placeholder={t('LOCATION_CROPS.INPUT_PLACEHOLDER')}
          isSearchBar={true}
          onChange={onFilterChange}
        />
      )}
      <div
        style={{
          marginBottom: '20px',
          width: 'fit-content',
          fontSize: '16px',
          color: 'var(--iconActive)',
          lineHeight: '16px',
          cursor: 'pointer',
        }}
        onClick={onAddCrop}
      >
        + <Underlined>{t('LOCATION_CROPS.ADD_NEW')}</Underlined>
      </div>
      {activeCrops.length &&
        <>
        <div className={styles.labelContainer}>
          <div className={styles.label}>{t('LOCATION_CROPS.ACTIVE_CROPS')}</div>
          <div className={styles.cropCount} style={{backgroundColor: '#037A0F'}}>{activeCrops.length}</div>
          <div className={styles.labelDivider} />
        </div>
        <div className={styles.tileContainer}>
          {activeCrops.map((fc) => <PureCropTile fieldCrop={fc} status={'Active'}/>)}
        </div>
        </>
      }
      {plannedCrops.length &&
        <>
        <div className={styles.labelContainer}>
          <div className={styles.label}>{t('LOCATION_CROPS.ACTIVE_CROPS')}</div>
          <div className={styles.cropCount} style={{backgroundColor: '#7E4C0E'}}>{plannedCrops.length}</div>
          <div className={styles.labelDivider} />
        </div>
        <div className={styles.tileContainer}>
          {plannedCrops.map((fc) => <PureCropTile fieldCrop={fc} status={'Planned'}/>)}
        </div>
        </>
      }
      {pastCrops.length &&
        <>
        <div className={styles.labelContainer}>
          <div className={styles.label}>{t('LOCATION_CROPS.ACTIVE_CROPS')}</div>
          <div className={styles.cropCount} style={{backgroundColor: '#085D50'}}>{pastCrops.length}</div>
          <div className={styles.labelDivider} />
        </div>
        <div className={styles.tileContainer}>
          {pastCrops.map((fc) => <PureCropTile fieldCrop={fc} status={'Past'}/>)}
        </div>
        </>
      }
    </div>
  );
}
