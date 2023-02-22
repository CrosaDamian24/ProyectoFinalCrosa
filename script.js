//postresnombre
class Postres {
  constructor(id, nombre, precio, descripcion, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }
  sumaIva(precio) {
    return (precio = precio * 1.21);
  }
}
const postreInd = [
  new Postres(
    1,
    "Oreo",
    800,
    "Una capa de Oreo, dulce de leche y crema chantillí.",
    "./img/oreo.png"
  ),
  new Postres(
    2,
    "Chocolina",
    750,
    "Una capa de Chocolinas, dulce de leche y crema chantillí.",
    "./img/chocotorta.png"
  ),
  new Postres(
    3,
    "Gula",
    850,
    "Una capa de Chocolinas y Oreo, dulce de leche y crema chantillí.",
    "./img/gula.png"
  ),
  new Postres(
    4,
    "Cheesecake",
    750,
    "Capa de Vanillas recubiertas de queso crema y futos rojos",
    "./img/cheesecake.png"
  ),
];

const div = document.getElementById("div");
const iconoCarro = document.getElementById("carrito");
iconoCarro.disabled = true;


const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let sumaTotalCarro = 0;
let conEnvio = 0;
let conDesEfectivo = 0;
const comprar = document.getElementById("comprar");
comprar.disabled = true;

fetch("./data.json")
  .then((res) => res.json())
  .then(async (data) => {
    await accionAsincrona();
    data.forEach((postre) => {
      let postreRenderizado = document.createElement("div");
      postreRenderizado.className = "col-xl-3";

      postreRenderizado.innerHTML = `
          <div  class="card card__sombra"  >
          <div class="card-body fuente">
          
          <strong> <h5 class="card-title text-center ">Postre ${postre.nombre}</h5></strong>
            <img src=${postre.img} alt="" class="img-fluid">
            <p class="card-text">${postre.descripcion}</p>
                <span>Precio: <strong>$ ${
                  postre.precio
                }</strong> (Sin IVA)</span>
                <br>
                <span>Cantidad:</span>
                <strong>
                <output id= ${
                  postre.nombre
                } type="number" readonly ></output></strong>
                <br>

            <button class="btn btn__agrego" id = ${postre.id}>+</button>
            <button class="btn  btn-danger btn__quito" disabled id = ${
              postre.nombre + postre.id
            }>-</button>
        </div>
    </div>
    </div>
    `;
      document.getElementById("spinner").style.display = "none";
      div.append(postreRenderizado);
    });
    postreInd.forEach((postre) => {
      const boton = document.getElementById(postre.id);
      boton.addEventListener("click", () => añadePostre(postre));

      const restaProducto = document.getElementById(postre.nombre + postre.id);
      restaProducto.addEventListener("click", () =>
        quitaPostre(postre.nombre, postre.sumaIva(postre.precio))
      );
    });
    actualizaTotalCarrito();
  })
  .catch((err) => console.log(err));

const accionAsincrona = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });
};

// postreInd.forEach((postre) => {

//   let postreRenderizado = document.createElement("div");
//   postreRenderizado.className = "col-xl-3";

//   postreRenderizado.innerHTML = `
//     <div  class="card"  >
//           <div id= ${postre.nombre} class="card-body">
//             <h5 class="card-title">Postre ${postre.nombre}</h5>
//             <p class="card-text">${postre.descripcion}</p>
//                 <span>Precio: $ ${postre.precio}</span>
//                 <br>
//                 <p>Cantidad</p>

//             <button class="btn btn-primary" id = ${postre.id}>+</button>
//             <button class="btn btn-danger" disabled id = ${
//               postre.nombre + postre.id
//             }>-</button>
//         </div>
//     </div>
//     </div>
//     `;
//   div.append(postreRenderizado);

//   const boton = document.getElementById(postre.id);
//   boton.addEventListener("click", () => añadePostre(postre));

