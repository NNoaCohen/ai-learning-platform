import CategoryModel from "../models/Category";
import SubcategoryModel from "../models/Subcategory";

export const getCategories = async () => {
    return CategoryModel.find();
};
export const addCategory = async (name: string) => {
    const category = new CategoryModel({ name });
    return await category.save();
};
export const getSubcategories = async (id: string) =>{
    const subcategories = await SubcategoryModel.find({id});
    return subcategories;
}
