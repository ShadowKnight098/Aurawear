import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import { supabase } from '../config/supabaseClient';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Products state (defaults to initialProducts, and gets hydrated from Supabase if connected)
  const [products, setProducts] = useState(initialProducts);

  // Current logged in User session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('aura_user', JSON.stringify(user));
  }, [user]);

  // Hydrate products from Supabase products table
  useEffect(() => {
    const fetchProductsFromDB = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          const formatted = data.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            subCategory: p.sub_category,
            price: p.price,
            originalPrice: p.original_price,
            discountBadge: p.discount_badge,
            rating: p.rating,
            reviewsCount: p.reviews_count,
            images: p.images,
            videoUrl: p.video_url,
            availability: p.availability,
            stock: p.stock,
            sizes: p.sizes,
            colors: p.colors,
            fit: p.fit,
            brand: p.brand,
            occasions: p.occasions,
            description: p.description,
            features: p.features,
            reviews: p.reviews || []
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error('Failed to load products from Supabase:', err);
      }
    };
    fetchProductsFromDB();
  }, []);

  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  // Wishlist state (user-scoped)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const saved = localStorage.getItem(`aura_wishlist_${u.id}`);
        return saved ? JSON.parse(saved) : [];
      }
      const guestSaved = localStorage.getItem('aura_wishlist_guest');
      return guestSaved ? JSON.parse(guestSaved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`aura_wishlist_${user.id}`, JSON.stringify(wishlist));
    } else {
      localStorage.setItem('aura_wishlist_guest', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('aura_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aura_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Product Comparison state (max 3 items)
  const [compareList, setCompareList] = useState([]);

  // Active coupon applied to cart
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Dynamic coupons state
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved coupons:", e);
    }
    return [
      { code: 'SUMMER10', discount_percent: 10, expiry_date: '2026-06-30T23:59:59.000Z', usage_limit: 100, usage_count: 12, min_cart_amount: 500, category_restriction: 'All' },
      { code: 'FESTIVE20', discount_percent: 20, expiry_date: '2026-12-31T23:59:59.000Z', usage_limit: 200, usage_count: 8, min_cart_amount: 1000, category_restriction: 'All' },
      { code: 'WELCOME15', discount_percent: 15, expiry_date: '2026-08-31T23:59:59.000Z', usage_limit: 300, usage_count: 31, min_cart_amount: 0, category_restriction: 'All' }
    ];
  });

  // Hydrate coupons from Supabase
  useEffect(() => {
    const fetchCouponsFromDB = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (!error && data) {
          let localConditions = {};
          try {
            const savedConds = localStorage.getItem('aura_coupon_conditions');
            if (savedConds) localConditions = JSON.parse(savedConds);
          } catch (e) {}

          const formatted = data.map(c => {
            const cond = localConditions[c.code] || {};
            return {
              code: c.code,
              discount_percent: Number(c.discount_percent),
              expiry_date: c.expiry_date,
              usage_limit: c.usage_limit ?? 100,
              usage_count: c.usage_count ?? 0,
              min_cart_amount: c.min_cart_amount !== undefined ? Number(c.min_cart_amount) : (cond.min_cart_amount ?? 0),
              category_restriction: c.category_restriction !== undefined ? c.category_restriction : (cond.category_restriction ?? 'All')
            };
          });

          if (formatted.length > 0) {
            setCoupons(formatted);
          } else {
            // Seed default coupons in database if empty
            const defaultCoupons = [
              { code: 'SUMMER10', discount_percent: 10, expiry_date: '2026-06-30T23:59:59.000Z', usage_limit: 100, usage_count: 12, min_cart_amount: 500, category_restriction: 'All' },
              { code: 'FESTIVE20', discount_percent: 20, expiry_date: '2026-12-31T23:59:59.000Z', usage_limit: 200, usage_count: 8, min_cart_amount: 1000, category_restriction: 'All' },
              { code: 'WELCOME15', discount_percent: 15, expiry_date: '2026-08-31T23:59:59.000Z', usage_limit: 300, usage_count: 31, min_cart_amount: 0, category_restriction: 'All' }
            ];

            for (const item of defaultCoupons) {
              const payload = {
                code: item.code,
                discount_percent: item.discount_percent,
                expiry_date: item.expiry_date,
                usage_limit: item.usage_limit,
                usage_count: item.usage_count,
                min_cart_amount: item.min_cart_amount,
                category_restriction: item.category_restriction
              };

              const { error: seedError } = await supabase.from('coupons').insert(payload);
              if (seedError && seedError.message.includes('column') && seedError.message.includes('schema cache')) {
                // Table doesn't have min_cart_amount / category_restriction columns
                const { code, discount_percent, expiry_date, usage_limit, usage_count } = payload;
                await supabase.from('coupons').insert({ code, discount_percent, expiry_date, usage_limit, usage_count });
                localConditions[code] = { min_cart_amount: item.min_cart_amount, category_restriction: item.category_restriction };
              }
            }
            localStorage.setItem('aura_coupon_conditions', JSON.stringify(localConditions));
            setCoupons(defaultCoupons);
          }
        }
      } catch (err) {
        console.error('Failed to load coupons from Supabase:', err);
      }
    };
    fetchCouponsFromDB();
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('aura_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Compute activeCoupons object for backward compatibility
  const activeCoupons = {};
  coupons.forEach(c => {
    activeCoupons[c.code] = c.discount_percent;
  });

  const adminCreateCoupon = async (newCoupon) => {
    const formatted = {
      code: newCoupon.code.trim().toUpperCase(),
      discount_percent: Number(newCoupon.discount_percent),
      expiry_date: new Date(newCoupon.expiry_date).toISOString(),
      usage_limit: Number(newCoupon.usage_limit ?? 100),
      usage_count: 0,
      min_cart_amount: Number(newCoupon.min_cart_amount ?? 0),
      category_restriction: newCoupon.category_restriction ?? 'All'
    };

    setCoupons(prev => {
      const filtered = prev.filter(c => c.code !== formatted.code);
      return [formatted, ...filtered];
    });

    if (supabase) {
      try {
        const { error } = await supabase.from('coupons').insert(formatted);
        if (error && error.message.includes('column') && error.message.includes('schema cache')) {
          console.warn('DB schema missing columns. Saving conditions in localStorage fallback...');
          const basicCoupon = {
            code: formatted.code,
            discount_percent: formatted.discount_percent,
            expiry_date: formatted.expiry_date,
            usage_limit: formatted.usage_limit,
            usage_count: formatted.usage_count
          };
          const { error: retryError } = await supabase.from('coupons').insert(basicCoupon);
          if (!retryError) {
            let localConditions = {};
            try {
              const saved = localStorage.getItem('aura_coupon_conditions');
              if (saved) localConditions = JSON.parse(saved);
            } catch (e) {}
            localConditions[formatted.code] = {
              min_cart_amount: formatted.min_cart_amount,
              category_restriction: formatted.category_restriction
            };
            localStorage.setItem('aura_coupon_conditions', JSON.stringify(localConditions));
          }
        }
      } catch (err) {
        console.error('Database connection exception on coupon creation:', err);
      }
    }
  };

  const adminDeleteCoupon = async (code) => {
    const codeUpper = code.trim().toUpperCase();
    setCoupons(prev => prev.filter(c => c.code !== codeUpper));

    try {
      const saved = localStorage.getItem('aura_coupon_conditions');
      if (saved) {
        const localConditions = JSON.parse(saved);
        delete localConditions[codeUpper];
        localStorage.setItem('aura_coupon_conditions', JSON.stringify(localConditions));
      }
    } catch (e) {}

    if (supabase) {
      try {
        await supabase.from('coupons').delete().eq('code', codeUpper);
      } catch (err) {
        console.error('Database connection exception on coupon deletion:', err);
      }
    }

    if (couponCode === codeUpper) {
      removeCoupon();
    }
  };


  // Saved Addresses state (user-scoped)
  const [addresses, setAddresses] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const saved = localStorage.getItem(`aura_addresses_${u.id}`);
        return saved ? JSON.parse(saved) : [];
      }
      const guestSaved = localStorage.getItem('aura_addresses_guest');
      return guestSaved ? JSON.parse(guestSaved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`aura_addresses_${user.id}`, JSON.stringify(addresses));
    } else {
      localStorage.setItem('aura_addresses_guest', JSON.stringify(addresses));
    }
  }, [addresses, user]);

  // Orders State (user-scoped)
  const [orders, setOrders] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aura_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const saved = localStorage.getItem(`aura_orders_${u.id}`);
        return saved ? JSON.parse(saved) : [];
      }
      const guestSaved = localStorage.getItem('aura_orders_guest');
      return guestSaved ? JSON.parse(guestSaved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(`aura_orders_${user.id}`, JSON.stringify(orders));
    } else {
      localStorage.setItem('aura_orders_guest', JSON.stringify(orders));
    }
  }, [orders, user]);

  // Sync Supabase Auth session states
  useEffect(() => {
    if (!supabase) return;

    // Retrieve active session immediately
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        let role = 'customer';
        let name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        let phone = session.user.phone || '';

        try {
          const { data: dbProfile } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (dbProfile) {
            name = dbProfile.name || name;
            phone = dbProfile.phone || phone;
            role = dbProfile.role || role;
          }
        } catch (err) {
          console.error('Error fetching customer profile:', err);
        }

        setUser({
          id: session.user.id,
          name,
          email: session.user.email,
          phone,
          role,
          isAdmin: role === 'admin'
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        let role = 'customer';
        let name = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        let phone = session.user.phone || '';

        try {
          const { data: dbProfile } = await supabase
            .from('customers')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (dbProfile) {
            name = dbProfile.name || name;
            phone = dbProfile.phone || phone;
            role = dbProfile.role || role;
          }
        } catch (err) {
          console.error('Error fetching customer profile:', err);
        }

        setUser({
          id: session.user.id,
          name,
          email: session.user.email,
          phone,
          role,
          isAdmin: role === 'admin'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync User specific data (Orders & Addresses) from Supabase if connected
  useEffect(() => {
    const syncUserData = async () => {
      if (!user) {
        const guestOrders = localStorage.getItem('aura_orders_guest');
        const guestAddresses = localStorage.getItem('aura_addresses_guest');
        const guestWishlist = localStorage.getItem('aura_wishlist_guest');
        setOrders(guestOrders ? JSON.parse(guestOrders) : []);
        setAddresses(guestAddresses ? JSON.parse(guestAddresses) : []);
        setWishlist(guestWishlist ? JSON.parse(guestWishlist) : []);
        return;
      }

      // 1. Fetch Orders from Supabase if active
      if (supabase) {
        try {
          let query = supabase.from('orders').select('*');
          if (!user.isAdmin) {
            query = query.eq('user_id', user.id);
          }
          const { data: dbOrders, error: ordersError } = await query.order('created_at', { ascending: false });

          if (!ordersError && dbOrders) {
            const orderIds = dbOrders.map(o => o.id);
            let allItems = [];
            if (orderIds.length > 0) {
              const { data: dbItems, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .in('order_id', orderIds);
              if (!itemsError && dbItems) {
                allItems = dbItems;
              }
            }

            const formattedOrders = dbOrders.map(row => {
              const items = allItems.filter(item => item.order_id === row.id).map(item => ({
                id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image
              }));

              const statusOrder = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
              const targetIndex = statusOrder.indexOf(row.status);
              const timeline = [
                { status: 'Ordered', date: new Date(row.created_at).toLocaleString(), completed: true },
                { status: 'Packed', date: '', completed: false },
                { status: 'Shipped', date: '', completed: false },
                { status: 'Out for Delivery', date: '', completed: false },
                { status: 'Delivered', date: '', completed: false }
              ].map((step, idx) => ({
                ...step,
                completed: idx <= targetIndex,
                date: idx <= targetIndex ? (idx === 0 ? new Date(row.created_at).toLocaleString() : new Date().toLocaleString()) : ''
              }));

              return {
                id: row.id,
                date: row.created_at,
                subtotal: row.subtotal,
                discount: row.discount,
                shipping: row.shipping,
                total: row.total,
                deliveryDetails: row.shipping_address,
                paymentMethod: row.payment_method,
                status: row.status,
                items,
                timeline
              };
            });
            setOrders(formattedOrders);
          }
        } catch (err) {
          console.error('Error syncing orders from database:', err);
        }
      } else {
        const savedOrders = localStorage.getItem(`aura_orders_${user.id}`);
        setOrders(savedOrders ? JSON.parse(savedOrders) : []);
      }

      // 2. Fetch Addresses from Supabase if active
      if (supabase) {
        try {
          const { data: dbAddresses, error: addrError } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id);

          if (!addrError && dbAddresses) {
            const formattedAddresses = dbAddresses.map(addr => ({
              id: addr.id,
              fullName: addr.full_name,
              phone: addr.phone,
              streetAddress: addr.street_address,
              city: addr.city,
              state: addr.state,
              zipCode: addr.zip_code,
              country: addr.country,
              isDefault: addr.is_default
            }));
            setAddresses(formattedAddresses);
          }
        } catch (err) {
          console.error('Error syncing addresses from database:', err);
        }
      } else {
        const savedAddresses = localStorage.getItem(`aura_addresses_${user.id}`);
        setAddresses(savedAddresses ? JSON.parse(savedAddresses) : []);
      }

      // 3. Fetch Wishlist from Supabase if active
      if (supabase) {
        try {
          const { data: dbWishlist, error: wishError } = await supabase
            .from('wishlists')
            .select('product_id')
            .eq('user_id', user.id);

          if (!wishError && dbWishlist) {
            setWishlist(dbWishlist.map(w => w.product_id));
          }
        } catch (err) {
          console.error('Error syncing wishlist from database:', err);
        }
      } else {
        const savedWishlist = localStorage.getItem(`aura_wishlist_${user.id}`);
        setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
      }
    };

    syncUserData();
  }, [user]);

  // Wire up Supabase Realtime Channels for Real-Time Syncing (Orders & Products)
  useEffect(() => {
    if (!supabase) return;

    // Realtime channel for order tracking status updates
    const ordersChannel = supabase
      .channel('realtime-orders-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
          // Filter order updates/inserts to only display the user's own data (unless admin)
          if (user && !user.isAdmin && row.user_id && row.user_id !== user.id) {
            return;
          }

          if (payload.eventType === 'INSERT') {
            setOrders(prev => {
              if (prev.some(o => o.id === row.id)) return prev;
              const formattedOrder = {
                id: row.id,
                date: row.created_at,
                subtotal: row.subtotal,
                discount: row.discount,
                shipping: row.shipping,
                total: row.total,
                deliveryDetails: row.shipping_address,
                paymentMethod: row.payment_method,
                status: row.status,
                items: [], // loaded separately or lazy loaded
                timeline: [
                  { status: 'Ordered', date: new Date(row.created_at).toLocaleString(), completed: true },
                  { status: 'Packed', date: '', completed: false },
                  { status: 'Shipped', date: '', completed: false },
                  { status: 'Out for Delivery', date: '', completed: false },
                  { status: 'Delivered', date: '', completed: false }
                ]
              };
              return [formattedOrder, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => {
              if (o.id !== row.id) return o;
              const statusOrder = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
              const targetIndex = statusOrder.indexOf(row.status);
              const updatedTimeline = o.timeline.map((step, idx) => ({
                ...step,
                completed: idx <= targetIndex,
                date: idx <= targetIndex ? (step.date || new Date().toLocaleString()) : ''
              }));
              return {
                ...o,
                status: row.status,
                timeline: updatedTimeline
              };
            }));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== row.id));
          }
        }
      )
      .subscribe();

    // Realtime channel for product catalog additions/edits
    const productsChannel = supabase
      .channel('realtime-products-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const p = payload.new;
            setProducts(prev => {
              if (prev.some(item => item.id === p.id)) return prev;
              const formatted = {
                id: p.id,
                name: p.name,
                category: p.category,
                subCategory: p.sub_category,
                price: p.price,
                originalPrice: p.original_price,
                discountBadge: p.discount_badge,
                rating: p.rating,
                reviewsCount: p.reviews_count,
                images: p.images,
                videoUrl: p.video_url,
                availability: p.availability,
                stock: p.stock,
                sizes: p.sizes,
                colors: p.colors,
                fit: p.fit,
                brand: p.brand,
                occasions: p.occasions,
                description: p.description,
                features: p.features,
                reviews: p.reviews || []
              };
              return [formatted, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const p = payload.new;
            setProducts(prev => prev.map(item => {
              if (item.id !== p.id) return item;
              return {
                id: p.id,
                name: p.name,
                category: p.category,
                subCategory: p.sub_category,
                price: p.price,
                originalPrice: p.original_price,
                discountBadge: p.discount_badge,
                rating: p.rating,
                reviewsCount: p.reviews_count,
                images: p.images,
                videoUrl: p.video_url,
                availability: p.availability,
                stock: p.stock,
                sizes: p.sizes,
                colors: p.colors,
                fit: p.fit,
                brand: p.brand,
                occasions: p.occasions,
                description: p.description,
                features: p.features,
                reviews: p.reviews || []
              };
            }));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  // Auth Operations
  const registerUser = async (userData) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'password123',
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone
          }
        }
      });
      if (error) return { success: false, message: error.message };

      const newUser = {
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: 'customer',
        isAdmin: false
      };

      // Create record in the customers table
      try {
        await supabase.from('customers').insert({
          id: data.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          role: 'customer'
        });
      } catch (err) {
        console.error('Error inserting customer to DB:', err);
      }

      setUser(newUser);
      return { success: true, user: newUser };
    } else {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        role: 'customer',
        isAdmin: false
      };
      setUser(newUser);
      return { success: true, user: newUser };
    }
  };

  const loginUser = async (email, password) => {
    if (email === 'admin@aurawear.com' && password === 'admin123') {
      const adminUser = { id: 'admin-1', name: 'Aura Admin', email: 'admin@aurawear.com', isAdmin: true, role: 'admin' };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) return { success: false, message: error.message };

      let role = 'customer';
      let name = data.user.user_metadata?.full_name || email.split('@')[0];
      let phone = data.user.phone || '';

      try {
        const { data: dbProfile } = await supabase
          .from('customers')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        if (dbProfile) {
          name = dbProfile.name || name;
          phone = dbProfile.phone || phone;
          role = dbProfile.role || role;
        }
      } catch (err) {
        console.error('Error loading customer profile from DB:', err);
      }

      const profile = {
        id: data.user.id,
        name,
        email,
        phone,
        role,
        isAdmin: role === 'admin'
      };
      setUser(profile);
      return { success: true, user: profile };
    } else {
      const regularUser = { id: 'usr-default', name: 'Guest User', email, phone: '+91 99999 88888', role: 'customer', isAdmin: false };
      setUser(regularUser);
      return { success: true, user: regularUser };
    }
  };

  const signInWithGoogle = async () => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) return { success: false, message: error.message };
      return { success: true, data };
    } else {
      const mockGoogleUser = { id: 'usr-google', name: 'Google Sandbox User', email: 'google.sandbox@example.com' };
      setUser(mockGoogleUser);
      return { success: true, user: mockGoogleUser };
    }
  };

  const logoutUser = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  // Cart Operations
  const addToCart = (productId, size, color, qty = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(prev => {
      const key = `${productId}-${size}-${color}`;
      const existing = prev.find(item => item.key === key);

      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prev, {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          size,
          color,
          quantity: qty,
          maxStock: product.stock
        }];
      }
    });
  };

  const updateQuantity = (key, qty) => {
    if (qty <= 0) {
      removeFromCart(key);
      return;
    }
    setCart(prev => prev.map(item =>
      item.key === key ? { ...item, quantity: qty } : item
    ));
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(item => item.key !== key));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
    setDiscountPercent(0);
  };

  // Wishlist Operations (DB synced)
  const toggleWishlist = async (productId) => {
    const isAdded = wishlist.includes(productId);

    // 1. Reactive Local Update
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    // 2. DB Sync
    if (supabase && user) {
      try {
        if (isAdded) {
          const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);
          if (error) {
            console.error('Failed to delete wishlist item in Supabase:', error.message);
          }
        } else {
          const { error } = await supabase
            .from('wishlists')
            .insert({
              user_id: user.id,
              product_id: productId
            });
          if (error) {
            console.error('Failed to insert wishlist item in Supabase:', error.message);
          }
        }
      } catch (err) {
        console.error('Database connection exception on wishlist toggle:', err);
      }
    }
  };

  const moveToCart = async (productId, size, color) => {
    addToCart(productId, size, color, 1);
    setWishlist(prev => prev.filter(id => id !== productId));

    if (supabase && user) {
      try {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) {
          console.error('Failed to remove wishlist item in Supabase on move:', error.message);
        }
      } catch (err) {
        console.error('Database connection exception on wishlist move:', err);
      }
    }
  };

  // Recently Viewed Operations
  const addToRecentlyViewed = (productId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  // Comparison operations
  const toggleComparison = (product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(0, 2), product];
      }
      return [...prev, product];
    });
  };

  // Coupon Operations
  const applyCoupon = (code) => {
    const codeUpper = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === codeUpper);

    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }

    // 1. Expiration check
    const expiry = new Date(coupon.expiry_date);
    if (isNaN(expiry.getTime()) || expiry < new Date()) {
      return { success: false, message: 'This coupon has expired.' };
    }

    // 2. Usage limit check
    if (coupon.usage_count >= coupon.usage_limit) {
      return { success: false, message: 'This coupon usage limit has been reached.' };
    }

    // 3. Minimum spend check
    const subtotal = getSubtotal();
    if (subtotal < coupon.min_cart_amount) {
      return {
        success: false,
        message: `This coupon requires a minimum purchase of ₹${coupon.min_cart_amount}.`
      };
    }

    // 4. Category restriction check
    if (coupon.category_restriction && coupon.category_restriction !== 'All') {
      const hasCategoryItem = cart.some(item => {
        const prod = products.find(p => p.id === item.id);
        return prod && prod.category.toLowerCase() === coupon.category_restriction.toLowerCase();
      });

      if (!hasCategoryItem) {
        return {
          success: false,
          message: `This coupon is only applicable to products in the '${coupon.category_restriction}' category.`
        };
      }
    }

    // Apply coupon
    setCouponCode(codeUpper);
    setDiscountPercent(coupon.discount_percent);
    return { success: true, discountPercent: coupon.discount_percent };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setDiscountAmount(0);
  };

  // Cart Calculations & Coupon Re-validation Effect
  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getShipping = (subtotal) => (subtotal > 1500 || subtotal === 0) ? 0 : 80;

  useEffect(() => {
    const sub = getSubtotal();
    if (couponCode && discountPercent > 0) {
      const coupon = coupons.find(c => c.code === couponCode);
      if (coupon) {
        // Validate min spend
        let isValid = sub >= coupon.min_cart_amount;

        // Validate category
        if (isValid && coupon.category_restriction && coupon.category_restriction !== 'All') {
          isValid = cart.some(item => {
            const prod = products.find(p => p.id === item.id);
            return prod && prod.category.toLowerCase() === coupon.category_restriction.toLowerCase();
          });
        }

        if (!isValid) {
          // Auto-remove invalid coupon on cart change
          setCouponCode('');
          setDiscountPercent(0);
          setDiscountAmount(0);
          return;
        }

        setDiscountAmount(Math.round(sub * (discountPercent / 100)));
      } else {
        setDiscountAmount(Math.round(sub * (discountPercent / 100)));
      }
    } else {
      setDiscountAmount(0);
    }
  }, [cart, couponCode, discountPercent, coupons, products]);

  // Place Order Flow (inserts details to Supabase if connected)
  const placeOrder = async (deliveryDetails, paymentMethod) => {
    const subtotal = getSubtotal();
    const shipping = getShipping(subtotal);
    const total = subtotal - discountAmount + shipping;
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}-AU`;
    
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      deliveryDetails,
      paymentMethod,
      status: 'Ordered',
      timeline: [
        { status: 'Ordered', date: new Date().toLocaleString(), completed: true },
        { status: 'Packed', date: '', completed: false },
        { status: 'Shipped', date: '', completed: false },
        { status: 'Out for Delivery', date: '', completed: false },
        { status: 'Delivered', date: '', completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // DB Insert into Supabase tables if database client is linked
    if (supabase) {
      try {
        const { error: dbOrderError } = await supabase
          .from('orders')
          .insert({
            id: orderId,
            user_id: user?.id || null,
            email: deliveryDetails.email || user?.email || 'guest@aurawear.com',
            subtotal,
            discount: discountAmount,
            shipping,
            total,
            shipping_address: deliveryDetails,
            payment_method: paymentMethod,
            status: 'Ordered'
          });

        if (!dbOrderError) {
          const itemsPayload = cart.map(item => ({
            order_id: orderId,
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image
          }));

          const { error: dbItemsError } = await supabase
            .from('order_items')
            .insert(itemsPayload);

          if (dbItemsError) {
            console.error('Supabase Items Insertion Failed:', dbItemsError.message);
          }
        } else {
          console.error('Supabase Order Placement Failed:', dbOrderError.message);
        }
      } catch (err) {
        console.error('Supabase DB Exception:', err);
      }
    }

    // Increment coupon usage count if applied
    if (couponCode) {
      setCoupons(prev => prev.map(c => {
        if (c.code === couponCode) {
          return { ...c, usage_count: (c.usage_count || 0) + 1 };
        }
        return c;
      }));

      if (supabase) {
        try {
          const targetCoupon = coupons.find(c => c.code === couponCode);
          if (targetCoupon) {
            const nextCount = (targetCoupon.usage_count || 0) + 1;
            await supabase
              .from('coupons')
              .update({ usage_count: nextCount })
              .eq('code', couponCode);
          }
        } catch (err) {
          console.error('Failed to increment coupon usage count in database:', err);
        }
      }
    }

    clearCart();
    return newOrder;
  };

  // Dynamic status timeline update helper (used by Admin)
  const updateOrderStatus = async (orderId, nextStatus) => {
    // 1. Local update for fast reactive feedback
    const statusOrder = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const targetIndex = statusOrder.indexOf(nextStatus);

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedTimeline = order.timeline.map((step, idx) => {
        if (idx <= targetIndex) {
          return {
            ...step,
            completed: true,
            date: step.date || new Date().toLocaleString()
          };
        } else {
          return {
            ...step,
            completed: false,
            date: ''
          };
        }
      });

      return {
        ...order,
        status: nextStatus,
        timeline: updatedTimeline
      };
    }));

    // 2. DB update in Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: nextStatus })
          .eq('id', orderId);
        if (error) {
          console.error('Failed to update order status in Supabase:', error.message);
        }
      } catch (err) {
        console.error('Database connection exception on order status update:', err);
      }
    }
  };

  // Admin Catalog Modification Tools
  const adminAddProduct = async (productData) => {
    const newId = `${productData.category[0].toLowerCase()}-${Date.now()}`;
    const defaultFeatures = [
      'Premium fabric composition',
      'Timeless minimalist design',
      'Breathable comfort fit'
    ];
    const productFeatures = productData.features || defaultFeatures;

    const formattedProduct = {
      id: newId,
      reviewsCount: 0,
      rating: 5.0,
      reviews: [],
      ...productData,
      features: productFeatures
    };
    
    // 1. Reactive Local Update
    setProducts(prev => [formattedProduct, ...prev]);

    // 2. DB insert in Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .insert({
            id: newId,
            name: productData.name,
            category: productData.category,
            sub_category: productData.subCategory,
            price: productData.price,
            original_price: productData.originalPrice,
            discount_badge: productData.discountBadge,
            images: productData.images,
            video_url: productData.videoUrl,
            availability: productData.availability,
            stock: productData.stock,
            sizes: productData.sizes,
            colors: productData.colors,
            fit: productData.fit,
            brand: productData.brand,
            occasions: productData.occasions,
            description: productData.description,
            features: productFeatures,
            reviews: []
          });
        if (error) {
          console.error('Failed to insert product into Supabase:', error.message);
        }
      } catch (err) {
        console.error('Database connection exception on product insertion:', err);
      }
    }

    return formattedProduct;
  };

  const adminEditProduct = async (productId, updatedFields) => {
    // Retrieve existing product details to preserve features if missing from form updates
    const existingProduct = products.find(p => p.id === productId);
    const productFeatures = updatedFields.features || (existingProduct ? existingProduct.features : [
      'Premium fabric composition',
      'Timeless minimalist design',
      'Breathable comfort fit'
    ]);

    // 1. Local update
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, ...updatedFields, features: productFeatures } : p
    ));

    // 2. DB update in Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: updatedFields.name,
            category: updatedFields.category,
            sub_category: updatedFields.subCategory,
            price: updatedFields.price,
            original_price: updatedFields.originalPrice,
            discount_badge: updatedFields.discountBadge,
            images: updatedFields.images,
            video_url: updatedFields.videoUrl,
            availability: updatedFields.availability,
            stock: updatedFields.stock,
            sizes: updatedFields.sizes,
            colors: updatedFields.colors,
            fit: updatedFields.fit,
            brand: updatedFields.brand,
            occasions: updatedFields.occasions,
            description: updatedFields.description,
            features: productFeatures
          })
          .eq('id', productId);
        if (error) {
          console.error('Failed to update product in Supabase:', error.message);
        }
      } catch (err) {
        console.error('Database connection exception on product editing:', err);
      }
    }
  };

  const adminDeleteProduct = async (productId) => {
    // 1. Local update
    setProducts(prev => prev.filter(p => p.id !== productId));

    // 2. DB delete in Supabase
    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        if (error) {
          console.error('Failed to delete product from Supabase:', error.message);
        }
      } catch (err) {
        console.error('Database connection exception on product deletion:', err);
      }
    }
  };

  // AI-like Smart Search
  const getSearchSuggestions = (query) => {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    
    const suggestions = new Set();
    products.forEach(p => {
      if (p.name.toLowerCase().includes(q)) suggestions.add(p.name);
      if (p.category.toLowerCase().includes(q)) suggestions.add(p.category);
      if (p.subCategory.toLowerCase().includes(q)) suggestions.add(p.subCategory);
      p.occasions.forEach(occ => {
        if (occ.toLowerCase().includes(q)) suggestions.add(occ);
      });
    });
    return Array.from(suggestions).slice(0, 5);
  };

  const performAISearch = (query) => {
    if (!query) return products;
    const q = query.toLowerCase().trim();
    
    return products.map(p => {
      let score = 0;
      if (p.name.toLowerCase() === q) score += 100;
      else if (p.name.toLowerCase().includes(q)) score += 50;

      if (p.category.toLowerCase() === q) score += 30;
      if (p.subCategory.toLowerCase() === q) score += 30;
      else if (p.subCategory.toLowerCase().includes(q)) score += 15;

      p.occasions.forEach(occ => {
        if (occ.toLowerCase() === q) score += 40;
        else if (occ.toLowerCase().includes(q)) score += 20;
      });

      if (p.description.toLowerCase().includes(q)) score += 5;
      
      return { product: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
  };

  const addUserAddress = async (newAddr) => {
    setAddresses(prev => [...prev, newAddr]);
    if (supabase && user) {
      try {
        await supabase.from('addresses').insert({
          id: newAddr.id,
          user_id: user.id,
          full_name: newAddr.fullName,
          phone: newAddr.phone,
          street_address: newAddr.streetAddress,
          city: newAddr.city,
          state: newAddr.state,
          zip_code: newAddr.zipCode,
          country: newAddr.country,
          is_default: newAddr.isDefault
        });
      } catch (err) {
        console.error('Error inserting address in database:', err);
      }
    }
  };

  const removeUserAddress = async (addressId) => {
    setAddresses(prev => prev.filter(a => a.id !== addressId));
    if (supabase && user) {
      try {
        await supabase.from('addresses').delete().eq('id', addressId).eq('user_id', user.id);
      } catch (err) {
        console.error('Error deleting address from database:', err);
      }
    }
  };

  const editUserAddress = async (updatedAddr) => {
    setAddresses(prev => prev.map(a => a.id === updatedAddr.id ? updatedAddr : a));
    if (supabase && user) {
      try {
        const { error } = await supabase
          .from('addresses')
          .update({
            full_name: updatedAddr.fullName,
            phone: updatedAddr.phone,
            street_address: updatedAddr.streetAddress,
            city: updatedAddr.city,
            state: updatedAddr.state,
            zip_code: updatedAddr.zipCode,
            country: updatedAddr.country,
            is_default: updatedAddr.isDefault
          })
          .eq('id', updatedAddr.id)
          .eq('user_id', user.id);
        if (error) {
          console.error('Failed to update address in database:', error.message);
        }
      } catch (err) {
        console.error('Address update database exception:', err);
      }
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, message: 'User is not logged in' };
    const updatedUser = {
      ...user,
      name: profileData.name,
      phone: profileData.phone
    };
    
    setUser(updatedUser);
    localStorage.setItem('aura_user', JSON.stringify(updatedUser));
    
    if (supabase) {
      try {
        const { error } = await supabase
          .from('customers')
          .update({
            name: profileData.name,
            phone: profileData.phone
          })
          .eq('id', user.id);
        if (error) {
          console.error('Failed to update profile in database:', error.message);
          return { success: false, message: error.message };
        }
      } catch (err) {
        console.error('Profile update exception:', err);
        return { success: false, message: err.message };
      }
    }
    return { success: true };
  };

  const sendPasswordResetEmail = async (emailVal) => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(emailVal, {
          redirectTo: window.location.origin + '/reset-password'
        });
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true };
      } catch (err) {
        console.error('Password reset email exception:', err);
        return { success: false, message: err.message };
      }
    } else {
      console.log('Mock reset email sent to:', emailVal);
      return { success: true };
    }
  };

  const updatePassword = async (newPassword) => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true };
      } catch (err) {
        console.error('Password update exception:', err);
        return { success: false, message: err.message };
      }
    } else {
      console.log('Mock password updated successfully');
      return { success: true };
    }
  };

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      wishlist,
      recentlyViewed,
      compareList,
      addresses,
      setAddresses,
      addUserAddress,
      removeUserAddress,
      editUserAddress,
      orders,
      user,
      couponCode,
      discountAmount,
      discountPercent,
      activeCoupons,
      coupons,
      adminCreateCoupon,
      adminDeleteCoupon,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      moveToCart,
      addToRecentlyViewed,
      toggleComparison,
      applyCoupon,
      removeCoupon,
      getSubtotal,
      getShipping,
      placeOrder,
      registerUser,
      loginUser,
      logoutUser,
      signInWithGoogle,
      updateOrderStatus,
      adminAddProduct,
      adminEditProduct,
      adminDeleteProduct,
      getSearchSuggestions,
      performAISearch,
      updateProfile,
      sendPasswordResetEmail,
      updatePassword
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
