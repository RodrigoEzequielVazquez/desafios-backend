export const generateErrorProductInfo = (product) =>{
    return `No completaste uno o mas campos para crear el producto
    *Debes ingresar los siguientes datos:
    title, se recibio: ${product.title} 
    price, se recibio: ${product.price} 
    stock, se recibio: ${product.stock}  
    category, se recibio: ${product.category} 
    description, se recibio: ${product.description} 
    `
}

export const generateErrorActualizarProductInfo = (product) =>{
    return `No completaste ningun campo a actualizar
    *Debes ingresar al menos uno de los siguientes datos:
    title, se recibio: ${product.title} 
    price, se recibio: ${product.price} 
    stock, se recibio: ${product.stock}  
    category, se recibio: ${product.category} 
    description, se recibio: ${product.description} 
    `
}

export const generateErrorId = (id,busqueda) =>{
    if (id.length != 24) {
        return `El id:${id} ingresado no coincide con ningun ${busqueda}, un id valido debe tener exactamente 24 caracteres`
    }
} 