validaEdad();

function validaEdad() {
  let edad = prompt("Bienvenido/a. Ingresa tu edad");

  if (edad < 18) {
    alert("Debes solicitar a un mayor de 18 años que realice la compra");
  } else {
    let opcion = Number(busquedaTipo());

    busquedaIndividuales(opcion);
  }
}

function busquedaTipo() {
  return Number(
    prompt(
      "Seleccione una de las siguientes opciones \n 1- Postres individuales (25% desc. en la segunda unidad comprando cantidades pares) \n 2- Tortas "
    )
  );
}

//Postres individuales
function busquedaIndividuales(opcion) {
  if ((opcion > 0) & (opcion <= 2)) {
    switch (opcion) {
      case 1:
        let opcion = Number(
          prompt(
            "1- Oreo $800 \n2- Chocolina $750\n3- Gula $850\n4- Cheesecake $750"
          )
        );
        cantidades(opcion);
        break;

      case 2:
        alert("Estamos trabajando para pronto ofrecerte estos productos");
        busquedaIndividuales(busquedaTipo());
        break;
    }
  } else {
    alert("Debe Seleccionar una opcion correcta");
    // ValidaEdad();
    busquedaIndividuales(busquedaTipo());
  }
}

function cantidades(tipo) {
  if ((tipo > 0) & (tipo <= 4)) {
    let cantidad = Number(prompt("Ingrese la cantidad"));
    let par = esPar(cantidad);
    let i = 0;
    let preciofin = 0;
    let acum = 0;

    switch (par) {
      case false:
        if (tipo == 1) {
          let preciofinal = total(800, cantidad);
          alert("Su pedido es " + cantidad + " Oreo por $ " + preciofinal);
        } else if (tipo == 2) {
          let preciofinal = total(750, cantidad);
          alert("Su pedido es " + cantidad + " Chocolina por $ " + preciofinal);
        } else if (tipo == 3) {
          let preciofinal = total(850, cantidad);
          alert("Su pedido es " + cantidad + " Gula por $ " + preciofinal);
        } else if (tipo == 4) {
          let preciofinal = total(750, cantidad);
          alert(
            "Su pedido es " + cantidad + " Cheesecake por $ " + preciofinal
          );
        } else {
          ("Ninguna opcion es correcta");
        }
        break;
      case true:
        if (tipo == 1) {
          for (1; i < cantidad; i += 2) {
            acum = acum += 2;
            preciofin = (800 + Number(descuento(800))) * (cantidad / 2);
          }
          alert("Su pedido es " + cantidad + " Oreo por $" + preciofin);
          //
        } else if (tipo == 2) {
          for (1; i < cantidad; i += 2) {
            acum = acum += 2;
            preciofin = (750 + Number(descuento(750))) * (cantidad / 2);
          }
          alert("Su pedido es " + cantidad + " Chocolina por $" + preciofin);
        } else if (tipo == 3) {
          for (1; i < cantidad; i += 2) {
            acum = acum += 2;
            preciofin = (850 + Number(descuento(850))) * (cantidad / 2);
          }
          alert("Su pedido es " + cantidad + " Gula por $" + preciofin);
        } else if (tipo == 4) {
          for (1; i < cantidad; i += 2) {
            acum = acum += 2;
            preciofin = (750 + Number(descuento(750))) * (cantidad / 2);
          }
          alert("Su pedido es " + cantidad + " Cheesecake por $" + preciofin);
        } else {
          ("Ninguna opcion es correcta");
        }
        break;

      default:
        break;
    }
  } else {
    alert("Debe seleccionar una opcion correcta");
    busquedaIndividuales(1);
  }
}

//descuento en la segunda unidad
function descuento(costo) {
  return Number(costo - costo * 0.25);
}

//saber si es par o no el numero de cantidad seleccionado
function esPar(numero) {
  return numero % 2 == 0;
}

//Calculo de precio para cantidades impares
function total(precio, cant) {
  return precio * cant;
}
