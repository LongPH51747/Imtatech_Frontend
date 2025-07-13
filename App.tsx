import { StyleSheet } from 'react-native'
import React from 'react'
import AppNavigator from './AppNavigator'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
      
    </AuthProvider>
  )
}

export default App

const styles = StyleSheet.create({})
