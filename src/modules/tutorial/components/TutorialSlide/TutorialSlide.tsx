import React from 'react';
import { View, Text, Image, type TextStyle } from 'react-native';
import { styles } from '../../styles/TutorialSlide/styles';
import { TYPOGRAPHY } from '../../../../constants/typography';
import type { TutorialScreen, TextPart } from '../../datas/tutorialData';
import Button from '../../../../components/button/Button';

interface TutorialSlideProps {
    item: TutorialScreen;
    onNext: () => void;
}

function TutorialSlide({ item, onNext }: TutorialSlideProps) {
    const renderTextParts = (parts: TextPart[], baseStyle: TextStyle) => {
        const getTextStyle = (highlight: boolean) => {
            if (item.id === 1) {
                return highlight
                    ? [styles.highlight, TYPOGRAPHY.TITLE, styles.leftAlign]
                    : [TYPOGRAPHY.HEADLINE_1, styles.leftAlign];
            }
            if (item.id === 6) {
                return highlight
                    ? [
                          styles.highlight,
                          TYPOGRAPHY.HEADLINE_2,
                          styles.leftAlign,
                      ]
                    : [TYPOGRAPHY.HEADLINE_2, styles.leftAlign];
            }
            return highlight
                ? [styles.highlight, TYPOGRAPHY.HEADLINE_2, styles.leftAlign]
                : [TYPOGRAPHY.HEADLINE_3, styles.leftAlign];
        };

        return (
            <Text style={baseStyle}>
                {parts.map((part, index) => (
                    <Text key={index} style={getTextStyle(part.highlight)}>
                        {part.text}
                    </Text>
                ))}
            </Text>
        );
    };

    const getImageStyle = () => {
        if (item.id === 1) return styles.logoImage;
        if (item.id === 6) return styles.lastImage;
        return styles.image;
    };

    if (item.id === 1) {
        // 1번 화면: 이미지 | (텍스트+버튼)
        return (
            <View style={styles.slide}>
                {item.image && (
                    <Image
                        source={item.image}
                        style={getImageStyle()}
                        resizeMode="contain"
                    />
                )}
                <View style={styles.firstScreenTextWrapper}>
                    <View style={styles.firstScreenInnerTextContainer}>
                        {renderTextParts(item.titleParts, styles.title)}
                        {item.subtitleParts &&
                            renderTextParts(
                                item.subtitleParts,
                                styles.subtitle,
                            )}
                        {item.descriptionParts &&
                            renderTextParts(
                                item.descriptionParts,
                                styles.description,
                            )}
                    </View>
                    <Button
                        title={item.buttonText}
                        onPress={onNext}
                        style={styles.button}
                    />
                </View>
            </View>
        );
    }

    if (item.id === 6) {
        // 6번 화면: 이미지 | (텍스트+버튼)
        return (
            <View style={styles.slide}>
                {item.image && (
                    <Image
                        source={item.image}
                        style={getImageStyle()}
                        resizeMode="contain"
                    />
                )}
                <View style={styles.firstScreenTextWrapper}>
                    <View style={styles.firstScreenInnerTextContainer}>
                        {renderTextParts(item.titleParts, styles.title)}
                        {item.subtitleParts &&
                            renderTextParts(
                                item.subtitleParts,
                                styles.subtitle,
                            )}
                        {item.descriptionParts &&
                            renderTextParts(
                                item.descriptionParts,
                                styles.description,
                            )}
                    </View>
                    <Button
                        title={item.buttonText}
                        onPress={onNext}
                        style={styles.button}
                    />
                </View>
            </View>
        );
    }

    // 2~5번 화면: (이미지+텍스트) | 버튼
    return (
        <View style={styles.slide}>
            <View style={styles.imageTextWrapper}>
                {item.image && (
                    <Image
                        source={item.image}
                        style={getImageStyle()}
                        resizeMode="contain"
                    />
                )}
                <View style={styles.textOnly}>
                    {renderTextParts(item.titleParts, styles.title)}
                    {item.subtitleParts &&
                        renderTextParts(item.subtitleParts, styles.subtitle)}
                    {item.descriptionParts &&
                        renderTextParts(
                            item.descriptionParts,
                            styles.description,
                        )}
                </View>
            </View>
            <Button
                title={item.buttonText}
                onPress={onNext}
                style={styles.buttonWithMargin}
            />
        </View>
    );
}

export default TutorialSlide;
