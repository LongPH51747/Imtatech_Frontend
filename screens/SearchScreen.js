import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { apiSearchProducts, apiGetRecommendedProducts, apiGetAllProducts, BASE_URL } from '../api';
import ListItem from '../customcomponent/listitem';

const { width } = Dimensions.get('window');
const numColumns = 2;
const ITEM_WIDTH = width / numColumns - 24;

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    loadSearchHistory();
    fetchRecommendedProducts();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (query) => {
    try {
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
      setSearchHistory(newHistory);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await apiSearchProducts(debouncedQuery);
      setSuggestions(res.data.slice(0, 5));
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchHistory(searchQuery.trim());
      navigation.navigate('SearchResultsScreen', { searchQuery: searchQuery.trim() });
      Keyboard.dismiss();
    }
  };

  const clearSearchHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      setLoadingRecommended(true);
      const res = await apiGetAllProducts();
      console.log('Recommended products response:', res.data);
      const products = res.data.products || res.data || [];
      setRecommendedProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      setRecommendedProducts([]);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const renderRecommendedProduct = ({ item }) => {
    console.log('Rendering recommended product:', item);
    return (
      <ListItem
        plant={item}
        onPress={() => navigation.navigate('Detail', { product: item })}
      />
    );
  };

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        setSearchQuery(item);
        navigation.navigate('SearchResultsScreen', { searchQuery: item });
      }}
    >
      <Icon name="time-outline" size={20} color="#666" />
      <Text style={styles.historyText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => {
        setSearchQuery(item.name_Product || item.name);
        navigation.navigate('SearchResultsScreen', { searchQuery: item.name_Product || item.name });
      }}
    >
      <Text style={styles.suggestionText}>{item.name_Product || item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Hủy</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}

      {/* Search History */}
      {!searchQuery && searchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Tìm kiếm gần đây</Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text style={styles.clearButton}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* Suggestions */}
      {searchQuery && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Gợi ý tìm kiếm</Text>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}

      {/* Recommended Products */}
      {!searchQuery && (
        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedTitle}>Sản phẩm đề xuất</Text>
          {loadingRecommended ? (
            <View style={styles.loadingRecommended}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : (
            <FlatList
              data={recommendedProducts}
              renderItem={renderRecommendedProduct}
              keyExtractor={item => item._id}
              numColumns={numColumns}
              contentContainerStyle={styles.recommendedList}
              scrollEnabled={false}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  historyContainer: {
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#007AFF',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  recommendedContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingRecommended: {
    padding: 20,
    alignItems: 'center',
  },
  recommendedList: {
    padding: 4,
  },
});

export default SearchScreen; 