import { Request, Response } from "express";
import * as subcategoriesService from "../services/subcategoryService"

export const getSubcategories = async (req: Request, res: Response) => {
        const subcategories = await subcategoriesService.getSubcategories();
        res.status(200).json(subcategories);

};
export const addSubcategory = async (req: Request, res: Response) => {
        const {name,categoryId} = req.body;
        const category = await subcategoriesService.addSubcategory({name,categoryId});
        res.status(200).json(category);

};