import fs from "fs"
import { v4 as uuidV4 } from "uuid"

const path = "src/classes/files/productos.json"

export default class ProductManager {
  consultarProductos = async (limite) => {
    // console.log("existe", fs.existsSync(path));
    if (fs.existsSync(path)) {
      if (limite) {
        const data = await fs.promises.readFile(path, "utf-8");
        const products = JSON.parse(data);
        products.splice(limite);
        return products;

      }
      else {
        const data = await fs.promises.readFile(path, "utf-8");
        const products = JSON.parse(data);
        return products;
      }

    } else {
      return [];
    }
  };

  crearProducto = async (info) => {
    const productos = await this.consultarProductos();
    info.id = uuidV4();
    productos.push(info);
    await fs.promises.writeFile(path, JSON.stringify(productos, null, "\t"));
    return info;
  };

  consultarProductoPorId = async (id) => {
    const productos = await this.consultarProductos();

    const producto = productos.find((producto) => {
      return producto.id == id;
    });

    return producto ? producto : "producto no encontrado";
  };

  eliminarProductoPorId = async (id) => {
    const productos = await this.consultarProductos();

    const producto = productos.filter((producto) => {
      return producto.id !== id;
    });
    await fs.promises.writeFile(path, JSON.stringify(producto, null, "\t"));

    return producto ? producto : "producto a eliminar no encontrado";
  };

  actualizarProductoPorId = async (id, actualizacion) => {
    const productos = await this.consultarProductos();

    const producto = productos.find((producto) => {
      return producto.id == id;
    });

    if (actualizacion.id) {
      return "no se puede actualizar el id del producto"
    }
    else {
      if (producto) {
        const eliminarProductoDesactualizado = productos.filter(productos => productos.id != id);

        actualizacion.id = producto.id

        eliminarProductoDesactualizado.push(actualizacion)

        await fs.promises.writeFile(path, JSON.stringify(eliminarProductoDesactualizado, null, "\t"));

        return 

      }

      else {

        return "no se encontraron productos con ese id"
      }



    }

    return actualizacion;
  }



}