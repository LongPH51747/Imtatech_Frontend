import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import ListItem from "./customcomponent/listitem";
import Header from "./customcomponent/header";
import { apiGetAllProducts } from "./api";

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await apiGetAllProducts();
        console.log('Products response:', prodRes.data);
        setProducts(prodRes.data.products || prodRes.data);
      } catch (error) {
        console.log("Home fetch error:", error, error?.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff", height: "100%" }}>
      {/* Banner with overlay slogan and cart icon */}
      <View style={{ position: 'relative', backgroundColor: '#fff', paddingBottom: 16 ,marginTop:30}}>
        {/* Banner image lower */}
        <Image
          source={require('./img/image_9.png')}
          style={{ width: '100%', height: 230, resizeMode: 'cover', }}
        />
        {/* Overlay slogan, button, and cart icon */}
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 140, padding: 20, justifyContent: 'flex-start' }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 6 }}>Planta - tỏa sáng</Text>
          <Text style={{ fontSize: 18, color: '#222', marginBottom: 6 }}>không gian nhà bạn</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ color: '#2ecc71', fontSize: 16, fontWeight: 'bold', marginRight: 4 }}>Xem hàng mới về</Text>
            <Text style={{ color: '#2ecc71', fontSize: 18 }}>→</Text>
          </TouchableOpacity>
          {/* Cart icon top right */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 8, right: 16, backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}
            onPress={() => navigation.navigate('Cart')}
          >
            <Image source={require('./img/shopping-cart.png')} style={{ width: 28, height: 28 }} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Section title */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginLeft: 20, marginBottom: 8 }}>Cây trồng</Text>
      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ListItem
            plant={item}
            onPress={() => navigation.navigate('Detail', { product: item })}
          />
        )}
        numColumns={2}
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:40}}>Không có sản phẩm nào</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    marginBottom: 0,
  }
});
