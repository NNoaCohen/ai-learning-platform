import { suite } from "node:test";
import SubcategoryModel from "../models/Subcategory";

interface ISubcategoryInput {
    name: string;
    categoryId: string;
}
export const addSubcategory = async ({name, categoryId}:ISubcategoryInput) => {
    
    const subcategory =await SubcategoryModel.create({name,categoryId});
    return subcategory;
};
export const getSubcategories = async() => {
    return SubcategoryModel.find();
}