//   const restaProducto = document.getElementById(postre.nombre + postre.id);
//   restaProducto.addEventListener("click", () =>
//     quitaPostre(postre.nombre, postre.sumaIva(postre.precio))
//   );
// });

// actualizaTotalCarrito()

// AGREGO POSTRE AL CARRITO
const añadePostre = (postre) => {
  let productoExiste = carrito.find((item) => item.id === postre.id);

  const resta = document.getElementById(postre.nombre + postre.id);

  resta.disabled = false;

  if (productoExiste === undefined) {
    carrito.push({
      id: postre.id,
      nombre: postre.nombre,
      precio: postre.sumaIva(postre.precio),
      cantidad: 1,
      imagen: postre.imagen,
    });
  } else {
    productoExiste.cantidad = productoExiste.cantidad + 1;
    productoExiste.precio =
      productoExiste.precio + postre.sumaIva(postre.precio);
  }
  iconoCarro.disabled = false;
  subirCarritoLocal();
  actualizaTotalCarrito();

  Toastify({
    text: "Añadido al carrito",
    style: {
      background: "#540e51",
    },
    duration: 3000,
  }).showToast();
};

// QUITO POSTRE DEL CARRITO
const quitaPostre = (nombre, precio) => {
  for (const iterator of carrito) {
    if (iterator.nombre === nombre) {
      iterator.cantidad = iterator.cantidad - 1;
      iterator.precio = iterator.precio - precio;

      const cantidad = document.getElementById(nombre);

      cantidad.innerHTML = iterator.cantidad;
      cantidad.style.disabled = true;
      if (iterator.cantidad === 0) {
        cantidad.disabled = false;
      }
      if (iterator.cantidad === 0) {
        const indice = carrito.findIndex((elemento, indice) => {
          if (elemento.nombre === nombre) {
            return true;
          }
        });
        carrito.splice(indice, 1);

        const restaProducto = document.getElementById(nombre + iterator.id);

        restaProducto.disabled = true;
        cantidad.value = "";
        iconoCarro.disabled = true;
      }
    }
    carrito.precio = iterator.precio;
    actualizaTotalCarrito();
  }
  subirCarritoLocal();
  actualizaTotalCarrito();
  Toastify({
    text: "Quitado del carrito",
    style: {
      background: "#ed0c80",
    },
    duration: 3000,
  }).showToast();
};

function actualizaTotalCarrito() {
  let sumaTot = 0;
  let tot = 0;
  comprar.disabled = true;
  for (const cantida of carrito) {
    tot = tot + cantida.cantidad;
    sumaTot = sumaTot + cantida.precio;
    const restaProducto = document.getElementById(cantida.nombre + cantida.id);
    const cantidad = document.getElementById(cantida.nombre);
    cantidad.innerHTML = cantida.cantidad;
    restaProducto.disabled = false;
    comprar.disabled = false;
    iconoCarro.disabled = false;
  }

  sumaTotalCarro = sumaTot;
  document.getElementById("totcarro").value = tot;
  if (tot === 0) {
    carro.disabled = true;
  }
}

// selector de envio
const envio = document.getElementById("envio");
const precioEnvio = document.getElementById("precio");



envio.addEventListener("change", () => {
  if (envio.value === "SI") {
    precioEnvio.value = " $500";
    conEnvio = 1;
  } else {
    precioEnvio.value = "";
    conEnvio = 0;
  }
});

// selector de medio de pago
const medioPago = document.getElementById("medioPago");
const descuentoPago = document.getElementById("descuento");

medioPago.addEventListener("change", () => {
  if (medioPago.value === "EFECTIVO") {
    descuentoPago.value = " 5 % de descuento";
    conDesEfectivo = 1;
  } else {
    descuentoPago.value = "";
    conDesEfectivo = 0;
  }
});

// boton de compra
comprar.addEventListener("click", () =>
  calculosCompraFin(conEnvio, conDesEfectivo, sumaTotalCarro)
);

