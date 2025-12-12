import React, { useEffect, useState, useRef } from 'react';
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
import { getAllItems, ensureMenuTable, insertMenuIntoSQLite,searchItemsByText } from '../database/queries';
import { getImageUrl } from '../api/getImageUrl';
import AppButton from '../components/Forms/AppButton';
import Avatar from '../components/ui/Avatar';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/ui/Card';



// Custom hook: debounce a value with a delay (in ms)
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debouncedValue;
}






function Home({ navigation }) {
  const db = useSQLiteContext();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500); // debounce for 500ms
  const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuData, setMenuData] = useState([]);
  const [loadedFrom, setLoadedFrom] = useState("");
  const [profile, setProfile] = useState(null);
  const PROFILE_KEY = '@littlelemon_profile';

  
const loadProfile = async () => {  
       const json = await AsyncStorage.getItem(PROFILE_KEY);
          if (json) {
            const data = JSON.parse(json);
            setProfile(data.name);
            console.log('Loaded profile from AsyncStorage:', data.firstName);
          }
        };

  useEffect(() => {


    loadProfile();


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
                  setLoadedFrom("SQLite DB");
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


  // Effect: run search when debouncedQuery changes (after 500ms pause)
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      // if query is empty, reload all items
      getAllItems(db).then((rows) => {
        if (rows && rows.length > 0) {
          setMenuData(rows.map(mapRowToUI));
        }
      }).catch(err => console.error('Reload all items error', err));
      return;
    }

    // search by name in DB
    searchItemsByText(db, debouncedQuery).then((results) => {
      const uiResults = results.map(mapRowToUI);
      setMenuData(uiResults);
    }).catch((err) => {
      console.error('Search error', err);
    });
  }, [debouncedQuery, db]);


  // Filter by category only (search/debounce already applied to menuData)
  const filtered = menuData.filter((m) => {
    const matchesCategory = selectedCategory === 'All' ? true : m.category === selectedCategory;
    return matchesCategory;
  });

  
  return (
    <View style={styles.container}>

      <Header
        rightContent={
          profile?(<Avatar name={profile.firstName} size={32} />):
        <Ionicons name="person-circle" size={24} color="#fff" />}

        onRightPress={() => {
          navigation.navigate('Profile');
        }}
      />

      <View style={styles.banner}>
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerContent}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Little Lemon</Text>
            <Text style={styles.bannerSubtitle}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              style={styles.searchTransparent}
              placeholderTextColor="#fff"
            />
          </View>
          <Image source={require('../assets/images/Hero image.png')} style={styles.bannerRightImage} />
        </View>
      </View>    

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>

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

      <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={({ item }) => <Card item={item} /> } contentContainerStyle={styles.list} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary4 },
  banner: {
    height: 250,
    padding: 14,
    justifyContent: 'center',
    backgroundColor: colors.primary1,


  },
  bannerTitle: { color: colors.primary2, fontSize: 28, fontWeight: '700' },
  bannerSubtitle: { color: colors.white, marginTop: 2, fontSize: 18, lineHeight: 22 },
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
    backgroundColor: colors.secondary2,
    marginRight: 8,
  },
  tagButtonSelected: { backgroundColor: colors.primary1 },
  tagText: { color: '#333' },
  tagTextSelected: { color: '#fff', fontWeight: '600' },
  listHeader: { padding: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionSub: { color: '#666', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },

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

