import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Notification from './src/screens/Notification';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Notification />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
});

export default App;
