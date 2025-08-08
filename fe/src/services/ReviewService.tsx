import QueryString from "qs";
import api from "../configs/api";
import type { Review } from "../interfaces/reviews";

const BASE_URL = '/reviews'

export const reviewService = {
    getAll: async (search: string) => {
        const res = await api.get(`${BASE_URL}`, {
            params: {
                _expand: ['user', 'product'],
            },
            paramsSerializer: params => QueryString.stringify(params, { arrayFormat: 'repeat' })
        });
        const allReviews = res.data;

        // const filtered = allReviews.filter((item: any) => {
        //     const userName = item.user?.fullName?.toLowerCase() || '';
        //     const productName = item.product?.name?.toLowerCase() || '';
        //     const comment = item.comment?.toLowerCase() || '';
        //     return (
        //         userName.includes(search.toLowerCase()) ||
        //         productName.includes(search.toLowerCase()) ||
        //         comment.includes(search.toLowerCase()) 
        //     );
        // });

        // return filtered;
        return allReviews;

    },
    getById: async (id: string): Promise<Review[]> => {
        const res = await api.get(`${BASE_URL}/${id}`);
        return res.data;
    },
    getByProductId: async (productId: string): Promise<Review[]> => {
        const res = await api.get(`${BASE_URL}?productId=${productId}&_expand=user`);
        return res.data;
    },

    add: async (review: any) => {
        console.log(review);
        
        const res = await api.post(BASE_URL, {
            ...review,
            createdAt: new Date().toISOString(),
        });
        return res.data;
    },

    update: async (id: string, updateData: Partial<{
        rating: number;
        comment: string;
    }>) => {
        const res = await api.patch(`${BASE_URL}/${id}`, updateData);
        return res.data;
    },

    remove: async (id: string) => {
        const res = await api.delete(`${BASE_URL}/${id}`);
        return res.data;
    },
};
