import React, { ReactNode } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TYPOGRAPHY } from "../../constants/typography";
import { TEXT_COLORS, FORM_COLORS } from "../../constants/colors";
import { scale } from "../../utils/scalers";
import Icon from "../icon/Icon";

type HeaderNavProps = {
    title: string;
    variant?: 'default' | 'withIcon';
    centerIcon?: ReactNode;
    rightComponent?: ReactNode;
    onBackPress?: () => void;
};

function HeaderNav({
    title,
    variant = 'default',
    centerIcon,
    rightComponent,
    onBackPress
}: HeaderNavProps) {
    const navigation = useNavigation();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    if (variant === 'withIcon') {
        return (
            <View style={styles.container}>
                <Icon name="left" color={TEXT_COLORS.CAPTION_1} onPress={handleBackPress} />
                <View style={styles.centerContent}>
                    {centerIcon}
                    <Text style={[TYPOGRAPHY.SUBTITLE, styles.text]}>{title}</Text>
                </View>
                {rightComponent || <View style={styles.spacer} />}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Icon name="left" color={TEXT_COLORS.CAPTION_1} onPress={handleBackPress} />
            <Text style={[TYPOGRAPHY.SUBTITLE, styles.text]}>{title}</Text>
            {rightComponent || <View style={styles.spacer} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "auto",
        marginRight: "auto",
        width: scale(343),
        padding: scale(0),
        justifyContent: "space-between",
        alignItems: "center"
    },
    centerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8),
        paddingVertical: scale(4),
        paddingHorizontal: scale(16),
        borderRadius: scale(16),
        backgroundColor: FORM_COLORS.BACKGROUND_3,
    },
    text: {
        textAlign: "center",
        color: TEXT_COLORS.CAPTION_1
    },
    spacer: {
        width: scale(20),
        height: scale(20),
        flexShrink: 0,
    }
});

export default HeaderNav;
