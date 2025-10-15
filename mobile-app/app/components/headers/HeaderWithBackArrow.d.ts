import * as React from 'react';
import { TextStyle, StyleProp, ReactNode } from 'react-native';

export interface HeaderWithBackArrowProps {
	onBackButton?: () => void;
	title?: string;
	component?: ReactNode;
	leftComponent?: ReactNode;
	rightComponent?: ReactNode;
	titleStyle?: StyleProp<TextStyle>;
}

export default function HeaderWithBackArrow(
	props: HeaderWithBackArrowProps
): React.JSX.Element;
