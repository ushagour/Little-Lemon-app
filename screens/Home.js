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

import Card from '../components/ui/Card';
import SeparatorView from '../components/ui/SeparatorView';
import SearchView from '../components/Forms/SearchView';
import { useAuth } from '../hooks/useAuth';
import Hero from '../components/Hero';



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
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  

  const debouncedQuery = useDebounce(query, 500); // debounce for 500ms
  const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [menuData, setMenuData] = useState([]);
  


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
        onRightPress={() => {
          navigation.navigate('Profile');
        }}
      />

          <Hero>
                   <SearchView 
                    searchText={query}
                    onChange={setQuery} 
                    />
          </Hero>


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

      <FlatList
       data={filtered} 
       keyExtractor={(i) => i.id}
        renderItem={({ item }) => <Card item={item} /> } 
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={SeparatorView}
       />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary4 },


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
  tagText: { color: '#333', fontFamily: 'Karla-Medium' },
  tagTextSelected: { color: '#fff', fontFamily: 'Karla-Bold' },
  listHeader: { padding: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 20, fontFamily: 'Karla-Bold' },
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
    image: r.image,
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
    image: it.image,
    }));
    setMenuData(ui);
    setLoadedFrom("Remote API");
    
  } catch (err) {
    console.error('Remote load failed', err);
  }
}

