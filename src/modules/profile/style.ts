import { StyleSheet } from 'react-native';
const commonStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#111118',
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameEditContainer: {
    padding: 12,
    gap: 12,
  },
  nameEditInput: {
    padding: 12,
    backgroundColor: '#1D1D26',
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    padding: 12,
    backgroundColor: '#EF104C',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default commonStyles;
