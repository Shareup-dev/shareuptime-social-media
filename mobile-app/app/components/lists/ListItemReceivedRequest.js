import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from 'react-native';

import colors from '../../config/colors';
import Tab from '../buttons/Tab';
import Icon from '../Icon';
import defaultStyles from '../../config/GlobalStyles';

export default function ListItemReceivedRequest({
  email,
  title,
  tabTitle = 'Send Request',
  titleStyle,
  subTitle,
  image,
  user,
  fontColor,
  color,
  IconComponent,
  onPress,
  onPressProfile,
  style,
  secondBtnAction,
  secondBtnTitle,
  displayLeft = false,
  secondBtn = false,
  showCloseButton = true,
  fullWidth,
  handleClose,
  displayFirstButton = true,
  isBottomSheet = false,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.listItem, style]}>
        {IconComponent}
        {image && <Image style={styles.image} source={{ uri: image }} />}
        <View style={styles.detailsContainer}>
          {displayLeft && (
            <View style={styles.leftContainer}>
              <Tab
                title={tabTitle}
                titleStyle={styles.buttonTitle}
                style={[styles.tab, { width: fullWidth ? 200 : 100 }]}
                height={30}
                user={user}
                color={color}
                fontColor={fontColor}
                onPress={onPress}
              />
              {secondBtn && (
                <Tab
                  title={secondBtnTitle}
                  titleStyle={styles.buttonTitle}
                  style={[styles.tab, { width: fullWidth ? 200 : 100 }]}
                  // fullWidth={false}
                  height={30}
                  user={user}
                  onPress={secondBtnAction}
                  color={colors.iondigoDye}
                  fontColor={colors.white}
                />
              )}
              {!secondBtn && showCloseButton && (
                <TouchableOpacity onPress={handleClose}>
                  <Icon name="close" type="AntDesign" backgroundSizeRatio={0.5} size={30} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text
            numberOfLines={1}
            style={[styles.title, defaultStyles.fontWeightMedium, titleStyle]}
          >
            {title}
          </Text>
          {subTitle && (
            <Text
              numberOfLines={2}
              style={[defaultStyles.listItemSubTitle, defaultStyles.fontWeightMedium]}
            >
              {subTitle}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 10,
  },
  detailsContainer: { marginLeft: 5, flex: 1 },
  image: { height: 70, width: 70, borderRadius: 35 },
  title: {
    fontSize: 15,
    marginBottom: 3,
    color: colors.dark,
    textTransform: 'capitalize',
    marginLeft: 10,
    marginTop: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    borderRadius: 7,
    paddingHorizontal: 5,
    marginRight: 6,
  },
  buttonTitle: {
    fontSize: 11,
  },
});
