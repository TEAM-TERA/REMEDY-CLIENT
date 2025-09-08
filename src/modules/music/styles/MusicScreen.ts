import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1014',
  },
  inner: {
    flex: 1,
    padding: 0,
  },
  topImageWrapper: {
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  topImage: {
    width: windowWidth,
    height: 220,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  infoWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    color: '#FF5A7A',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  playBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playBarTime: {
    color: '#fff',
    fontSize: 12,
  },
  playBarTrack: {
    flex: 1,
    marginHorizontal: 8,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  playBarProgress: {
    width: 0, // 실제 진행률에 따라 동적으로 변경
    height: 4,
    backgroundColor: '#FF5A7A',
    borderRadius: 2,
  },
  likeCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  likeText: {
    color: '#fff',
    marginRight: 12,
  },
  commentText: {
    color: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1744',
    marginRight: 6,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 6,
  },
  userBadge: {
    backgroundColor: '#232025',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  userBadgeText: {
    color: '#A1A1A1',
    fontSize: 12,
  },
  messageBox: {
    backgroundColor: '#232025',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  messageLocation: {
    color: '#A1A1A1',
    fontSize: 12,
  },
  commentTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  commentInputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#232025',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    height: 40,
  },
  commentButton: {
    backgroundColor: '#FF5A7A',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentItemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  commentItemUser: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  commentItemBox: {
    backgroundColor: '#232025',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
  },
  commentItemText: {
    color: '#fff',
    fontSize: 14,
  },
});
