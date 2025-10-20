import React from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { styles } from '../../styles/ChallengeCard';
import Icon from '../../../../components/icon/Icon';
import { ChallengeProps } from '../../types/ChallengeProps';

type ChallengeCardProps = ChallengeProps & {
    isOpen: boolean;
    onToggle: () => void;
    description?: string;
};

function ChallengeCard({
    title,
    coin,
    progress,
    currentValue,
    targetValue,
    sideBarColor,
    isOpen,
    onToggle,
    description,
}: ChallengeCardProps) {
    const progressValue = parseFloat(progress.replace('%', ''));

    const handleToggle = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle();
    };

    return (
        <TouchableOpacity activeOpacity={0.5} onPress={handleToggle}>
            <View style={styles.challengeContainer}>
                <View
                    style={[styles.sideBar, { backgroundColor: sideBarColor }]}
                />

                <View style={styles.content}>
                    <View style={styles.challengeWrapper}>
                        <View style={styles.challengeTitleWrapper}>
                            <Icon name="target" width={24} height={24} />
                            <Text style={styles.challengeTitle}>{title}</Text>
                        </View>
                        <View style={styles.challengeCoinWrapper}>
                            <Text style={styles.challengeCoinText}>{coin}</Text>
                            <Icon name="coin" width={24} height={24} />
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarWrapper}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progressValue}%` as any },
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.challengeProgressWrapper}>
                            <Text style={styles.challengeProgressText}>
                                {currentValue}회
                            </Text>
                            <Text style={[styles.challengeProgressText, { color: '#999' }]}>
                                / {targetValue}회
                            </Text>
                        </View>
                    </View>

                    {isOpen && (
                        <Text style={styles.detailText}>{description}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default ChallengeCard;
