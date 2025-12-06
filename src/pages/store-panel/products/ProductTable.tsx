import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  CubeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BanknotesIcon,
  UserIcon,
  XMarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import type { Product } from "@/types";
import type { FullPurchase, Apartado, ProductCategory, Comprasfisicas } from "@/services/api/products";
import { updateProduct, deleteProduct, getProductCategories } from "@/services/api/products";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import ConfirmModal from "@/components/common/ConfirmModal";

/* ============================================================
   TIPOS
============================================================ */
type ViewMode = 'products' | 'purchases' | 'apartados' | 'comprasfisicas';

interface ProductTableProps {
  products?: Product[];
  purchases?: FullPurchase[];
  apartados?: Apartado[];
  comprasfisicas?: Comprasfisicas[];
  viewMode: ViewMode;
  onMarkAsPickedUp?: (purchase: FullPurchase) => void; 
  onProductUpdated?: () => void;
  onMarkApartadoAsPickedUp?: (apartado: Apartado) => void; // ✅ Nueva prop
  onMarkComprasFisicasPickedUp?: (comprasfisicas: Comprasfisicas) => void; 

}

interface EditModalProps {
  isOpen: boolean;
  product: Product | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSave: (productId: number, data: UpdateData) => void;
}

interface UpdateData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  image?: File;
}