// funcion de compra
const calculosCompraFin = (conEnvio, conDesEfectivo, sumaTotalCarro) => {
  let precioTotal = 0;
  let mensaje = "";

  precioTotal =
    conDesEfectivo === 1
      ? sumaTotalCarro - sumaTotalCarro * 0.05
      : sumaTotalCarro;

  // if (conDesEfectivo === 1) {
  //   precioTotal = sumaTotalCarro - sumaTotalCarro * 0.05;
  // } else {
  //   precioTotal = sumaTotalCarro;
  // }
  if (precioTotal !== 0) {
    if (conEnvio === 1) {
      precioTotal = precioTotal + 500;
      mensaje =
        "En 1 hora recibirá su pedido\n Total: $" + precioTotal.toFixed(2);
    } else {
      mensaje =
        " Puede pasar a retir su pedido por nuestro local en 30 minutos\n Total: $" +
        precioTotal.toFixed(2);
    }

    comprar.disabled = true;
    iconoCarro.disabled = true;

    swal({
      title: "Compra realizada con éxito!",
      text: mensaje,
      icon: "success",
      button: "OK",
    });

    for (const carro of carrito) {
      const resta = document.getElementById(carro.nombre + carro.id);
      const cantidad = document.getElementById(carro.nombre);
      cantidad.value = "";

      resta.disabled = true;
    }
    carrito.splice(0, carrito.length);
    subirCarritoLocal();
    actualizaTotalCarrito();
  }
};

//boton carrito de compras
const carro = document.getElementById("carrito");
carro.addEventListener("click", muestraCarrito);

function muestraCarrito() {
  let total = 0;
  let padre = document.getElementById("modalcarrito");
  padre.innerHTML = "";

  const carro = JSON.parse(localStorage.getItem("carrito"));

  carro.forEach((carro) => {
    total = carrito.reduce((acc, el) => acc + el.precio, 0);

    const agregaProductos = document.createElement("div");
    agregaProductos.innerHTML = `<div class="row">
                                    <div class="col-1">
                                      <h6> ${carro.cantidad}</h6>
                                    </div>
                                    <div class="col-1">
                                        <h6>X</h6>
                                    </div>
                                    <div class="col-1">
                                        <h6>${carro.nombre}</h6>
                                    </div>
                                    <div class="col-3">
                                        <img src="${carro.imagen}" alt="" class="img-fluid w-25">
                                    </div>
                                    <div class="col-4 text-end">
                                      <strong>$ ${carro.precio.toFixed(2)} </strong>
                                    </div>
                                    <div class=" col-2 text-start">
                                      <button id="eliminar${carro.id}" class="color__papelera border-0">
                                                 🗑️
                                      </button>
                                    </div>
                                  </div>`;
    padre.appendChild(agregaProductos);
    const eliminar = document.getElementById("eliminar" + carro.id);

    eliminar.addEventListener("click", () => quitoProducto(carro.id));
  });

  const quitoProducto = (id) => {
    const indice = carrito.findIndex((elemento) => {
      if (elemento.id === id) {
        const restaProducto = document.getElementById(elemento.nombre + id);
        const cantidad = document.getElementById(elemento.nombre);
        cantidad.value = "";

        restaProducto.disabled = true;
        return true;
      }

    });
    carrito.splice(indice, 1);

    subirCarritoLocal();
    actualizaTotalCarrito();
    muestraCarrito();

  };

  const totalCarro = document.createElement("div");
  totalCarro.className = "row";
  totalCarro.innerHTML =
    total === 0
      ? ` <h5>Sin productos en el carrito </h5>`
      : ` <div class="col-6 text-end">
      <h5>Total</h5>
      </div>
      <div class="col-4 text-danger text-end  ">
      <strong>$ ${total.toFixed(2)}</strong> 
      </div>`;

  padre.appendChild(totalCarro);
}

const subirCarritoLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
