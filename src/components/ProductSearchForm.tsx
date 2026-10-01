"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
    onSearch: (query: SearchQuery) => Promise<void>;
};




export default function ProductSearchForm(
    { onSearch }: ProductSearchFormProps
) {
    // const {
    //     register,
    //     formState: { errors },
    // } = useForm<SearchQuery>({
    //     // เติม: ตัวเชื่อมที่ทำให้ React Hook Form ตรวจข้อมูลด้วย Zod Schema
    //     resolver: zodResolver(SearchQuerySchema),
    //     mode: "onTouched",
    //     defaultValues: defaultQuery,
    // });

    // const { register } = useForm<SearchQuery>({
    //     defaultValues: defaultQuery,
    // });
    
    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors, isSubmitting },
    // } = useForm<SearchQuery>({ defaultValues: defaultQuery, });
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SearchQuery>({ 
        resolver: zodResolver(SearchQuerySchema),
        mode: "onTouched",
        defaultValues: defaultQuery, 
    });


    return (
        // เติม: เมธอดของ useForm ที่ห่อฟังก์ชันก่อนส่งให้ onSubmit
        <form onSubmit={handleSubmit(onSearch)} noValidate className="search-form">

            <label htmlFor="limit" className="form-label search-label">จำนวนรายการ</label>
            <input
                id="limit"
                type="number"
                required
                {...register("limit", { valueAsNumber: true })}
                aria-invalid={!!errors.limit}
                aria-describedby="limit-error"
                className="form-input search-input"
            />
            <span id="limit-error" role="alert" className="error-msg">{errors.limit?.message}</span>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
                {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
            </button>
        </form>
    );
}