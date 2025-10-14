import React, {useState} from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';

import Modal from 'react-native-modal';

import {Header, HeaderButton, HeaderTitle} from './headers';
import colors from '../config/colors';

export default function MultiImagePicker({isVisible, setIsVisible}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(null);

  const imagesCallback = callback => {
    callback.then(photos => photos).catch(e => console.error(e));
  };

  const updateHandler = (count, onSubmit) => {
    // this.props.navigation.setParams({
    //   headerTitle: "{{count}} selected",
    //   headerRight: onSubmit,
    // });
  };

  const renderSelectedComponent = number => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
  const noCameraPermissionComponent = (
    <Text style={styles.emptyStay}>No access to camera</Text>
  );
  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      style={styles.modal}>
      <View style={styles.container}>
        <Header
          left={<HeaderButton title="Cancel" isActive={true} />}
          middle={<HeaderTitle>Photos</HeaderTitle>}
          right={<HeaderButton title="Done" isActive={true} />}
          headerContainerStyle={styles.header}
        />
        {/* <ImageBrowser
          max={4}
          onChange={updateHandler}
          callback={imagesCallback}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
          noCameraPermissionComponent={noCameraPermissionComponent}
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
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});
