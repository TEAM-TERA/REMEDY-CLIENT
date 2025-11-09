export interface TextPart {
  text: string;
  highlight: boolean;
}

export interface TutorialScreen {
  id: number;
  titleParts: TextPart[];
  subtitleParts?: TextPart[];
  descriptionParts?: TextPart[];
  image: any; // require() type
  buttonText: string;
}

export const tutorialScreens: TutorialScreen[] = [
  {
    id: 1,
    titleParts: [
      { text: '내 주변에\n', highlight: false },
      { text: '함께하는 음악', highlight: false },
    ],
    subtitleParts: [
      { text: 'RE : MEDY', highlight: true },
    ],
    image: require('../../../assets/images/tutorial/logo.png'),
    buttonText: '다음으로',
  },
  {
    id: 2,
    titleParts: [
      { text: '근처에 ', highlight: false },
      { text: '떨어진 음악', highlight: true },
      { text: '을 확인하고\n', highlight: false },
      { text: '클릭', highlight: true },
      { text: '하여 들을 수 있어요.', highlight: false },
    ],
    image: require('../../../assets/images/tutorial/map.png'),
    buttonText: '다음으로',
  },
  {
    id: 3,
    titleParts: [
      { text: '드랍 버튼', highlight: true },
      { text: '을 클릭하여 현재 위치에\n내가 ', highlight: false },
      { text: '원하는 음악', highlight: true },
      { text: '을 남길 수 있어요.', highlight: false },
    ],
    image: require('../../../assets/images/tutorial/drop.png'),
    buttonText: '다음으로',
  },
  {
    id: 4,
    titleParts: [
      { text: '또한 ', highlight: false },
      { text: '다이얼', highlight: true },
      { text: '을 돌려\n', highlight: false },
      { text: '원하는 음악', highlight: true },
      { text: '을 들을 수 있어요.', highlight: false },
    ],
    image: require('../../../assets/images/tutorial/wheel.png'),
    buttonText: '다음으로',
  },
  {
    id: 5,
    titleParts: [
      { text: '러닝 토글', highlight: true },
      { text: '을 활성화하면\n', highlight: false },
      { text: '달린 거리와 시간', highlight: true },
      { text: '이 표시됩니다.', highlight: false },
    ],
    image: require('../../../assets/images/tutorial/lunning.png'),
    buttonText: '다음으로',
  },
  {
    id: 6,
    titleParts: [
      { text: '이제 ', highlight: false },
      { text: 'RE:MEDY', highlight: true },
      { text: '에 가입하고\n', highlight: false },
      { text: '음악의 거리를 거닐어 보세요!', highlight: false },
    ],
    image: require('../../../assets/images/tutorial/last.png'),
    buttonText: '완료',
  },
];
