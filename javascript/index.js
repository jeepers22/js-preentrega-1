// ARRAYS DE OBJETOS (Globales)
let usuarios = []

let productos = []

/* ================ CLASE USUARIOS ================ */
class Usuario {

    // ATRIBUTOS
    constructor(user, password, admin) {
        this.user = user
        this.password = password
        this.admin = admin // true=admin false=cliente
    }

    // MÉTODOS
    esAdmin = () => usuarios.find((usuario) => usuario.user === this.user).admin

    concretarAltaUsuario = () => {
        usuarios.push(this)
    }
}


/* ================ CLASE PRODUCTO ================ */
class Producto {

    // ATRIBUTOS
    constructor(tipoProd, marca, precio, stock) {
        this.tipoProd = tipoProd
        this.marca = marca
        this.precio = precio
        this.stock = stock
    }

    // MÉTODOS

    comprar = (cant) => {
        if (this.validarStock(cant)) {
            this.disminuirStock(cant)
            alert("Compra efectuada con éxito\nMuchas gracias!")
            console.log(`Stock actualizado - Quedan ${this.stock} unidades del producto ${this.tipoProd} ${this.marca}`)
        }
        else {
            alert(`Stock insuficiente - Hay ${this.stock} unidades de ${this.tipoProd} ${this.marca}`)
        }
    }

    validarStock = (cant) => this.stock >= cant

    disminuirStock = (cant) => {
        this.stock = this.stock - cant
    }

    concretarAltaProducto = () => {
        productos.push(this)
    }
}


/* ================ DECLARACIÓN FUNCIONES ================ */
validarLogin = (userLogin, passLogin) => usuarios.some((usuario) => (usuario.user === userLogin && usuario.password === passLogin))

usuarioExistente = (userAlta) => usuarios.some((usuario) => usuario.user === userAlta)

productoExistente = (tipoProdAlta, marcaAlta) => productos.some((producto) => producto.tipoProd === tipoProdAlta && producto.marca === marcaAlta)

function obtenerUsuarioPorTeclado() {
    let usuario = prompt ("Ingrese su usuario: \n")
    let password = prompt ("Ingrese contraseña: \n")
    return new Usuario(usuario, password, false)
}

function obtenerProductoPorTeclado() {
    let tipoProd = prompt("Ingrese tipo de producto: ")
    let marca = prompt("Ingrese marca del producto: ")
    let precio = parseFloat(prompt("Ingrese precio del producto: "))
    let cant = parseInt(prompt("Ingrese cantidad de unidades del producto: "))
    return new Producto(tipoProd, marca, precio, cant)
}

function mostrarObjetoEnTexto(objeto) {
    console.log("Producto\n---------")
    for (clave in objeto) {
        if (typeof objeto[clave] != "function") {
            console.log(`${clave}:${objeto[clave]}`)
        }
    }
}

menuPrincipal = () => parseInt(prompt("Ingrese la opción deseada: \n\n1.  Login\n2.  Registrarme\n3.  Salir\n"))

menuAdmin = (userLogin) => parseInt(prompt(`Bienvenido, ${userLogin} ingrese la opción deseada: \n\n1.  Alta Producto\n2.  Modificar Producto\n3.  Eliminar Producto\n4.  Salir\n`))

menuCompra = (userLogin) => parseInt(prompt(`Bienvenido ${userLogin}, escoja el producto que desea comprar: \n\n` + mostrarCatalogoProductos()))

menuUpdate = () => parseInt(prompt(`Indique el campo que desea modificar: \n\n` + mostrarAtributosProd()))

function showMenu(menu, userLogin) {
    switch (menu) {
        case "menuPrincipal":
            return menuPrincipal()
            break
        case "menuAdmin":
            return menuAdmin(userLogin)
            break
        case "menuUpdate":
            return menuUpdate()
            break
        case "menuCompra":
            return menuCompra(userLogin)
            break
        default:
            alert("Error - No se ha podido carga el menú solicitado")
    }
}

function mostrarCatalogoProductos() {
    let option = 1
    let textoCatalogo = ""
    productos.forEach((prod) => {textoCatalogo += `${option}.  ${prod.tipoProd}, ${prod.marca}, $${prod.precio}, ${prod.stock} unidades\n`; option++})
    textoCatalogo += `${option}.  salir\n`
    return textoCatalogo
}

