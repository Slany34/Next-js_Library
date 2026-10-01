"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
    editing: Product | null;
    onSave: (draft: ProductDraft) => void;
    onCancel: () => void;
};

export default function ProductForm(
    { editing, onSave, onCancel }: ProductFormProps
) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isValid },
    } = useForm<ProductDraft>({
        resolver: zodResolver(ProductDraftSchema),
        mode: "onTouched",
        defaultValues: editing
            ? {
                title: editing.title, price: editing.price,
                stock: editing.stock, category: editing.category
            }
            : { title: "", price: undefined, stock: undefined },
    });

    return (
        <form className="product-form">
            <label htmlFor="title" className="form-label">ชื่อสินค้า</label>
            <input
                id="title"
                required
                {...register("title")}
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
                className="form-input"
            />
            <span id="title-error" role="alert" className="error-msg">{errors.title?.message}</span>

            <label htmlFor="price" className="form-label">ราคา</label>
            <input
                id="price"
                type="number"
                step="0.01"
                required
                // เติม: ตัวเลือกที่สั่งให้แปลงค่าเป็นตัวเลขก่อนส่งให้ Schema
                {...register("price", { valueAsNumber: true })}
                aria-invalid={!!errors.price}
                aria-describedby="price-error"
                className="form-input"
            />
            <span id="price-error" role="alert" className="error-msg">{errors.price?.message}</span>

            <label htmlFor="stock" className="form-label">จำนวนคงเหลือ</label>
            <input
                id="stock"
                type="number"
                required
                // เติม: ตัวเลือกที่สั่งให้แปลงค่าเป็นตัวเลขก่อนส่งให้ Schema
                {...register("stock", { valueAsNumber: true })}
                aria-invalid={!!errors.stock}
                aria-describedby="stock-error"
                className="form-input"
                />
            <span id="stock-error" role="alert" className="error-msg">{errors.stock?.message}</span>

            <label htmlFor="category" className="form-label">หมวดหมู่</label>
            <select
                id="category"
                required
                {...register("category")}
                aria-invalid={!!errors.category}
                aria-describedby="category-error"
                className="form-input"
            >
                <option value="">กรุณาเลือกหมวดหมู่</option>
                {CATEGORIES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                ))}
            </select>
            <span id="category-error" role="alert" className="error-msg">
                {errors.category?.message}
            </span>

            <button
                type="submit"
                // เติม: ค่าที่บอกว่าข้อมูลทั้งฟอร์มผ่าน Schema แล้วหรือไม่
                disabled={!isDirty || !isValid}
                className="btn-primary form-submit-btn"
            >
                {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>

            {editing && (
                <button type="button" onClick={onCancel} className="btn-secondary">ยกเลิก</button>
            )}


        </form>

    );
}