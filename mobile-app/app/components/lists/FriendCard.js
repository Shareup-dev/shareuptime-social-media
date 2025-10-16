import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';

import colors from '../../config/colors';
import Tab from '../buttons/Tab';
import Icon from '../Icon';
import defaultStyles from '../../config/GlobalStyles';
import BetterImage from '../betterImage/BetterImage';

export default function FriendCard({
  title,
  tabTitle = 'Send Request',
  titleStyle,
  subTitle,
  image,
  user,
  fontColor,
  color,
  onPress,
  style,
  secondBtnAction,
  secondBtnTitle,
  displayLeft = false,
  secondBtn = false,
  showCloseButton = true,
  fullWidth,
  onPressProfile,
}) {
  const { width } = Dimensions.get('window');
  return (
    <View style={[styles.listItem]}>
      <TouchableOpacity
        onPress={onPressProfile}
        style={{ flexDirection: 'row', alignItems: 'center', minWidth: width / 3 }}
      >
        <>
          {image && <BetterImage style={styles.image} source={{ uri: image }} />}
          <View style={styles.detailsContainer}>
            <View>
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
                    <Icon name="close" type="AntDesign" backgroundSizeRatio={0.5} size={30} />
                  )}
                </View>
              )}
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                defaultStyles.fontWeightMedium,
                titleStyle,
                { marginLeft: 10, marginVertical: 10 },
              ]}
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
        </>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 17,
    marginBottom: 13,
    marginHorizontal: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.84,

    elevation: 3,
  },
  detailsContainer: { marginLeft: 5, flex: 1 },
  image: { height: 50, width: 50, borderRadius: 35 },
  title: defaultStyles.listItemTitle,
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
