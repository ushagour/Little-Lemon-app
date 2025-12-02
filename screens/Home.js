import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import colors from '../config/colors';
import { useSQLiteContext } from 'expo-sqlite';
import { createMenuItem } from '../database/queries';



function Home({ navigation }) {
  const db = useSQLiteContext();
  const [query, setQuery] = useState('');
  const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuData, setMenuData] = useState([]);


  useEffect(() => {
    // Fetch remote menu JSON once on mount
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
        );
        const data = await res.json();
        // API returns an object with `menu` array; fallback to data itself if array
        const items = Array.isArray(data) ? data : data.menu || [];

        // Map API fields to UI fields used in this screen
        const mapped = items.map((it, idx) => ({
          id: it.id ? String(it.id) : String(idx + 1),
          title: it.name || it.title || 'Untitled',
          description: it.description || '',
          price: it.price ? `$${it.price}` : it.price_display || '$0.00',
          category: it.category ? it.category.charAt(0).toUpperCase() + it.category.slice(1) : 'Uncategorized',//capitalization handled in filter


          // Use a local placeholder image; replace with mapping if you add image assets matching API names
          image: require('../assets/images/placeholder.png'),
        }));

        setMenuData(mapped);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenu();
  }, [db]);









  const filtered = menuData.filter((m) => {
    const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : m.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.addButtonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <Header
        onLeftPress={() => navigation.goBack()}
        rightContent={<Image source={require('../assets/images/Profile.png')} style={{ width: 24, height: 24 }} />}
        onRightPress={() => {
          navigation.navigate('Profile');
        }}
      />

      <View style={styles.banner}>
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Little Lemon</Text>
            <Text style={styles.bannerSubtitle}>Fresh Mediterranean dishes</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search menu"
              style={styles.searchTransparent}
              placeholderTextColor="#fff"
            />
          </View>
          <Image source={require('../assets/images/Hero image.png')} style={styles.bannerRightImage} />
        </View>
      </View>    

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <Text style={styles.sectionSub}>Popular dishes</Text>
      </View>

      <View style={styles.categoryWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tagButton, selectedCategory === cat ? styles.tagButtonSelected : null]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.tagText, selectedCategory === cat ? styles.tagTextSelected : null]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={styles.list} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: {
    height: 200,
    padding: 14,
    justifyContent: 'center',
    backgroundColor: colors.primary1,


  },
  bannerTitle: { color: colors.primary2, fontSize: 28, fontWeight: '700' },
  bannerSubtitle: { color: colors.white, marginTop: 4 },
  search: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 9
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: { flex: 1, paddingRight: 12 },
  bannerRightImage: { width: 120, height: 120, borderRadius: 12, opacity: 0.96 },
  searchTransparent: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.36)',
    color: colors.white,
  },
  descriptionWrap: { paddingHorizontal: 16, paddingVertical: 12 },
 descriptionImage:{
  width: 70,
   height: 70,
   borderRadius: 8,
   
 },
  description: { color: colors.white, lineHeight: 20 },
  categoryWrap: { paddingBottom: 8 },
  categoryScroll: { paddingHorizontal: 16, alignItems: 'center' },
  tagButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    marginRight: 8,
  },
  tagButtonSelected: { backgroundColor: colors.primary1 },
  tagText: { color: '#333' },
  tagTextSelected: { color: '#fff', fontWeight: '600' },
  listHeader: { padding: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionSub: { color: '#666', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardDescription: { color: '#666' },
  cardPrice: { color: '#666', marginTop: 6 },
  addButton: {
    backgroundColor: colors.primary1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
});