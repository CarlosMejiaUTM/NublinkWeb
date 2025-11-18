import React, { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";

import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PlusIcon,
  Squares2X2Icon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import {
  createProduct,
  createProductCategory,
  getProductCategories,
} from "@/services/api/products";
import { getStoreProfile } from "../../../services/api";

import type { CreateProductData } from "@/services/api/products";
import type { Category as ProductCategory } from "@/types";

interface AddProductFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para crear nueva categoría
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
  });
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Cargar categorías al iniciar
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await getProductCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      setErrors((prev) => ({ ...prev, categories: "Error al cargar categorías" }));
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "La imagen no debe superar los 5MB" }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Solo se permiten archivos de imagen" }));
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryData.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        newCategory: "El nombre de la categoría es requerido",
      }));
      return;
    }

    try {
      setCreatingCategory(true);
      const newCategory = await createProductCategory(newCategoryData);
      setCategories((prev) => [...prev, newCategory]);
      setFormData((prev) => ({ ...prev, categoryId: newCategory.id.toString() }));
      setNewCategoryData({ name: "", description: "" });
      setShowNewCategory(false);
      setErrors((prev) => ({ ...prev, newCategory: "" }));
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        newCategory: error.message || "Error al crear categoría",
      }));
    } finally {
      setCreatingCategory(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "El nombre del producto es requerido";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "El precio debe ser mayor a 0";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "El stock debe ser mayor o igual a 0";
    if (!formData.categoryId)
      newErrors.categoryId = "Debes seleccionar una categoría";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const userProfile = await getStoreProfile();
      const storeId = userProfile.store?.id;

      if (!storeId) throw new Error("No se pudo obtener el ID de la tienda");

      const productData: CreateProductData = {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        storeId,
        categoryId: parseInt(formData.categoryId),
        image: imageFile || undefined,
      };

      await createProduct(productData);
      onSubmit();
    } catch (error: any) {
      console.error("Error al crear producto:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Error al crear el producto. Intenta de nuevo.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-line-light mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CubeIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-main">Añadir Nuevo Producto</h2>
              <p className="text-sm text-text-muted">Completa la información del producto</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition-colors p-2 hover:bg-secondary rounded-lg"
            disabled={isSubmitting}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Imagen */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-text-main mb-2">
                Imagen del Producto
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="product-image"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="product-image"
                  className={`block w-full aspect-square border-2 border-dashed border-line-light rounded-xl hover:border-primary transition-colors overflow-hidden group ${
                    isSubmitting ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Cambiar imagen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                      <PhotoIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Subir imagen</span>
                      <span className="text-xs mt-1">PNG, JPG hasta 5MB</span>
                    </div>
                  )}
                </label>
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
              </div>
            </div>

            {/* Datos del Producto */}
            <div className="lg:col-span-2 space-y-4">
              <Input
                id="name"
                name="name"
                label="Nombre del Producto"
                placeholder="Ej: Audífonos Bluetooth JBL"
                value={formData.name}
                onChange={handleInputChange}
                required
                icon={<TagIcon />}
                error={errors.name}
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="price"
                  name="price"
                  label="Precio"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  icon={<CurrencyDollarIcon />}
                  error={errors.price}
                  disabled={isSubmitting}
                />
                <Input
                  id="stock"
                  name="stock"
                  label="Stock Inicial"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  icon={<ArchiveBoxIcon />}
                  error={errors.stock}
                  disabled={isSubmitting}
                />
              </div>

              {/* Categoría */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-text-main">
                    Categoría
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="text-xs text-primary hover:text-primary-dark flex items-center gap-1"
                    disabled={isSubmitting}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Nueva categoría
                  </button>
                </div>

                {showNewCategory && (
                  <Card className="p-4 mb-3 bg-secondary/50">
                    <div className="space-y-3">
                      <Input
                        id="newCategoryName"
                        label="Nombre de la categoría"
                        placeholder="Ej: Electrónica"
                        value={newCategoryData.name}
                        onChange={(e) =>
                          setNewCategoryData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        icon={<Squares2X2Icon />}
                        disabled={creatingCategory}
                      />
                      <textarea
                        className="w-full px-3 py-2 text-sm border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Productos relacionados con tecnología"
                        value={newCategoryData.description}
                        onChange={(e) =>
                          setNewCategoryData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={2}
                        disabled={creatingCategory}
                      />
                      {errors.newCategory && (
                        <p className="text-red-500 text-xs">{errors.newCategory}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleCreateCategory}
                          disabled={creatingCategory}
                        >
                          {creatingCategory ? "Creando..." : "Crear categoría"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setShowNewCategory(false);
                            setNewCategoryData({ name: "", description: "" });
                            setErrors((prev) => ({ ...prev, newCategory: "" }));
                          }}
                          disabled={creatingCategory}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <Select
                  id="categoryId"
                  name="categoryId"
                  options={categoryOptions}
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  error={errors.categoryId}
                  disabled={isSubmitting || loadingCategories}
                />
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-text-main mb-2"
                >
                  Descripción (Opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-line-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Describe las características del producto..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              {/* Error general */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.submit}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6 pt-6 border-t border-line-light">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creando producto...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Añadir Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProductForm;
