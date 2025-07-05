import { StyleSheet } from 'react-native'
import React from 'react'
import AppNavigator from './AppNavigator'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { Provider } from 'react-redux';
import { store } from './redux/store'
const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider>
          <AppNavigator />
        </SocketProvider>
      </AuthProvider>
    </Provider>


  )
}

export default App

const styles = StyleSheet.create({})