/* ============================================================
   MODAL DE EDICIÓN
============================================================ */
const EditModal = ({ isOpen, product, categories, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: 0,
    categoryId: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: typeof product.price === 'number' ? product.price.toString() : (product.price || ""),
        stock: product.stock || 0,
        categoryId: product.category?.id || 0,
      });
      setImagePreview(product.imageUrl || null);
      setImageFile(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceValue = parseFloat(formData.price);
    
    const updateData: UpdateData = {
      name: formData.name,
      description: formData.description,
      price: isNaN(priceValue) ? 0 : priceValue,
      stock: formData.stock,
      categoryId: formData.categoryId,
    };

    if (imageFile) {
      updateData.image = imageFile;
    }

    onSave(product.id as number, updateData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-main">Editar Producto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Nombre del producto *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-line-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ej: Laptop Dell Inspiron"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-line-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              placeholder="Describe las características del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Precio *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 border border-line-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Stock *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-line-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Categoría *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-line-light rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-2">
              Imagen del producto
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg border-2 border-line-light overflow-hidden bg-gray-50">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  {imageFile && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Nueva imagen
                    </div>
                  )}
                </div>
              )}
              
              <label className="cursor-pointer block">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-line-light rounded-lg hover:border-primary hover:bg-primary/5 transition">
                  <PhotoIcon className="w-5 h-5 text-text-muted" />
                  <span className="text-sm text-text-muted font-medium">
                    {imageFile ? `Cambiar: ${imageFile.name}` : imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              
              {!imagePreview && (
                <p className="text-xs text-text-muted text-center">
                  Formatos: JPG, PNG, WebP • Tamaño máximo: 5MB
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   MODAL DE ERROR DETALLADO
============================================================ */
interface ErrorModalProps {
  isOpen: boolean;
  errorMessage: string;
  errorDetails?: string;
  onClose: () => void;
}

const ErrorModal = ({ isOpen, errorMessage, errorDetails, onClose }: ErrorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error al actualizar producto</h3>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            
            {errorDetails && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                  Ver detalles técnicos
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto border border-gray-200">
                  {errorDetails}
                </pre>
              </details>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="primary">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   COMPONENTES AUXILIARES
============================================================ */
const ProductAvatar = ({ name, imageUrl }: { name: string; imageUrl?: string }) => (
  <div className="w-10 h-10 rounded-lg border border-line-light/50 shadow-sm">
    {imageUrl ? (
      <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
    ) : (
      <div className="w-full h-full bg-secondary flex items-center justify-center text-primary">
        <CubeIcon className="w-5 h-5" />
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return { icon: CheckCircleIcon, color: 'bg-green-100 text-green-700' };
      case 'pendiente':
        return { icon: ClockIcon, color: 'bg-yellow-100 text-yellow-700' };
      case 'recogido':
        return { icon: CheckCircleIcon, color: 'bg-blue-100 text-blue-700' };
      case 'apartado':
        return { icon: ClockIcon, color: 'bg-orange-100 text-orange-700' };
      case 'liquidado':
        return { icon: BanknotesIcon, color: 'bg-green-100 text-green-700' };
      default:
        return { icon: XCircleIcon, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const { icon: Icon, color } = getStatusConfig();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-4 h-4" />
      {status || "Activo"}
    </span>
  );
};

const UserBadge = ({ name, email }: { name: string; email: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
      <UserIcon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <div className="text-sm font-semibold text-text-main">{name}</div>
      <div className="text-xs text-text-muted">{email}</div>
    </div>
  </div>
);

/* ============================================================
   TABLA DE PRODUCTOS
============================================================ */
const ProductsTable = ({ 
  products, 
  onEdit, 
  onDelete 
}: { 
  products: Product[]; 
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => (
  <Card className="overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-text-main">
          <tr>
            <th className="p-4 text-left">Producto</th>
            <th className="p-4 text-left">Precio</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t hover:bg-secondary-light transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <ProductAvatar name={p.name} imageUrl={p.imageUrl || undefined} />
                  <div>
                    <div className="font-semibold text-text-main">{p.name}</div>
                    <p className="text-xs text-text-muted">{p.category?.name}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 font-medium">${p.price}</td>
              <td className="p-4">
                <span className={`font-medium ${p.stock < 10 ? 'text-red-600' : 'text-text-main'}`}>
                  {p.stock}
                </span>
              </td>
              <td className="p-4">
                <StatusBadge status={p.status} />
              </td>
              <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(p)}>
                    <PencilSquareIcon className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => onDelete(p)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

/* ============================================================
   TABLA DE COMPRAS COMPLETAS
============================================================ */
const PurchasesTable = ({ 
  purchases,
  onMarkAsPickedUp 
}: { 
  purchases: FullPurchase[];
  onMarkAsPickedUp?: (purchase: FullPurchase) => void;
}) => (
  <Card className="overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-text-main">
          <tr>
            <th className="p-4 text-left">Producto</th>
            <th className="p-4 text-left">Cliente</th>
            <th className="p-4 text-left">Cantidad</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-left">Fecha</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="border-t hover:bg-secondary-light transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <ProductAvatar 
                    name={purchase.product.name} 
                    imageUrl={purchase.product.imageUrl} 
                  />
                  <div>
                    <div className="font-semibold text-text-main">{purchase.product.name}</div>
                    <p className="text-xs text-text-muted">ID: {purchase.product.id}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <UserBadge name={purchase.user.name} email={purchase.user.email} />
              </td>
              <td className="p-4">
                <span className="font-medium text-text-main">{purchase.quantity}</span>
              </td>
              <td className="p-4">
                <div className="font-bold text-primary">${purchase.total_price}</div>
                <div className="text-xs text-text-muted">${purchase.unit_price} c/u</div>
              </td>
              <td className="p-4">
                <StatusBadge status={purchase.status} />
              </td>
              <td className="p-4">
                <div className="text-text-main">
                  {new Date(purchase.created_at).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(purchase.created_at).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </td>
              <td className="p-4 text-right">
                {/* ✅ Solo muestra el botón si el estado es 'pendiente' */}
                {purchase.status === 'pendiente' && onMarkAsPickedUp && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onMarkAsPickedUp(purchase)}
                    className="whitespace-nowrap"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Marcar Recogido
                  </Button>
                )}
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
/* ============================================================
   TABLA DE APARTADOS
============================================================ */
const ApartadosTable = ({ 
  apartados,
  onMarkApartadoAsPickedUp 
}: { 
  apartados: Apartado[];
  onMarkApartadoAsPickedUp?: (apartado: Apartado) => void;
}) => (
  <Card className="overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-text-main">
          <tr>
            <th className="p-4 text-left">Producto</th>
            <th className="p-4 text-left">Cliente</th>
            <th className="p-4 text-left">Cant.</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Pagado</th>
            <th className="p-4 text-left">Pendiente</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-left">Fecha</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {apartados.map((apartado) => {
            const porcentajePagado = parseFloat(apartado.porcentaje_pagado);
            const isPaid = porcentajePagado >= 100;
            
            return (
              <tr key={apartado.id} className="border-t hover:bg-secondary-light transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <ProductAvatar 
                      name={apartado.product.name} 
                      imageUrl={apartado.product.imageUrl} 
                    />
                    <div>
                      <div className="font-semibold text-text-main">{apartado.product.name}</div>
                      <p className="text-xs text-text-muted">ID: {apartado.product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <UserBadge name={apartado.user.name} email={apartado.user.email} />
                </td>
                <td className="p-4">
                  <span className="font-medium text-text-main">{apartado.quantity}</span>
                </td>
                <td className="p-4">
                  <div className="font-bold text-text-main">${apartado.total_price}</div>
                  <div className="text-xs text-text-muted">${apartado.unit_price} c/u</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-green-600">${apartado.monto_pagado}</div>
                  <div className="text-xs text-text-muted">{apartado.porcentaje_pagado}%</div>
                </td>
                <td className="p-4">
                  <div className={`font-semibold ${isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                    ${apartado.saldo_pendiente}
                  </div>
                  {!isPaid && (
                    <div className="text-xs text-text-muted">
                      Falta {(100 - porcentajePagado).toFixed(0)}%
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <StatusBadge status={apartado.status} />
                </td>
                <td className="p-4">
                  <div className="text-text-main">
                    {new Date(apartado.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-xs text-text-muted">
                    {new Date(apartado.created_at).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="p-4 text-right">
                  {/* ✅ Solo muestra el botón si está liquidado */}
                  {apartado.status === 'liquidado' && onMarkApartadoAsPickedUp && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => onMarkApartadoAsPickedUp(apartado)}
                      className="whitespace-nowrap"
                    >
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      Marcar Recogido
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Card>
);




/* ============================================================
   TABLA DE COMPRAS FISICAs
============================================================ */
// ✅ BIEN - Reemplazar toda la tabla desde línea 517:
const ComprasFisicasTable = ({ 
  comprasfisicas,
  onMarkComprasFisicasPickedUp 
}: { 
  comprasfisicas: Comprasfisicas[];
  onMarkComprasFisicasPickedUp?: (comprafisica: Comprasfisicas) => void;
}) => (
  <Card className="overflow-hidden p-0">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-text-main">
          <tr>
            <th className="p-4 text-left">Producto</th>
            <th className="p-4 text-left">Cliente</th>
            <th className="p-4 text-left">Cant.</th>
            <th className="p-4 text-left">Total</th>
            <th className="p-4 text-left">Estado</th>
            <th className="p-4 text-left">Fecha</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprasfisicas.map((comprafisica) => (
            <tr key={comprafisica.id} className="border-t hover:bg-secondary-light transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <ProductAvatar 
                    name={comprafisica.product.name} 
                    imageUrl={comprafisica.product.imageUrl} 
                  />
                  <div>
                    <div className="font-semibold text-text-main">{comprafisica.product.name}</div>
                    <p className="text-xs text-text-muted">ID: {comprafisica.product.id}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <UserBadge name={comprafisica.user.name} email={comprafisica.user.email} />
              </td>
              <td className="p-4">
                <span className="font-medium text-text-main">{comprafisica.quantity}</span>
              </td>
              <td className="p-4">
                <div className="font-bold text-text-main">${comprafisica.total_price}</div>
                <div className="text-xs text-text-muted">${comprafisica.unit_price} c/u</div>
              </td>
              <td className="p-4">
                <StatusBadge status={comprafisica.status} />
              </td>
              <td className="p-4">
                <div className="text-text-main">
                  {new Date(comprafisica.created_at).toLocaleDateString('es-MX', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-xs text-text-muted">
                  {new Date(comprafisica.created_at).toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </td>
              <td className="p-4 text-right">
                {comprafisica.status === 'pendiente' && onMarkComprasFisicasPickedUp && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onMarkComprasFisicasPickedUp(comprafisica)}
                    className="whitespace-nowrap"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    Marcar Recogido
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
const ProductTable = ({ products, purchases, apartados, comprasfisicas, viewMode, onProductUpdated, onMarkAsPickedUp, onMarkApartadoAsPickedUp, onMarkComprasFisicasPickedUp }: ProductTableProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: '',
    details: '',
  });
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    state: 'confirm' as 'confirm' | 'success',
    title: '',
    message: '',
    type: 'confirm' as 'confirm' | 'success' | 'error' | 'loading',
    onConfirm: () => {},
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    state: 'confirm' as 'confirm' | 'success',
    productToDelete: null as Product | null,
  });

  useEffect(() => {
    getProductCategories().then(setCategories).catch(console.error);
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };
  const handleSaveEdit = (productId: number, updateData: UpdateData) => {
    // Cerrar modal de edición primero
    setIsEditModalOpen(false);
    
    // Mostrar modal de confirmación
    setConfirmModal({
      isOpen: true,
      state: 'confirm',
      title: '¿Guardar cambios?',
      message: '¿Estás seguro de que deseas actualizar este producto?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          // Mostrar loading
          setConfirmModal({
            isOpen: true,
            state: 'confirm',
            title: 'Guardando...',
            message: 'Por favor espera mientras se actualizan los cambios.',
            type: 'loading',
            onConfirm: () => {},
          });

          await updateProduct(productId, updateData);

          // Mostrar éxito
          setConfirmModal({
            isOpen: true,
            state: 'success',
            title: '¡Producto actualizado!',
            message: 'Los cambios se han guardado correctamente.',
            type: 'success',
            onConfirm: () => {
              setConfirmModal({ ...confirmModal, isOpen: false });
            },
          });

          // Recargar datos y cerrar después de 1.5s
          setTimeout(() => {
            setConfirmModal({ ...confirmModal, isOpen: false });
            if (onProductUpdated) {
              onProductUpdated();
            }
          }, 1500);
        } catch (error: any) {
          const errorMessage = error.message || 'No se pudo actualizar el producto';
          const errorParts = errorMessage.split('\n\nDetalles: ');
          const mainMessage = errorParts[0];
          const details = errorParts[1] || '';

          setConfirmModal({ ...confirmModal, isOpen: false });

          setErrorModal({
            isOpen: true,
            message: mainMessage,
            details: details,
          });
        }
      },
    });
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      state: 'confirm',
      productToDelete: product,
    });
  };


  const handleConfirmDelete = async () => {
    if (!deleteModal.productToDelete) return;

    try {
      // ✅ Cerrar el modal de eliminación PRIMERO
      setDeleteModal({ isOpen: false, state: 'confirm', productToDelete: null });

      // Luego mostrar loading
      setConfirmModal({
        isOpen: true,
        state: 'confirm',
        title: 'Eliminando...',
        message: 'Por favor espera mientras se elimina el producto.',
        type: 'loading',
        onConfirm: () => {},
      });

      await deleteProduct(deleteModal.productToDelete.id as number);

      setConfirmModal({
        isOpen: true,
        state: 'success',
        title: '¡Producto eliminado!',
        message: 'El producto se ha eliminado correctamente.',
        type: 'success',
        onConfirm: () => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          if (onProductUpdated) {
            onProductUpdated();
          }
        },
      });

      setTimeout(() => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        if (onProductUpdated) {
          onProductUpdated();
        }
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.message || 'No se pudo eliminar el producto';
      const errorParts = errorMessage.split('\n\nDetalles: ');
      
      setConfirmModal({ ...confirmModal, isOpen: false });
      
      setErrorModal({
        isOpen: true,
        message: errorParts[0],
        details: errorParts[1] || '',
      });
    }
  };
  switch (viewMode) {
    case 'products':
      return (
        <>
          {products ? (
            <ProductsTable 
              products={products} 
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ) : null}
          
          <EditModal
            isOpen={isEditModalOpen}
            product={selectedProduct}
            categories={categories}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
          />

          <ErrorModal
            isOpen={errorModal.isOpen}
            errorMessage={errorModal.message}
            errorDetails={errorModal.details}
            onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
          />
           {/* ✅ MODAL DE ELIMINACIÓN */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          state="confirm"
          title="¿Eliminar producto?"
          message={`¿Estás seguro de que deseas eliminar "${deleteModal.productToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="confirm"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          state={confirmModal.state}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => {
            setConfirmModal({ ...confirmModal, isOpen: false });
            if (confirmModal.type === 'confirm' && confirmModal.title === '¿Guardar cambios?') {
              setIsEditModalOpen(true);
            }
          }}
        />
        </>
      );
    case 'purchases':
    return purchases ? (
      <PurchasesTable 
        purchases={purchases} 
        onMarkAsPickedUp={onMarkAsPickedUp} 
      />
    ) : null;
 case 'apartados':
  return apartados ? (
    <ApartadosTable 
      apartados={apartados}
      onMarkApartadoAsPickedUp={onMarkApartadoAsPickedUp}
    />
  ) : null;
  case 'comprasfisicas':
  return comprasfisicas ? (
    <ComprasFisicasTable 
      comprasfisicas={comprasfisicas}
      onMarkComprasFisicasPickedUp={onMarkComprasFisicasPickedUp}
    />
  ) : null;
  default:
    return null;
}
};

export default ProductTable;