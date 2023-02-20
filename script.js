//postresnombre
class Postres {
  constructor(id, nombre, precio, descripcion) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
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
    "Una capa de Oreo, dulce de leche y crema chantillí."
  ),
  new Postres(
    2,
    "Chocolina",
    750,
    "Una capa de Chocolinas, dulce de leche y crema chantillí."
  ),
  new Postres(
    3,
    "Gula",
    850,
    "Una capa de Chocolinas y Oreo, dulce de leche y crema chantillí."
  ),
  new Postres(
    4,
    "Cheesecake",
    750,
    "Capa de Vanillas recubiertas de queso crema y futos rojos"
  ),
];

const div = document.getElementById("div");
// const carrito = [];
const iconoCarro = document.getElementById("carrito")
iconoCarro.disabled = true

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let sumaTotalCarro = 0;
let conEnvio = 0;
let conDesEfectivo = 0;
const comprar = document.getElementById("comprar");
comprar.disabled = true;

fetch("/data.json")
  .then((res) => res.json())
  .then(async (data) => {
    await accionAsincrona();
    data.forEach((postre) => {
      console.log(data);
      let postreRenderizado = document.createElement("div");
      postreRenderizado.className = "col-xl-3";

      postreRenderizado.innerHTML = `
    <div  class="card"  >
          <div class="card-body">
            <h5 class="card-title">Postre ${postre.nombre}</h5>
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

            <button class="btn btn-primary" id = ${postre.id}>+</button>
            <button class="btn btn-danger" disabled id = ${
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
    }, 1000);
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
    });
  } else {
    productoExiste.cantidad = productoExiste.cantidad + 1;
    productoExiste.precio =
      productoExiste.precio + postre.sumaIva(postre.precio);
  }
  iconoCarro.disabled = false
  subirCarritoLocal();
  actualizaTotalCarrito();

  Toastify({
    text: "Añadido al carrito",

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

        //  restaProducto.remove()
        restaProducto.disabled = true;
        cantidad.value = "";
        iconoCarro.disabled = true
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
      background: "#b00000",
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
    iconoCarro.disabled = false
  }
  
  sumaTotalCarro = sumaTot;
  document.getElementById("totcarro").value = tot;
}

// selector de envio
const envio = document.getElementById("envio");
const precioEnvio = document.getElementById("precio")

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
const descuentoPago = document.getElementById("descuento")

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
    iconoCarro.disabled = true

    swal({
      title: "Compra realizada con éxito!",
      text: mensaje,
      icon: "success",
      button: "OK",
    });

    for (const carro of carrito) {
      const resta = document.getElementById(carro.nombre + carro.id);
      const cantidad = document.getElementById(carro.nombre)
      cantidad.value = ""

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
    console.log(carro.nombre);

    const agregaProductos = document.createElement("div");
    agregaProductos.innerHTML = ` <h4> ${carro.cantidad} x ${carro.nombre} <strong>$${carro.precio}</strong> </h4>`;
    padre.appendChild(agregaProductos);
  });

  const totalCarro = document.createElement("div");
  totalCarro.innerHTML = ` <h3>Total <strong>$ ${total}</strong> </h3>`;
  padre.appendChild(totalCarro);
}

const subirCarritoLocal = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};
