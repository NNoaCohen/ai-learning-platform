import { Request, Response } from "express";
import * as categoryService from "../services/categoryService"

export const getCategories = async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);

};
export const addCategory = async (req: Request, res: Response) => {
        const name = req.body.name;
        const category = await categoryService.addCategory(name);
        res.status(200).json(category);
};
export const getSubcategoriesByCategory = async (req: Request, res: Response) => {
    
        const categoryId = req.params.id;
        const subcategories = await categoryService.getSubcategories(categoryId);
        res.status(200).json(subcategories);

};