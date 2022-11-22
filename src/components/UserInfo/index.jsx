import React from 'react';
import styles from './UserInfo.module.scss';

import { mainUrl } from '../../mainUrl'

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      {console.log('avatarUrl', avatarUrl.indexOf(0, 3))}
      <img className={styles.avatar} src={avatarUrl.charAt() === 'h' ? avatarUrl : mainUrl + avatarUrl} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
