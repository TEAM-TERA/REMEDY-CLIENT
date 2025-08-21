export interface Dropping {
  droppingId : string;
  userId : number;
  songId : string;
  title : string;
  latitude : number;
  longitude : number;
  address : string;
}

export interface NodePosition {
  angle: number;        // 노드 위치 각도
  isMain: boolean;      // 메인 노드 여부
  scale: number;        // 크기 비율
  opacity: number;      // 투명도
}

export interface VisibleNode {
  position: NodePosition;
  song: Dropping;
  slotIndex: number;    // 슬롯 번호 (0,1,2)
}

export interface MusicWheelState {
  droppings: Dropping[];
  currentIndex: number;
  rotation: number;
}