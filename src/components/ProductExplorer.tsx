"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";


type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<LoadState>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    function saveProduct(draft: ProductDraft) {
        if (editingId !== null) {
            // กรณีแก้ไข: แทนที่เฉพาะแถวที่ id ตรงกัน
            setProducts(products.map((item) =>
                item.id === editingId ? { ...item, ...draft } : item
            ));
            setEditingId(null); // กลับสู่โหมดเพิ่ม
        } else {
            // เติม: เครื่องหมายที่คัดลอกสมาชิกเดิมทั้งหมดของ Array
            setProducts([...products, { ...draft, id: Date.now() }]);
        }
    }

    function removeProduct(id: number) {
        // ลบรายการโดยคัดกรองเอาเฉพาะรายการที่ id ไม่ตรงกับที่ถูกลบ
        setProducts(products.filter((item) => item.id !== id));
        // ถ้ารายการที่กำลังแก้ถูกลบ ให้ยกเลิกโหมดแก้ไขด้วย
        if (editingId === id) {
            setEditingId(null);
        }
    }

    function showResult(list: ProductList) {
        setProducts(list.products);
        setStatus("ready");
        console.log(`พบสินค้า ${list.total} ชิ้น`);
    }

    function showError(error: unknown) {
        setErrorMessage(
            error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
        );
        setStatus("error");
    }

    async function loadProducts(query: SearchQuery) {
        setStatus("loading");
        setErrorMessage("");

        try {
            showResult(await fetchProducts(query));
        } catch (error) {
            showError(error);
        }
    }

    useEffect(() => {
        fetchProducts(defaultQuery).then(showResult).catch(showError);
        // เติม: สิ่งที่กำหนดให้ทำงานเพียงครั้งเดียวตอนแสดงผลครั้งแรก
    }, []);


    return (
        <main className="layout-main">
            <h1 className="page-title">รายการสินค้า</h1>

            <button
                type="button"
                className="btn-primary"
                onClick={() => loadProducts(defaultQuery)}
                disabled={status === "loading"}
            >
                {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
            </button>

            <ProductSearchForm onSearch={loadProducts} />

            {/* ส่วนแสดงผล เขียนเพิ่มในหัวข้อ 1.7 */}
            <section aria-live="polite" className="data-section">
                {status === "idle" && <p className="status-msg">คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>}

                {status === "loading" && <p className="status-msg">กำลังโหลดข้อมูล</p>}

                {status === "error" && <p role="alert" className="error-alert">{errorMessage}</p>}

                {status === "ready" && products.length === 0 && (
                    <p className="status-msg">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
                )}

                {status === "ready" && products.length > 0 && (
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th className="th-cell">ชื่อสินค้า</th><th className="th-cell">ราคา</th>
                                <th className="th-cell">คงเหลือ</th><th className="th-cell">หมวดหมู่</th>
                                <th className="th-cell">รูปประกอบ</th><th className="th-cell text-center">ลบและแก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item.id}>
                                    <td className="td-cell">{item.title}</td>
                                    <td className="td-cell">{item.price}</td>
                                    <td className="td-cell">{item.stock}</td>
                                    <td className="td-cell">{item.category}</td>
                                    <td className="td-cell">
                                        {item.images?.[0] && (
                                            <img src={item.images[0]} alt={item.title} width="200" className="product-image" />
                                        )}
                                    </td>

                                    <td className="td-cell">
                                        <div className="action-buttons">
                                            <button type="button" className="btn-secondary" onClick={() => setEditingId(item.id)}>แก้ไข</button>
                                            <button type="button" className="btn-danger" onClick={() => removeProduct(item.id)}>ลบ</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <div className="form-wrapper">
                <ProductForm
                    // ใช้ key เพื่อบังคับให้ React ล้างฟอร์มสร้างใหม่เมื่อสลับรายการแก้ไข
                    key={editingId ?? "new"}

                    // ส่งค่าจริงของรายการที่กำลังแก้ไปให้ฟอร์ม (ถ้าไม่พบจะเป็น null)
                    editing={editingId ? products.find(item => item.id === editingId) || null : null}

                    onSave={saveProduct}
                    onCancel={() => setEditingId(null)} // คลิกยกเลิกให้กลับไปโหมดเพิ่ม
                />
                {/* <ProductForm
                    editing={null}
                    onSave={saveProduct}
                    onCancel={() => { }}
                /> */}
            </div>
        </main>
    );
}