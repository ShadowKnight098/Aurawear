import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const ShopPage = () => {
  const { products, performAISearch } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Filters State
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [subCategory, setSubCategory] = useState('All');
  const [size, setSize] = useState('All');
  const [color, setColor] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [fit, setFit] = useState('All');
  const [brand, setBrand] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [ageGroup, setAgeGroup] = useState('All');
  const [occasion, setOccasion] = useState(searchParams.get('occasion') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const [sortBy, setSortBy] = useState('popularity');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state from query parameters on route change
  useEffect(() => {
    const catQuery = searchParams.get('category');
    const occQuery = searchParams.get('occasion');
    const searchQueryVal = searchParams.get('search');

    if (catQuery) setCategory(catQuery);
    else if (!location.search.includes('category=')) setCategory('All');

    if (occQuery) setOccasion(occQuery);
    else if (!location.search.includes('occasion=')) setOccasion('All');

    if (searchQueryVal) setSearchQuery(searchQueryVal);
    else setSearchQuery('');

    // Trigger loader for a brief premium experience transition
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.search, searchParams]);

  // Reset secondary filters on main category change
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSubCategory('All');
    setSize('All');
    setColor('All');
    setPriceRange('All');
    setFit('All');
    setBrand('All');
    setAvailability('All');
    setAgeGroup('All');
    
    // Update Search Params
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    params.delete('occasion'); // Clear occasion when swapping main catalog tab
    setSearchParams(params);
    setOccasion('All');
  };

  // Helper lists for filters
  const getSubcategories = () => {
    if (category === 'Men') {
      return ['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Jeans', 'Trousers', 'Shorts', 'Ethnic Wear'];
    }
    if (category === 'Women') {
      return ['Tops', 'Dresses', 'Sarees', 'Kurtis', 'Jeans', 'Leggings', 'Jackets', 'Ethnic Wear'];
    }
    if (category === 'Kids') {
      return ['T-Shirts', 'Shirts', 'Dresses', 'School Wear', 'Winter Wear'];
    }
    return [];
  };

  const getSizes = () => {
    if (category === 'Kids') {
      return ['3-5 Years', '6-8 Years', '9-12 Years', '13-16 Years'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };

  const getColors = () => ['Black', 'White', 'Blue', 'Green', 'Red', 'Grey'];
  const getBrands = () => ['Brand A', 'Brand B'];
  const getOccasions = () => ['Casual', 'Formal', 'Party Wear', 'Wedding', 'Office Wear', 'Summer Collection'];

  // Main Filtering Logic
  const getFilteredProducts = () => {
    // 1. Initial product list (if query exists, perform mock AI Search ranking)
    let list = searchQuery ? performAISearch(searchQuery) : products;

    // 2. Main category (Men/Women/Kids)
    if (category !== 'All') {
      list = list.filter(p => p.category === category);
    }

    // 3. Sub Category (T-Shirts, etc.)
    if (subCategory !== 'All') {
      list = list.filter(p => p.subCategory === subCategory);
    }

    // 4. Size or Age Group
    if (size !== 'All') {
      list = list.filter(p => p.sizes.includes(size));
    }
    if (ageGroup !== 'All') {
      list = list.filter(p => p.ageGroup === ageGroup);
    }

    // 5. Colors
    if (color !== 'All') {
      list = list.filter(p => p.colors.includes(color));
    }

    // 6. Brands
    if (brand !== 'All') {
      list = list.filter(p => p.brand === brand);
    }

    // 7. Occasion
    if (occasion !== 'All') {
      list = list.filter(p => p.occasions.includes(occasion));
    }

    // 8. Availability
    if (availability !== 'All') {
      list = list.filter(p => p.availability === availability);
    }

    // 9. Fit (Men only)
    if (category === 'Men' && fit !== 'All') {
      list = list.filter(p => p.fit === fit);
    }

    // 10. Price range filter
    if (priceRange !== 'All') {
      list = list.filter(p => {
        if (priceRange === '0-500') return p.price <= 500;
        if (priceRange === '500-1000') return p.price > 500 && p.price <= 1000;
        if (priceRange === '1000-2000') return p.price > 1000 && p.price <= 2000;
        if (priceRange === '2000+') return p.price > 2000;
        return true;
      });
    }

    // 11. Sorting
    if (sortBy === 'price-low') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else {
      // popularity default (by review counts)
      list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  };

  const filteredProducts = getFilteredProducts();

  const resetAllFilters = () => {
    setCategory('All');
    setSubCategory('All');
    setSize('All');
    setColor('All');
    setPriceRange('All');
    setFit('All');
    setBrand('All');
    setAvailability('All');
    setAgeGroup('All');
    setOccasion('All');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="shop-page-wrapper section-padding">
      <div className="container">
        {/* Breadcrumb / Title */}
        <div className="shop-title-row">
          <div>
            <h1>{category === 'All' ? 'Shop Collection' : `${category}'s Clothing`}</h1>
            <p className="text-secondary">Showing {filteredProducts.length} premium designs</p>
          </div>
          {searchQuery && (
            <div className="search-pill animate-fade-in">
              Search: "{searchQuery}"
              <button onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('search');
                setSearchParams(params);
                setSearchQuery('');
              }}>&times;</button>
            </div>
          )}
        </div>

        {/* Categories Tab Header Navigation */}
        <div className="catalog-tabs">
          {['All', 'Men', 'Women', 'Kids'].map(tab => (
            <button 
              key={tab} 
              onClick={() => handleCategoryChange(tab)}
              className={`catalog-tab-btn ${category === tab ? 'active' : ''}`}
            >
              {tab === 'All' ? 'All Clothing' : tab}
            </button>
          ))}
        </div>

        {/* Top Control Bar */}
        <div className="shop-controls">
          <button onClick={() => setIsMobileFiltersOpen(true)} className="btn btn-secondary mobile-filter-trigger">
            <SlidersHorizontal size={16} /> Filters
          </button>
          
          <div className="sort-box">
            <ArrowUpDown size={14} className="text-muted" />
            <span>Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="popularity">Best Selling / Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Main Grid Wrapper */}
        <div className="shop-layout-grid">
          {/* Sidebar Filters (Desktop) */}
          <aside className="shop-sidebar-filters">
            <div className="sidebar-header-row">
              <h3>Filters</h3>
              <button onClick={resetAllFilters} className="clear-all-link">Clear All</button>
            </div>

            {/* Subcategories (only if Men/Women/Kids is selected) */}
            {category !== 'All' && (
              <div className="filter-section-group">
                <h4 className="filter-section-title">Category</h4>
                <div className="filter-options-list">
                  <button onClick={() => setSubCategory('All')} className={`filter-btn-opt ${subCategory === 'All' ? 'active' : ''}`}>All {category}</button>
                  {getSubcategories().map(sub => (
                    <button key={sub} onClick={() => setSubCategory(sub)} className={`filter-btn-opt ${subCategory === sub ? 'active' : ''}`}>{sub}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Kids Age Groups */}
            {category === 'Kids' && (
              <div className="filter-section-group">
                <h4 className="filter-section-title">Age Group</h4>
                <div className="filter-options-list">
                  <button onClick={() => setAgeGroup('All')} className={`filter-btn-opt ${ageGroup === 'All' ? 'active' : ''}`}>All Ages</button>
                  {['0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '13-16 Years'].map(age => (
                    <button key={age} onClick={() => setAgeGroup(age)} className={`filter-btn-opt ${ageGroup === age ? 'active' : ''}`}>{age}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">{category === 'Kids' ? 'Sizes (Age Group)' : 'Size'}</h4>
              <div className="sizes-options-grid">
                {getSizes().map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(size === s ? 'All' : s)}
                    className={`size-square-opt ${size === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Color</h4>
              <div className="colors-options-grid">
                {getColors().map(col => (
                  <button 
                    key={col}
                    onClick={() => setColor(color === col ? 'All' : col)}
                    className={`color-circle-opt ${color === col ? 'active' : ''}`}
                    style={{ borderColor: color === col ? 'var(--accent-color)' : 'var(--border-color)' }}
                    title={col}
                  >
                    <span className="inner-dot" style={{ backgroundColor: col.toLowerCase() }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Price Range</h4>
              <div className="filter-options-list">
                {[
                  { value: 'All', label: 'Any Price' },
                  { value: '0-500', label: 'Under ₹500' },
                  { value: '500-1000', label: '₹500 – ₹1,000' },
                  { value: '1000-2000', label: '₹1,000 – ₹2,000' },
                  { value: '2000+', label: '₹2,000 & Above' }
                ].map(item => (
                  <button 
                    key={item.value} 
                    onClick={() => setPriceRange(item.value)} 
                    className={`filter-btn-opt ${priceRange === item.value ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fits (Men only) */}
            {category === 'Men' && (
              <div className="filter-section-group">
                <h4 className="filter-section-title">Fit</h4>
                <div className="filter-options-list">
                  {['All', 'Slim Fit', 'Regular Fit', 'Oversized'].map(f => (
                    <button key={f} onClick={() => setFit(f)} className={`filter-btn-opt ${fit === f ? 'active' : ''}`}>{f === 'All' ? 'All Fits' : f}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Occasions (Shop by Occasion) */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Occasion</h4>
              <div className="filter-options-list">
                <button onClick={() => setOccasion('All')} className={`filter-btn-opt ${occasion === 'All' ? 'active' : ''}`}>All Occasions</button>
                {getOccasions().map(occ => (
                  <button key={occ} onClick={() => setOccasion(occ)} className={`filter-btn-opt ${occasion === occ ? 'active' : ''}`}>{occ}</button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Brand</h4>
              <div className="filter-options-list">
                {['All', ...getBrands()].map(b => (
                  <button key={b} onClick={() => setBrand(b)} className={`filter-btn-opt ${brand === b ? 'active' : ''}`}>{b === 'All' ? 'All Brands' : b}</button>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Availability</h4>
              <div className="filter-options-list">
                {['All', 'In Stock', 'Out of Stock'].map(st => (
                  <button key={st} onClick={() => setAvailability(st)} className={`filter-btn-opt ${availability === st ? 'active' : ''}`}>{st === 'All' ? 'Any Availability' : st}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid section */}
          <main className="shop-grid-area">
            {isLoading ? (
              <SkeletonLoader type="product" count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="no-products-found">
                <SlidersHorizontal size={40} className="text-muted" />
                <h3>No matching products found</h3>
                <p>Try resetting some filters or adjusting your search parameters.</p>
                <button onClick={resetAllFilters} className="btn btn-primary mt-12">Reset All Filters</button>
              </div>
            ) : (
              <div className="product-cards-grid animate-fade-in">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <div className={`drawer-overlay ${isMobileFiltersOpen ? 'open' : ''}`} onClick={() => setIsMobileFiltersOpen(false)}>
        <div className="mobile-filters-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Filters</h3>
            <button onClick={() => setIsMobileFiltersOpen(false)} className="close-btn"><X size={20} /></button>
          </div>
          <div className="drawer-body">
            <button onClick={() => { resetAllFilters(); setIsMobileFiltersOpen(false); }} className="btn btn-secondary w-full mb-16">Clear All Filters</button>
            
            {/* Embed same sidebar filters here */}
            {category !== 'All' && (
              <div className="filter-section-group">
                <h4 className="filter-section-title">Category</h4>
                <div className="filter-options-list">
                  <button onClick={() => setSubCategory('All')} className={`filter-btn-opt ${subCategory === 'All' ? 'active' : ''}`}>All {category}</button>
                  {getSubcategories().map(sub => (
                    <button key={sub} onClick={() => setSubCategory(sub)} className={`filter-btn-opt ${subCategory === sub ? 'active' : ''}`}>{sub}</button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sizes */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Size</h4>
              <div className="sizes-options-grid">
                {getSizes().map(s => (
                  <button 
                    key={s} 
                    onClick={() => setSize(size === s ? 'All' : s)}
                    className={`size-square-opt ${size === s ? 'active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Ranges */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Price Range</h4>
              <div className="filter-options-list">
                {[
                  { value: 'All', label: 'Any Price' },
                  { value: '0-500', label: 'Under ₹500' },
                  { value: '500-1000', label: '₹500 – ₹1,000' },
                  { value: '1000-2000', label: '₹1,000 – ₹2,000' },
                  { value: '2000+', label: '₹2,000 & Above' }
                ].map(item => (
                  <button 
                    key={item.value} 
                    onClick={() => setPriceRange(item.value)} 
                    className={`filter-btn-opt ${priceRange === item.value ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fits */}
            {category === 'Men' && (
              <div className="filter-section-group">
                <h4 className="filter-section-title">Fit</h4>
                <div className="filter-options-list">
                  {['All', 'Slim Fit', 'Regular Fit', 'Oversized'].map(f => (
                    <button key={f} onClick={() => setFit(f)} className={`filter-btn-opt ${fit === f ? 'active' : ''}`}>{f === 'All' ? 'All Fits' : f}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Occasion */}
            <div className="filter-section-group">
              <h4 className="filter-section-title">Occasion</h4>
              <div className="filter-options-list">
                {getOccasions().map(occ => (
                  <button key={occ} onClick={() => setOccasion(occ)} className={`filter-btn-opt ${occasion === occ ? 'active' : ''}`}>{occ}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            <button onClick={() => setIsMobileFiltersOpen(false)} className="btn btn-primary w-full">Apply Filters</button>
          </div>
        </div>
      </div>

      <style>{`
        .shop-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .search-pill {
          background-color: var(--accent-light);
          color: var(--accent-color);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .search-pill button {
          font-size: 1.1rem;
          color: var(--accent-color);
          line-height: 1;
        }
        
        .catalog-tabs {
          display: flex;
          gap: 16px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 32px;
        }
        .catalog-tab-btn {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          padding: 12px 8px;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
          transition: var(--transition-fast);
        }
        .catalog-tab-btn:hover {
          color: var(--text-primary);
        }
        .catalog-tab-btn.active {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }

        .shop-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .mobile-filter-trigger {
          display: none;
        }
        @media (max-width: 992px) {
          .mobile-filter-trigger {
            display: inline-flex;
          }
        }
        .sort-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          margin-left: auto;
        }
        .sort-select {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 12px;
          background-color: var(--bg-primary);
        }

        .shop-layout-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }
        @media (max-width: 992px) {
          .shop-layout-grid {
            grid-template-columns: 1fr;
          }
          .shop-sidebar-filters {
            display: none;
          }
        }

        /* Sidebar filter cards */
        .sidebar-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .clear-all-link {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-decoration: underline;
        }
        .filter-section-group {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .filter-section-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .filter-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-btn-opt {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-align: left;
          padding: 4px 0;
          transition: var(--transition-fast);
        }
        .filter-btn-opt:hover {
          color: var(--text-primary);
          padding-left: 4px;
        }
        .filter-btn-opt.active {
          color: var(--accent-color);
          font-weight: 600;
        }
        
        /* Sizes grid */
        .sizes-options-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .size-square-opt {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 500;
          background-color: var(--bg-primary);
          transition: var(--transition-fast);
        }
        .size-square-opt:hover {
          border-color: var(--text-primary);
        }
        .size-square-opt.active {
          background-color: var(--accent-color);
          color: var(--accent-text);
          border-color: var(--accent-color);
        }

        /* Color circles */
        .colors-options-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .color-circle-opt {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          cursor: pointer;
        }
        .color-circle-opt .inner-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }
        
        /* Product area */
        .product-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        @media (max-width: 576px) {
          .product-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        .no-products-found {
          padding: 80px 40px;
          text-align: center;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
        }
        .no-products-found h3 {
          margin: 16px 0 8px;
        }
        .mt-12 {
          margin-top: 12px;
        }
        
        /* Mobile filters drawer */
        .mobile-filters-drawer {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 380px;
          height: 100%;
          background-color: var(--bg-primary);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform var(--transition-normal);
        }
        .drawer-overlay.open .mobile-filters-drawer {
          transform: translateX(0);
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .mb-16 {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};