function desplegarProcedimientoAdmin(userLogin) {
    let repeatAdmin = false
    let eleccionMenuProductos = 0
    let eleccionMenuCompra = 0

    while (true) {
        switch(showMenu("menuAdmin", userLogin)) {
            case 1:
                let objectProducto = obtenerProductoPorTeclado()
                if (!productoExistente(objectProducto.tipoProd, objectProducto.marca)) {
                    objectProducto.concretarAltaProducto()
                    alert("Alta de producto exitosa")
                    repeatAdmin = true
                }
                else {
                    alert("Alta fallida - Producto existente en catálogo")
                    repeatAdmin = true
                }
                break
            case 2:
                break
            case 3:
                break
            case 4:  // SALIR
            repeatAdmin = false
                break
            default:
                alert("Opción incorrecta")
        }
        if (!repeatAdmin) {
            break
        }
    }
}

function desplegarProcedimientoCompra(userLogin) {

    let eleccionMenuCompra = 0
    let eleccionMenuRepeat = 0
    let salirMenuCompra = 0
    let cantDeseadaProd = 0
    let prodElegido = {}

    while (true) { // itera hasta que el usuario salga o deje de comprar productos

        salirMenuCompra = productos.length + 1

        while (true) { // itera hasta que la opción ingresada sea válida
            eleccionMenuCompra = showMenu("menuCompra", userLogin)
            if (eleccionMenuCompra > 0 && eleccionMenuCompra <= salirMenuCompra) {
                break
            }
            alert("Opción incorrecta")
        }

        if (eleccionMenuCompra === salirMenuCompra) {
            break
        }
        else {
            prodElegido = productos[eleccionMenuCompra - 1]

            while (true) { // itera hasta que la opción ingresada sea válida
                cantDeseadaProd = parseInt(prompt(`Especifique la cantidad de unidades de ${prodElegido.tipoProd} ${prodElegido.marca} que desea comprar`))
                if (cantDeseadaProd > 0) {
                    break
                }
                alert("Opción incorrecta")
            }

            prodElegido.comprar(cantDeseadaProd)

            while (true) { // itera hasta que la opción ingresada sea válida
                eleccionMenuRepeat = parseInt(prompt("Desea realizar otra compra?\n1.  SI\n2.  NO"))
                if ((eleccionMenuRepeat === 1 || eleccionMenuRepeat === 2)) {
                    break
                }
                alert("Opción incorrecta")
            }

            if (eleccionMenuRepeat === 2) {
                break
            }
        }
    }
}

/* ================ DECLARACIÓN FUNCIÓN PRINCIPAL ================ */
function main() {

    let objectUser = {}

    // CARGA DE CATÁLOGO
    productos.push(new Producto("lapicera", "bic", 50, 10))
    productos.push(new Producto("lapicera", "pelikan", 70, 5))
    productos.push(new Producto("goma de borrar", "pelikan", 15, 15))
    productos.push(new Producto("sacapuntas", "maped", 25, 4))

    // GENERACIÓN DE USUARIOS
    usuarios.push(new Usuario("admin", "1234", true))
    usuarios.push(new Usuario("maxi", "maxizero", false))

    while(true) {
        let repeat = false
        switch (menuPrincipal()) {
            case 1:  // LOGIN
                objectUser = obtenerUsuarioPorTeclado()
                if (validarLogin(objectUser.user, objectUser.password)) {
                    if (!objectUser.esAdmin()) {
                        // MENÚ COMPRA PRODUCTOS PARA CLIENTES
                        desplegarProcedimientoCompra(objectUser.user)
                    }
                    else {
                        // MENÚ ADMINS
                        desplegarProcedimientoAdmin(objectUser.user)
                    }
                }
                else {
                    alert("Login fallido - Usuario o contraseña incorrectos")
                    repeat = true
                }
                break
            case 2:  // REGISTRO
                objectUser = obtenerUsuarioPorTeclado()
                if (!usuarioExistente(objectUser.user)) {
                    objectUser.concretarAltaUsuario()
                    alert("Usuario registrado con éxito")
                    repeat = true
                }
                else {
                    alert("Alta fallida - Usuario registrado previamente")
                    repeat = true
                }
                break
            case 3:  // SALIR
                repeat = false
                break
            default:
                alert("Opción incorrecta")
                repeat = true
        }
        if (!repeat) {
            break
        }
    }
    alert("Muchas gracias por visitarnos, hasta luego!")
}

/* ================ LLAMADO FUNCIÓN PRINCIPAL ================ */
main()