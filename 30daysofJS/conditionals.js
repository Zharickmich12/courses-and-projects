/* Condicionales
Las declaraciones condicionales se utilizan para tomar decisiones basadas en diferentes condiciones. De forma predeterminada, las declaraciones en el script de JavaScript se ejecutan secuencialmente de arriba a abajo. Si la lógica de procesamiento lo requiere, el flujo secuencial de ejecución se puede alterar de dos formas:

Ejecución condicional: se ejecutará un bloque de una o más sentencias si cierta expresión es true
Ejecución repetitiva: un bloque de una o más sentencias se ejecutará de forma repetitiva siempre que cierta expresión sea verdadera. En esta sección, cubriremos las declaraciones if, else y else if. Los operadores lógicos y de comparación que aprendimos en las secciones anteriores serán útiles aquí.
Las condiciones se pueden implementar de las siguientes maneras:
    -if
    -if else
    -if else if else
    -switch
    -operador ternario
*/

/* If
En JavaScript y otros lenguajes de programación, la palabra clave if se usa para verificar si una condición es true y ejecutar el bloque de código. Para crear una condición if, necesitamos la palabra clave if, la condición va dentro de paréntesis y el bloque de código va dentro de llaves ({}).
*/

// sintaxis
if (condition) {
  //esta parte del código se ejecuta cuando es true
}

// Example:
let num1 = 3;
if (num1 > 0) {
  console.log(`${num1} es un número positivo`);
}
//  3 es un número positivo

/* Como puede ver en el ejemplo de condición anterior, 3 es mayor que 0, por lo que es un número positivo. La condición era true y se ejecutó el bloque de código. Sin embargo, si la condición es falsa, no veremos ningún resultado.
*/
let isRaining1 = true;
if (isRaining1) {
  console.log("Recuerda llevar tu impermeable.");
}

/* Lo mismo ocurre con la segunda condición, si isRaining es false, el bloque if no se ejecutará y no veremos ninguna respuesta. Para ver el resultado de una condición false, debemos tener otro bloque, que será else.
*/

/* If Else
Si la condición es true, se ejecutará el primer bloque, si no, se ejecutará la condición else.
*/

// sintaxis
if (condition) {
  // esta parte del código se ejecuta para la condición de verdad
} else {
  // esta parte del código se ejecuta para una condición falsa
}
let num = 3;
if (num > 0) {
  console.log(`${num} es un número positivo`);
} else {
  console.log(`${num} es un número negativo`);
}
//  3 es un número positivo
num = -3;
if (num > 0) {
  console.log(`${num} es un número positivo`);
} else {
  console.log(`${num} es un número negativo`);
}
//  -3 es un número negativo
let isRaining = true;
if (isRaining) {
  console.log("Necesitas un impermeable.");
} else {
  console.log("No hay necesidad de un impermeable.");
}
// Necesitas un impermeable.
isRaining = false;
if (isRaining) {
  console.log("Necesitas un impermeable.");
} else {
  console.log("No hay necesidad de un impermeable.");
}
// No hay necesidad de un impermeable.
// La última condición es falsa, por lo que se ejecutó el bloque else. ¿Qué pasa si tenemos más de dos condiciones? En ese caso, usaremos las condiciones else if.

/* If Else if Else
Usamos else if cuando tenemos múltiples condiciones.
*/

// sintaxis
if (condition) {
  // código
} else if (condition) {
  // código
} else {
  //  código
}

// Ejemplo:
let a = 0;
if (a > 0) {
  console.log(`${a} es un número positivo`);
} else if (a < 0) {
  console.log(`${a} es un número negativo`);
} else if (a == 0) {
  console.log(`${a} es cero`);
} else {
  console.log(`${a} no es un número`);
}
// if else if else
let weather3 = "sunny";
if (weather3 === "rainy") {
  console.log("Necesitas un impermeable.");
} else if (weather3 === "cloudy") {
  console.log("Puede que haga frío, necesitas una chaqueta.");
} else if (weather3 === "sunny") {
  console.log("Sal tranquilo.");
} else {
  console.log("No hay necesidad de un impermeable.");
}

/* Switch
Switch es una alternativa para if else if else else. La instrucción switch comienza con una palabra clave switch seguida de un paréntesis y un bloque de código. Dentro del bloque de código tendremos diferentes casos. El bloque de casos se ejecuta si el valor en el paréntesis de la declaración de cambio coincide con el valor del caso. La declaración de break es para terminar la ejecución. Esto para que la ejecución del código se detenga después de que se cumpla la condición. El bloque default se ejecuta si todos los casos no cumplen la condición.
*/
switch (caseValue) {
  case 1:
    // código
    break;
  case 2:
    // código
    break;
  case 3:
    // código
    break;
  default:
  // código
}
let weather = "cloudy";
switch (weather) {
  case "rainy":
    console.log("Necesitas un impermeable.");
    break;
  case "cloudy":
    console.log("Puede que haga frío, necesitas una chaqueta.");
    break;
  case "sunny":
    console.log("Sal tranquilo.");
    break;
  default:
    console.log("No hay necesidad de un impermeable.");
}
// Más Ejemplos switch
let dayUserInput = prompt("¿Qué día es hoy?");
let day = dayUserInput.toLowerCase();

switch (day) {
  case "lunes":
    console.log("Hoy es Lunes");
    break;
  case "martes":
    console.log("Hoy es Martes");
    break;
  case "miércoles":
    console.log("Hoy es Miércoles");
    break;
  case "jueves":
    console.log("Hoy es Jueves");
    break;
  case "viernes":
    console.log("Hoy es Viernes");
    break;
  case "sábado":
    console.log("Hoy es Sábado");
    break;
  case "domingo":
    console.log("Hoy es Domingo");
    break;
  default:
    console.log("No es un día de semana.");
}

// Ejemplos de condiciones en los casos
let num2 = prompt("Ingrese un número");
switch (true) {
  case num2 > 0:
    console.log("El número es positivo");
    break;
  case num2 == 0:
    console.log("El número es cero");
    break;
  case num2 < 0:
    console.log("El número es negativo");
    break;
  default:
    console.log("El valor ingresado no era un número");
}

/* Operadores Ternarios
Otra forma de escribir condicionales es usando operadores ternarios.
*/

let isRaining2 = true;
isRaining2
  ? console.log("Necesitas un impermeable.")
  : console.log("No hay necesidad de un impermeable.");