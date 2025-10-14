import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';

import DownModal from './DownModal';
import {Header, HeaderCloseIcon, HeaderButton, HeaderTitle} from '../headers';
import colors from '../../config/colors';
import Icon from '../Icon';

export default function ChoosePrivacyDrawer({
  options,
  isVisible,
  setIsVisible,
  title,
  setPrivacy,
}) {
  const [value, setValue] = React.useState('first');

  const handleCancel = () => {
    setIsVisible(!isVisible);
  };

  const handleAddGroup = () => {
    setIsVisible(!isVisible);
  };

  return (
    <DownModal isVisible={isVisible} setIsVisible={setIsVisible}>
      <Header
        left={
          <HeaderCloseIcon
            onPress={handleCancel}
            backgroundColor={colors.white}
          />
        }
        middle={<HeaderTitle>Group Privacy</HeaderTitle>}
        backgroundColor={colors.white}
        right={
          <HeaderButton onPress={handleAddGroup} title="Done" isActive={true} />
        }
      />

      <RadioButton.Group
        onValueChange={newValue => {
          setValue(newValue);
          setPrivacy(newValue);
        }}
        value={value}>
        <View style={styles.radioGroupWrapper}>
          <View style={styles.radioButtonItemWrapper}>
            <Icon
              name="globe"
              type="Entypo"
              backgroundSizeRatio={1}
              size={20}
            />
            <RadioButton.Item
              value={false}
              label="Public"
              color={colors.iondigoDye}
              style={styles.radioButtonItem}
              labelStyle={styles.RadioLabelStyle}
            />
            <Text style={styles.radioButtonDescription}>
              Anyone on or off Shareup
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.radioButtonItemWrapper}>
            <Icon
              name="user-alt"
              type="FontAwesome5"
              backgroundSizeRatio={1}
              size={20}
            />
            <RadioButton.Item
              value={true}
              label="Private"
              color={colors.iondigoDye}
              style={styles.radioButtonItem}
              labelStyle={styles.RadioLabelStyle}
            />
            <Text style={styles.radioButtonDescription}>
              Only members can see who's in the group
            </Text>
          </View>
        </View>
      </RadioButton.Group>
    </DownModal>
  );
}

const styles = StyleSheet.create({
  radioGroupWrapper: {
    paddingBottom: 20,
  },
  radioButtonItem: {
    flexDirection: 'row',
    height: 70,
  },
  RadioLabelStyle: {
    width: '90%',
  },
  radioButtonText: {
    width: '90%',
  },
  radioButtonItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  radioButtonDescription: {
    position: 'absolute',
    top: '65%',
    left: '10%',
    color: colors.mediumGray,
  },
  separator: {
    height: 2,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.lighterGray,
    marginVertical: 10,
  },
});
