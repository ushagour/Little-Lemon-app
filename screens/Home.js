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

import {useSQLiteContext} from 'expo-sqlite';
import { getAllItems, ensureMenuTable, insertMenuIntoSQLite,clearMenuTable } from '../database/queries';
import { getImageUrl } from '../api/getImageUrl';
import AppButton from '../components/Forms/AppButton';



function Home({ navigation }) {
  const db = useSQLiteContext();
  const [query, setQuery] = useState('');
  const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuData, setMenuData] = useState([]);
  const [loadedFrom, setLoadedFrom] = useState("");


  useEffect(() => {

    const init = async () => {
      if (!db) {
        // no sqlite available -> fallback to fetch
        await loadFromRemoteAndSetState();
        
        return;
      }

      try {
        // 1) make sure table exists
        await ensureMenuTable(db);

        // 2) check existing rows
        const rows = await getAllItems(db); // returns [] if empty
        if (rows && rows.length > 0) {
          setMenuData(rows.map(mapRowToUI));
          return;
        }

        // 3) empty DB -> fetch remote, insert all, then load from DB
        const res = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
        const json = await res.json();
        const items = Array.isArray(json) ? json : json.menu || [];

        // insert into DB (insertMenuIntoSQLite expects array or single)
        await insertMenuIntoSQLite(db, items);

        // re-read from DB and set state
        const loaded = await getAllItems(db);
        
        setMenuData(loaded.map(mapRowToUI));
        setLoadedFrom("SQLite DB");
      } catch (e) {
        console.error('Init DB/fetch error', e);
        // fallback to remote fetch if DB flow failed
        await loadFromRemoteAndSetState();
      }
    };

    init();
  }, [db]);


  
  const filtered = menuData.filter((m) => {
    const matchesQuery = m.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : m.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }  } style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
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
           <Text style={styles.sectionSub}>source : {loadedFrom}</Text>
          {/* <AppButton title="clearDB" onPress={async () => {clearMenuTable(db); setMenuData([]);}} /> */}

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

// Map a DB row to the UI shape expected by the list
function mapRowToUI(r, idx = 0) {
  return {
    id: r.id ? String(r.id) : String(idx + 1),
    name: r.name || 'Untitled',
    description: r.description || '',
    price: r.price ? `$${r.price}` : '$0.00',
    category: r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1) : 'Uncategorized',//capitalization handled in filter
    image: getImageUrl(r.image) || require('../assets/images/placeholder.png'),
  };
}
//this method fetches from remote api if there is no sql database available

async function loadFromRemoteAndSetState() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
    const json = await res.json();
    const items = Array.isArray(json) ? json : json.menu || [];
    const ui = items.map((it, idx) => ({
      id: it.id ? String(it.id) : String(idx + 1),
      title: it.name || it.title || 'Untitled',
      description: it.description || '',
      price: `$${(typeof it.price === 'number' ? it.price : parseFloat(it.price) || 0)}`,
        category: it.category ? it.category.charAt(0).toUpperCase() + it.category.slice(1) : 'Uncategorized',//capitalization handled in filter
    image: getImageUrl(it.image) || require('../assets/images/placeholder.png'),
    }));
    setMenuData(ui);
    setLoadedFrom("Remote API");
    
  } catch (err) {
    console.error('Remote load failed', err);
  }
}

