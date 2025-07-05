import React from 'react';
import { View, ActivityIndicator } from 'react-native'; // Thêm View và ActivityIndicator
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// --- 1. IMPORT HOOK USEAUTH ---
import { useAuth } from './context/AuthContext';

// Import các màn hình của bạn
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import SearchScreen from './screens/SearchScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen.';
import ChatScreen from './screens/ChatScreen';
import CartScreen from './screens/cart/cartScreen';
import CheckoutScreen from './screens/checkout/CheckoutScreen';
import ProfileDetail from './screens/ProfileDetail';
import OrderHistoryScreen from './screens/orderhistory/orderHistoryScreen';
import DetailOrderScreen from './screens/orderhistory/detailorder';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Component MainTab không thay đổi nhiều, nhưng ta có thể thêm tab Chat vào đây
function MainTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Nên bắt đầu ở Home thay vì Login
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Chat') { // Thêm icon cho Chat
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'message' : 'message-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name='Chat' component={ChatScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 2. CHỈNH SỬA COMPONENT APPNAVIGATOR CHÍNH ---
export default function AppNavigator() {
  // Lấy trạng thái xác thực và trạng thái loading từ AuthContext
  const { isAuthenticated, isLoading } = useAuth();

  // --- 3. HIỂN THỊ MÀN HÌNH CHỜ KHI APP ĐANG KIỂM TRA ĐĂNG NHẬP ---
  // Khi app mới khởi động, AuthContext cần thời gian để đọc AsyncStorage
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* --- 4. ĐIỀU HƯỚNG TỰ ĐỘNG DỰA VÀO ISAUTHENTICATED --- */}
        {isAuthenticated ? (
          // Nếu ĐÃ ĐĂNG NHẬP, hiển thị các màn hình chính
          <>
            <Stack.Screen name="MainTab" component={MainTab} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Detail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="DetailProfile" component={ProfileDetail} />
            <Stack.Screen name="orderhistory" component={OrderHistoryScreen} />
            <Stack.Screen name="DetailOrderScreen" component={DetailOrderScreen} />
            {/* Thêm các màn hình khác chỉ dành cho người đã đăng nhập ở đây */}
          </>
        ) : (
          // Nếu CHƯA ĐĂNG NHẬP, chỉ hiển thị màn hình Login và SignUp
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
