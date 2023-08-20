import ProductManager from "../daos/mongodb/ProductManager.class.js";

const productManager = new ProductManager();

export const consultarProductosController = async (limit, page, sort, filtro, filtroVal) => {
    if (limit || page || sort || filtro || filtroVal) {

        if (isNaN(limit) || isNaN(page) || isNaN(sort)) {
            return "El limite, la pagina y el sort deben ser numeros"
        }
        else{
            
            if (filtro != "" && filtroVal != "") {
                whereOptions = { [filtro]: filtroVal }
                const products = await productManager.consultarProductos(limit, page, sort,whereOptions);
                if (products) {
                    const docs = products.docs
                    return docs
                }
                return "Error al buscar los productos"
              }
              else{
                const products = await productManager.consultarProductos(limit, page, sort)
                if (products) {
                    const docs = products.docs
                    return docs
                }
                return "Error al buscar los productos"
              }
            
           
          
        }
        
    }
    else {
        const products = await productManager.consultarProductos();
        const docs = products.docs
        return docs
    }

}

export const crearProductoController = async (product) => {
    const crearProd = await productManager.crearProducto(product);
    if (!crearProd) {
        return "No se pudo crear un nuevo producto"
    }
    return crearProd

}

export const constultarProductoPorIdController = async (id) => {
    const product = await productManager.consultarCartPorId(id);
    if (product) {
        return product
    }
    return "Producto no encontrado"

}

export const eliminarProductoPorIdController = async (id) => {
    const product = await productManager.consultarCartPorId(id);
    if (product) {
        return product
    }
    return "Error al intentar eliminar el producto"
}

export const actualizarProductoPorIdController = async (id, updatedProduct) => {
    const product = await productManager.updatedProduct(id, updatedProduct);
    if (product) {
        return product
    }
    return "Error al intentar actualizar el producto"
}