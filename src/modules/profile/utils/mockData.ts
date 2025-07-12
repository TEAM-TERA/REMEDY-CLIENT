import { DropItemProps } from '../types/DropItem';

export const dropMockData: DropItemProps[] = [
    {
        memo: "이 길을 지날때마다 이 노래가 생각나요",
        location: "부산광역시 강서구 가락대로",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: false,
    },
    {
        memo: "새벽 드라이브할 때 듣기 좋은 노래입니다",
        location: "서울특별시 종로구 청계천로",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: false,
    },
    {
        memo: "비 오는 날 듣고 싶은 곡이에요",
        location: "대구광역시 수성구 범어동",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: false,
    },
];

export const likeMockData: DropItemProps[] = [
    {
        memo: "정말 좋은 노래예요! 계속 듣고 싶어요",
        location: "경기도 성남시 분당구",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: true,
    },
    {
        memo: "감동적인 멜로디가 인상적인 음악입니다",
        location: "인천광역시 연수구 송도동",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: true,
    },
    {
        memo: "계속 듣고 싶어지는 중독성 있는 노래예요",
        location: "광주광역시 북구 용봉동",
        imageSource: require('../../../assets/images/IU.png'),
        hasHeart: true,
    },
];
