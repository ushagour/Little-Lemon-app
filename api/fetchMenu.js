    export const fetchMenu = async () => {
      try {
        const res = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json'
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
          image: it.image || require('../assets/images/placeholder.png'),


        }));


        
        return mapped;
    }
        catch (error) { 
        console.error('Error fetching menu:', error);
        }
   
    };