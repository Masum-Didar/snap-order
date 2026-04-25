import React, { useState } from 'react';

const BRANDS = ['Nike', 'Adidas', 'Zara', 'H&M', 'Puma', 'Uniqlo'];
const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#1a1a1a', '#e74c3c', '#f39c12', '#4ecdc4', '#3498db', '#9b59b6', '#2ecc71', '#ecf0f1'];

const Sidebar = () => {
    const [selectedSizes, setSelectedSizes] = useState(['XXS']);
    const [selectedColor, setSelectedColor] = useState('#1a1a1a');
    const [selectedBrand, setSelectedBrand] = useState('Nike');
    const [price, setPrice] = useState(300);

    const toggleSize = (s) => setSelectedSizes(prev =>
        prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

    return (
        <aside style={{ width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #ebebeb', padding: '20px 0', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Filter <span style={{ fontSize: 12, color: '#4ecdc4', cursor: 'pointer' }}>Advanced</span>
            </div>

            {/* Brand */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>Brand <span>∧</span></div>
                <input placeholder="Search brand..." style={{ width: '100%', border: '1px solid #ebebeb', borderRadius: 6, padding: '6px 10px', fontSize: 12, outline: 'none', fontFamily: 'inherit', background: '#fafafa', color: '#555', boxSizing: 'border-box' }} />
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {BRANDS.map(b => (
                        <div key={b} onClick={() => setSelectedBrand(b)}
                             style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: selectedBrand === b ? '#1a1a1a' : '#666', fontWeight: selectedBrand === b ? 600 : 400, cursor: 'pointer' }}>
                            {b}
                            {selectedBrand === b && (
                                <div style={{ width: 14, height: 14, border: '1.5px solid #4ecdc4', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4ecdc4' }}>✓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>Price <span>∧</span></div>
                <input type="range" min={0} max={500} value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%', accentColor: '#4ecdc4' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {['$10', `$${price}`].map((v, i) => (
                        <input key={i} defaultValue={v} style={{ flex: 1, border: '1px solid #ebebeb', borderRadius: 5, padding: '5px 8px', fontSize: 11, textAlign: 'center', color: '#555', fontFamily: 'inherit', background: '#fafafa' }} />
                    ))}
                </div>
            </div>

            {/* Size */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>Size <span>∧</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SIZES.map(s => (
                        <div key={s} onClick={() => toggleSize(s)}
                             style={{ padding: '4px 10px', border: '1px solid', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer', borderColor: selectedSizes.includes(s) ? '#1a1a1a' : '#ddd', background: selectedSizes.includes(s) ? '#1a1a1a' : '#fff', color: selectedSizes.includes(s) ? '#fff' : '#555' }}>
                            {s}
                        </div>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>Color <span>∧</span></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {COLORS.map(c => (
                        <div key={c} onClick={() => setSelectedColor(c)}
                             style={{ width: 20, height: 20, borderRadius: '50%', background: c, cursor: 'pointer', border: `2px solid ${selectedColor === c ? '#1a1a1a' : 'transparent'}`, boxSizing: 'border-box' }} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;