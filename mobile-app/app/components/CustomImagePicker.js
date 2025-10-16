import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

import Modal from 'react-native-modal';
import { Ionicons, Feather } from 'react-native-vector-icons';

import { Header, HeaderButton, HeaderTitle } from './headers';
import colors from '../config/colors';

export default function CustomImagePicker({ onCancel }) {
  return (
    <Modal isVisible={true} style={styles.modal}>
      <View style={styles.container}>
        <Header
          left={<HeaderButton title="Cancel" isActive={true} onPress={onCancel} />}
          middle={<HeaderTitle>Photos</HeaderTitle>}
          right={<HeaderButton title="Done" isActive={true} />}
          headerContainerStyle={styles.header}
        />
        {/* <AssetsSelector
          Settings={{
            assetsType: ['photo', 'unknown'],
            maxSelection: 4,
            minSelection: 1,
            initialLoad: 50,
            portraitCols: 3,
            landscapeCols: 4,
            getImageMetaData: false,
          }}
          Styles={{
            bgColor: colors.white,
            widgetWidth: 90,
            margin: 2,
            spinnerColor: colors.iondigoDye,
            videoIcon: {
              Component: Ionicons,
              iconName: 'ios-videocam',
              color: colors.iondigoDye,
              size: 20,
            },
            selectedIcon: {
              Component: Feather,
              iconName: 'check-circle',
              color: colors.white,
              bg: colors.whiteWithOpacity,
              size: 26,
            },
          }}
          Errors={{
            errorTextColor: colors.red,
            errorMessages: 'Error',
          }}
        /> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 0,
    margin: 0,
    height: '100%',
    paddingTop: Constants.platform.ios ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
});
