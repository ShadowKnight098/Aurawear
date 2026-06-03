import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Trash2, Edit, Plus, ArrowLeft, RefreshCw, Check, LogOut } from 'lucide-react';

export const AdminProducts = () => {
  const { user, products, adminAddProduct, adminEditProduct, adminDeleteProduct, logoutUser } = useShop();
  const navigate = useNavigate();

  // Security guard check
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const [view, setView] = useState('list'); // 'list' or 'add' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('T-Shirts');
  const [stock, setStock] = useState('30');
  const [images, setImages] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fit, setFit] = useState('Regular Fit');
  const [brand, setBrand] = useState('Brand A');
  const [description, setDescription] = useState('');
  
  // Selected lists
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);
  const [selectedColors, setSelectedColors] = useState(['Black', 'White']);
  const [selectedOccasions, setSelectedOccasions] = useState(['Casual']);

  if (!user || !user.isAdmin) return null;

  // Toggle helpers
  const toggleSize = (s) => {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };
  const toggleColor = (c) => {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
  };
  const toggleOccasion = (o) => {
    setSelectedOccasions(prev => prev.includes(o) ? prev.filter(item => item !== o) : [...prev, o]);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || '');
    setCategory(product.category);
    setSubCategory(product.subCategory);
    setStock(product.stock);
    setImages(product.images || []);
    setFit(product.fit || 'Regular Fit');
    setBrand(product.brand || 'Brand A');
    setDescription(product.description || '');
    setSelectedSizes(product.sizes);
    setSelectedColors(product.colors);
    setSelectedOccasions(product.occasions);
    setView('edit');
  };

  const handleFiles = (fileList) => {
    const fileArray = Array.from(fileList);
    
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('product-images-input').click();
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one product image.');
      return;
    }
    const payload = {
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountBadge: originalPrice ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF` : undefined,
      category,
      subCategory,
      stock: Number(stock),
      images,
      fit,
      brand,
      description,
      sizes: selectedSizes,
      colors: selectedColors,
      occasions: selectedOccasions,
      availability: Number(stock) > 0 ? 'In Stock' : 'Out of Stock'
    };

    if (view === 'add') {
      adminAddProduct(payload);
    } else if (view === 'edit') {
      adminEditProduct(editingProductId, payload);
    }
    
    // Reset view
    setView('list');
    resetForm();
  };

  const resetForm = () => {
    setEditingProductId(null);
    setName('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Men');
    setSubCategory('T-Shirts');
    setStock('30');
    setImages([]);
    setFit('Regular Fit');
    setBrand('Brand A');
    setDescription('');
    setSelectedSizes(['M', 'L']);
    setSelectedColors(['Black', 'White']);
    setSelectedOccasions(['Casual']);
  };

  return (
    <div className="admin-products-page section-padding">
      <div className="container">
        
        {/* Title header */}
        <div className="admin-header-row mb-32">
          <div>
            <div className="admin-badge">Admin Catalog</div>
            <h1>Products Catalog Management</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {view === 'list' ? (
              <button onClick={() => setView('add')} className="btn btn-primary btn-sm admin-add-btn">
                <Plus size={16} /> <span>Add New Product</span>
              </button>
            ) : (
              <button onClick={() => { setView('list'); resetForm(); }} className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} /> Back to List
              </button>
            )}
            <Link to="/" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} /> Storefront
            </Link>
            <button 
              onClick={() => { logoutUser(); navigate('/'); }} 
              className="btn btn-secondary btn-sm"
              style={{ color: '#c93b3b' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="admin-nav-tabs mb-32">
          <Link to="/admin" className="admin-tab-btn">Overview</Link>
          <Link to="/admin/products" className="admin-tab-btn active">Products Catalog</Link>
          <Link to="/admin/orders" className="admin-tab-btn">Order Dispatch</Link>
          <Link to="/admin/coupons" className="admin-tab-btn">Discounts & Coupons</Link>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="table-wrapper animate-fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Inventory</th>
                  <th>Brand</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No products found in database catalog.</td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id}>
                      <td data-label="Product Details" className="table-product-cell">
                        <img src={p.images[0]} alt="" className="table-thumb" />
                        <div>
                          <strong>{p.name}</strong>
                          <span className="text-xs text-muted block">Code: {p.productCode} | ID: {p.id}</span>
                        </div>
                      </td>
                      <td data-label="Category">{p.category} - {p.subCategory}</td>
                      <td data-label="Price">
                        <strong>₹{p.price}</strong>
                        {p.originalPrice && <span className="orig-price-strike text-xs ml-4">₹{p.originalPrice}</span>}
                      </td>
                      <td data-label="Stock Inventory">
                        <span className={`badge ${p.stock > 5 ? 'badge-success' : 'badge-status'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td data-label="Brand">{p.brand}</td>
                      <td data-label="Actions" className="table-actions-cell">
                        <button onClick={() => handleEditClick(p)} className="btn-edit" title="Edit Catalog Entry">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => adminDeleteProduct(p.id)} className="btn-delete" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add / Edit Form Panel */}
        {(view === 'add' || view === 'edit') && (
          <form onSubmit={handleFormSubmit} className="admin-form-panel animate-scale-in">
            <h2>{view === 'add' ? 'Create Product Entry' : 'Edit Product Details'}</h2>
            <p className="text-secondary mb-20">Specify core catalog fields, sizing grids, and occasions metadata.</p>
            
            <div className="form-group">
              <label className="form-label">Product Name / Title</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Classic Linen Shirt" className="form-input" />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Selling Price (₹)</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 1299" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Original/Strike Price (₹ - Optional)</label>
                <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="e.g. 1999" className="form-input" />
              </div>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Gender Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-input">
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sub-Category</label>
                <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="form-input">
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Shirts">Shirts</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Trousers">Trousers</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Tops">Tops</option>
                  <option value="Dresses">Dresses</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Kurtis">Kurtis</option>
                  <option value="Leggings">Leggings</option>
                  <option value="School Wear">School Wear</option>
                  <option value="Winter Wear">Winter Wear</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Stock Count</label>
                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Product Images (Drop files or click to upload)</label>
              <div 
                className={`image-dropzone ${isDragActive ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  id="product-images-input"
                  multiple 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }}
                />
                <div className="dropzone-content">
                  <Plus size={28} className="dropzone-icon" />
                  <p>Drag & Drop product images here, or <span>browse files</span></p>
                  <span className="help-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports multiple PNG, JPEG, WebP, or SVG files</span>
                </div>
              </div>

              {images.length > 0 && (
                <div className="uploaded-images-preview-grid">
                  {images.map((img, index) => (
                    <div key={index} className="preview-thumb-container animate-scale-in">
                      <img src={img} alt={`Preview ${index}`} className="preview-thumb" />
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }} 
                        className="btn-remove-thumb"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Fit Style</label>
                <select value={fit} onChange={(e) => setFit(e.target.value)} className="form-input">
                  <option value="Slim Fit">Slim Fit</option>
                  <option value="Regular Fit">Regular Fit</option>
                  <option value="Oversized">Oversized</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <select value={brand} onChange={(e) => setBrand(e.target.value)} className="form-input">
                  <option value="Brand A">Brand A</option>
                  <option value="Brand B">Brand B</option>
                </select>
              </div>
            </div>

            {/* Sizing array toggles */}
            <div className="form-group">
              <label className="form-label">Select Sizes</label>
              <div className="checklist-flex">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3-5 Years', '6-8 Years', '9-12 Years', '13-16 Years'].map(sz => (
                  <button 
                    type="button" 
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`btn btn-secondary btn-sm check-btn ${selectedSizes.includes(sz) ? 'checked' : ''}`}
                  >
                    {selectedSizes.includes(sz) && <Check size={12} />} {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color array toggles */}
            <div className="form-group">
              <label className="form-label">Select Colors</label>
              <div className="checklist-flex">
                {['Black', 'White', 'Blue', 'Green', 'Red', 'Grey'].map(col => (
                  <button 
                    type="button" 
                    key={col}
                    onClick={() => toggleColor(col)}
                    className={`btn btn-secondary btn-sm check-btn ${selectedColors.includes(col) ? 'checked' : ''}`}
                  >
                    {selectedColors.includes(col) && <Check size={12} />} {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions toggles */}
            <div className="form-group">
              <label className="form-label">Occasions Mapping</label>
              <div className="checklist-flex">
                {['Casual', 'Formal', 'Party Wear', 'Wedding', 'Office Wear', 'Summer Collection'].map(occ => (
                  <button 
                    type="button" 
                    key={occ}
                    onClick={() => toggleOccasion(occ)}
                    className={`btn btn-secondary btn-sm check-btn ${selectedOccasions.includes(occ) ? 'checked' : ''}`}
                  >
                    {selectedOccasions.includes(occ) && <Check size={12} />} {occ}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Product Description</label>
              <textarea 
                rows="4" 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material type, soft knit properties, styling tips..."
                className="form-input form-textarea"
              ></textarea>
            </div>

            <div className="form-actions mt-20">
              <button type="submit" className="btn btn-primary">
                {view === 'add' ? 'Publish Product' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => { setView('list'); resetForm(); }} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .table-product-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .table-thumb {
          width: 40px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }
        .block {
          display: block;
        }
        .orig-price-strike {
          text-decoration: line-through;
          color: var(--text-muted);
        }
        
        .table-actions-cell {
          display: flex;
          gap: 8px;
        }
        .btn-edit, .btn-delete {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          background-color: var(--bg-primary);
        }
        .btn-edit { color: var(--accent-color); }
        .btn-edit:hover { background-color: var(--accent-light); }
        .btn-delete { color: #c93b3b; }
        .btn-delete:hover { background-color: #f7e8e8; }
        [data-theme="dark"] .btn-delete:hover { background-color: #2b1717; }
        
        /* Admin Form layout */
        .admin-form-panel {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          padding: 40px;
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 576px) {
          .admin-form-panel {
            padding: 24px;
          }
        }
        .admin-form-panel h2 {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }
        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }
        .checklist-flex {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .check-btn {
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .check-btn.checked {
          background-color: var(--accent-color);
          color: var(--accent-text);
          border-color: var(--accent-color);
        }

        /* Image dropzone styling */
        .image-dropzone {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 30px 20px;
          text-align: center;
          background-color: var(--bg-primary);
          cursor: pointer;
          transition: var(--transition-fast);
          margin-bottom: 8px;
        }
        .image-dropzone:hover, .image-dropzone.active {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .dropzone-icon {
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        .image-dropzone:hover .dropzone-icon {
          color: var(--accent-color);
          transform: scale(1.1);
        }
        .dropzone-content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .dropzone-content p span {
          color: var(--accent-color);
          font-weight: 500;
          text-decoration: underline;
        }
        
        /* Thumbnail previews */
        .uploaded-images-preview-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }
        .preview-thumb-container {
          position: relative;
          width: 80px;
          height: 100px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .preview-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .btn-remove-thumb {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(201, 59, 59, 0.9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: var(--transition-fast);
        }
        .btn-remove-thumb:hover {
          background-color: #c93b3b;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};
