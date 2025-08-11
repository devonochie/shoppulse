/* eslint-disable no-empty */
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Product } from "@/types/product.type";
import { useAppDispatch } from "@/hooks/useRedux";
import { createProduct, deleteProductThunk, updateProductThunk } from "@/store/slices/productSlice";



const emptyForm: Omit<Product, "id"> = {
    title: "",
    description: "",
    price: 0,
    originalPrice: 0,
    images: [],
    category: "",
    subcategory: "",
    sizes: [],
    colors: [],
    stock: 0,
    rating: 0,
    reviewCount: 0,
    featured: false,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const AdminPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Omit<Product, "id">>({ ...emptyForm });
    const location = useLocation();
    const dispatch = useAppDispatch()

  // Basic SEO for this page
    useEffect(() => {
        document.title = "Admin Panel – Product Management";
        const metaDesc =
        document.querySelector('meta[name="description"]') ||
        document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute(
        "content",
        "Manage products: create, edit, and organize your catalog efficiently."
        );
        document.head.appendChild(metaDesc);

        const canonical =
        document.querySelector('link[rel="canonical"]') ||
        document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", window.location.origin + location.pathname);
        document.head.appendChild(canonical);
    }, [location.pathname]);

    const handleStr = (name: keyof Omit<Product, "id">) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [name]: e.target.value } as typeof f));

    const handleNum = (name: keyof Omit<Product, "id">) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [name]: Number(e.target.value || 0) } as typeof f));

    const handleBool = (name: keyof Omit<Product, "id">) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [name]: e.target.checked } as typeof f));

    const handleCSV = (name: keyof Omit<Product, "id">) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const arr = e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        setForm((f) => ({ ...f, [name]: arr } as typeof f));
        };

    // Add local images using object URLs for preview
    const addLocalImages = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const newUrls = Array.from(fileList).map((file) => URL.createObjectURL(file));
        setForm((f) => ({ ...f, images: [...f.images, ...newUrls] }));
        toast({ title: "Images added", description: `${newUrls.length} image(s) attached.` });
    };

    const removeImageAt = (index: number) => {
        setForm((f) => {
        const next = [...f.images];
        const [removed] = next.splice(index, 1);
        if (removed && removed.startsWith("blob:")) {
            try { URL.revokeObjectURL(removed); } catch {}
        }
        return { ...f, images: next };
        });
    };

    const addProduct = () => {
        const newProduct: Product = {
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        };
        dispatch(createProduct([newProduct]));
        setProducts((p) => [newProduct, ...p]);
        setForm({ ...emptyForm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        toast({ title: "Product added", description: `“${newProduct.title || "Untitled"}” was created.` });
    };

    const deleteProduct = (id: number) => {
        setProducts((p) => p.filter((item) => Number(item.id) !== id));
        dispatch(deleteProductThunk(id.toString()));
        setForm({ ...emptyForm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        toast({ title: "Product deleted", description: `Item #${id} removed.` });
    };

    const updateProduct = <K extends keyof Product,>(id: number, key: K, value: Product[K]) => {
        if (key === "images" && Array.isArray(value)) {
            setForm((f) => ({ ...f, images: value as string[] }));
            return;
        }
        if (key === "sizes" || key === "colors" || key === "tags") {
            setForm((f) => ({ ...f, [key]: (value as string).split(",").map(s => s.trim()) }));
            return;
        }
        dispatch(updateProductThunk({ id: id.toString(), data: { [key]: value } }));
        setProducts((list) =>
        list.map((p) =>
            p.id === id.toString() ? { ...p, [key]: value, updatedAt: new Date().toISOString() } : p
        )
        );
    };

    const formCSV = useMemo(
        () => ({
        images: form.images.join(", "),
        sizes: form.sizes.join(", "),
        colors: form.colors.join(", "),
        tags: form.tags.join(", "),
        }),
        [form]
    );

    return (
        <div className="min-h-screen">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
            <div className="container mx-auto flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <Button asChild variant="outline">
                <a href="/">Back to Home</a>
            </Button>
            </div>
        </header>

        <main className="container mx-auto px-4 py-10 space-y-10">
            <section aria-labelledby="add-product">
            <Card className="animate-enter">
                <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                    <CardTitle
                    id="add-product"
                    className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in"
                    >
                    Add Product
                    </CardTitle>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <p className="text-sm text-muted-foreground animate-fade-in">
                    Create stunning listings with images, variants and tags in seconds.
                </p>
                </CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={form.title} onChange={handleStr("title")} placeholder="Product title" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={form.description} onChange={handleStr("description")} placeholder="Describe the product" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" inputMode="decimal" value={form.price} onChange={handleNum("price")} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original price</Label>
                    <Input id="originalPrice" type="number" inputMode="decimal" value={form.originalPrice} onChange={handleNum("originalPrice")} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={form.category} onChange={handleStr("category")} placeholder="e.g. Clothing" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input id="subcategory" value={form.subcategory} onChange={handleStr("subcategory")} placeholder="e.g. T-Shirts" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" inputMode="numeric" value={form.stock} onChange={handleNum("stock")} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input id="rating" type="number" inputMode="decimal" value={form.rating} onChange={handleNum("rating")} placeholder="0-5" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="reviewCount">Review count</Label>
                    <Input id="reviewCount" type="number" inputMode="numeric" value={form.reviewCount} onChange={handleNum("reviewCount")} placeholder="0" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="images">Images (comma-separated URLs)</Label>
                    <Input id="images" value={formCSV.images} onChange={handleCSV("images")} placeholder="https://... , https://..." />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="localImages">Upload images from device</Label>
                    <Input
                        id="localImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => addLocalImages(e.target.files)}
                    />

                    {form.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {form.images.map((src, idx) => (
                            <div key={idx} className="relative hover-scale">
                            <img
                                src={src}
                                alt={`Product image preview ${idx + 1}`}
                                className="aspect-square w-full rounded-md border object-cover"
                                loading="lazy"
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <span className="truncate text-xs text-muted-foreground" title={src}>
                                {src.startsWith('blob:') ? 'Local image' : src}
                                </span>
                                <Button type="button" size="sm" variant="outline" onClick={() => removeImageAt(idx)}>
                                Remove
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                    <Input id="sizes" value={formCSV.sizes} onChange={handleCSV("sizes")} placeholder="S, M, L" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="colors">Colors (comma-separated)</Label>
                    <Input id="colors" value={formCSV.colors} onChange={handleCSV("colors")} placeholder="Black, Navy" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" value={formCSV.tags} onChange={handleCSV("tags")} placeholder="eco, bestseller" />
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2">
                    <input id="featured" type="checkbox" className="h-4 w-4" checked={form.featured} onChange={handleBool("featured")} />
                    <Label htmlFor="featured">Featured</Label>
                    </div>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button onClick={addProduct} variant="default" className="hover-scale">Add product</Button>
                    <Button variant="secondary" className="hover-scale" onClick={() => setForm({ ...emptyForm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })}>Reset</Button>
                </div>
                </CardContent>
            </Card>
            </section>

            <section aria-labelledby="product-list" className="space-y-4">
            <div className="flex items-baseline justify-between">
                <h2 id="product-list" className="text-2xl font-semibold">Product list</h2>
                <p className="text-sm text-muted-foreground">{products.length} items</p>
            </div>

            <Card className="animate-fade-in">
                <CardContent className="pt-6">
                <Table>
                    <TableCaption>Manage your inventory below.</TableCaption>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[120px]">Category</TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead className="w-[120px]">Stock</TableHead>
                        <TableHead className="w-[140px]">Featured</TableHead>
                        <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id} className="animate-fade-in">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="w-10 h-10 rounded-md object-cover"
                                />
                                <div>
                                    <p className="font-medium">{product.title}</p>
                                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Input
                            value={product.category}
                            onChange={(e) => updateProduct(Number(product.id), "category", e.target.value as string)}
                            aria-label={`Title for product ${product.id}`}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                            value={product.title}
                            onChange={(e) => updateProduct(Number(product.id), "title", e.target.value as string)}
                            aria-label={`Title for product ${product.id}`}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                            type="number"
                            inputMode="decimal"
                            value={product.price}
                            onChange={(e) => updateProduct(Number(product.id), "price", Number(e.target.value || 0))}
                            aria-label={`Price for product ${product.id}`}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                            type="number"
                            inputMode="numeric"
                            value={product.stock}
                            onChange={(e) => updateProduct(Number(product.id), "stock", Number(e.target.value || 0))}
                            aria-label={`Stock for product ${product.id}`}
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                            type="number"
                            inputMode="numeric"
                            value={product.stock}
                            onChange={(e) => updateProduct(Number(product.id), "stock", Number(e.target.value || 0))}
                            aria-label={`Stock for product ${product.id}`}
                            />
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                            <Button variant="outline" className="hover-scale" onClick={() => toast({ title: "Saved", description: "Changes stored locally." })}>Save</Button>
                            <Button variant="destructive" className="hover-scale" onClick={() => deleteProduct(Number(product.id))}>Delete</Button>
                            </div>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </section>
        </main>
        </div>
    );
};

export default AdminPage;