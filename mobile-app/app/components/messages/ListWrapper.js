import React from 'react';
import { ActivityIndicator } from 'react-native';
import colors from '../../config/colors';

export default function ListWrapper({ loading, children }) {
  return (
    <>{loading ? <ActivityIndicator size="large" color={colors.iondigoDye} /> : <>{children}</>}</>
  );
}
