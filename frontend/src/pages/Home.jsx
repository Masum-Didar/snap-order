import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        API.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.log("Error fetching products", err));
    }, []);

    return (
        <div className="container">
            <h2 className="text-center mb-4">আমাদের পণ্যসমূহ</h2>
            <div className="row">
                {products.map(p => (
                    <div className="col-md-3 col-6 mb-4" key={p._id}>
                        <ProductCard product={p} />
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="text-center mt-5">
                        <h4>কোনো পণ্য পাওয়া যায়নি।</h4>
                        <p className="text-muted">অ্যাডমিন প্যানেল থেকে কিছু পণ্য যোগ করুন।</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Home;