// BOOLEANOS
//  El valor booleano es true (verdadero) o false (falso)
let isLightOn = true;
let isRaining = false;
let truValue = 4 > 3; // true
let falseValue = 4 < 3; // false

/*Valores verdaderos
    -Todos los números (positivos y negativos) son verdaderos excepto cero
    -Todos las string (cadenas) son verdaderos excepto un string vacío ('')
    -El booleano true
  Valores falsos
    -0
    -0n
    -null
    -undefined
    -NaN
    -El booleano false
    -'', "", ``, string vacío
*/

/* Undefined
    - Si declaramos una variable y no le asignamos un valor, el valor será undefined (indefinido). 
    - Si una función no devuelve el valor, será undefined.
*/

let firstName;
console.log(firstName); //no definido, porque aún no está asignado un valor

// Null
let empty = null;
console.log(empty); // -> null (nulo) , significa que no tiene valor

// OPERADORES

/* Operadores de Asignación
    Un signo igual en JavaScript es un operador de asignación. Se utiliza para asignar una variable.
*/

let Name = "Asabeneh";
let country = "Finland";

/* Operadores Aritméticos
    Los operadores aritméticos son operadores matemáticos.
    - Suma(+): a + b
    - Resta(-): a - b
    - Multiplicación(*): a * b
    - División(/): a / b
    - Módulo(%): a % b
    - Exponencial(**): a ** b
*/

let numOne = 4;
let numTwo = 3;
let sum = numOne + numTwo;
let diff = numOne - numTwo;
let mult = numOne * numTwo;
let div = numOne / numTwo;
let remainder = numOne % numTwo;
let powerOf = numOne ** numTwo;
console.log(sum, diff, mult, div, remainder, powerOf); // 7,1,12,1.33,1, 64

const PI = 3.14;
let radius = 100; // longitud en metros
//Calculemos el área de un circulo
const areaOfCircle = PI * radius * radius;
console.log(areaOfCircle); //  314 m
const gravity = 9.81; // en m/s2
let mass = 72; // en Kilogram
// Calculemos el peso de un objeto.
const weight = mass * gravity;
console.log(weight); // 706.32 N(Newton)
const boilingPoint = 100; // temperatura en °C, punto de ebullición del agua
const bodyTemp = 37; // temperatura corporal en °C
// Concatenación de string con números usando interpolación de strings
/*
 El punto de ebullición del agua es de 100 °C.
 La temperatura del cuerpo humano es de 37 oC.
 La gravedad de la tierra es de 9.81 m/s2.
 */
console.log(
  `El punto de ebullición del agua es de ${boilingPoint} °C.\nLa temperatura del cuerpo humano es de ${bodyTemp} °C.\nLa gravedad de la tierra es de ${gravity} m / s2.`
);

/* Operadores de Comparación
En programación comparamos valores, usamos operadores de comparación para comparar dos valores. Comprobamos si un valor es mayor, menor o igual a otro valor.
*/
console.log(3 > 2); // true, porque 3 es mayor que 2
console.log(3 >= 2); // true, porque 3 es mayor que 2
console.log(3 < 2); // false,  porque 3 es mayor que 2
console.log(2 < 3); // true, porque 2 es menor que 3
console.log(2 <= 3); // true, porque 2 es menor que 3
console.log(3 == 2); // false, porque 3 no es igual a 2
console.log(3 != 2); // true, porque 3 no es igual a 2
console.log(3 == "3"); // true, compara solamente el valor
console.log(3 === "3"); // false, compara tanto el valor como el tipo de dato
console.log(3 !== "3"); // true, compara tanto el valor como el tipo de dato
console.log(3 != 3); // false, compara solo valor
console.log(3 !== 3); // false, compara tanto el valor como el tipo de dato
console.log(0 == false); // true, equivalente
console.log(0 === false); // false, No exactamente igual
console.log(0 == ""); // true, equivalente
console.log(0 == " "); // true, equivalente
console.log(0 === ""); // false, No exactamente igual
console.log(1 == true); // true, equivalente
console.log(1 === true); // false, No exactamente igual
console.log(undefined == null); // true
console.log(undefined === null); // false
console.log(NaN == NaN); // false, diferente
console.log(NaN === NaN); // false
console.log(typeof NaN); // tipo número

console.log("mango".length == "avocado".length); // false
console.log("mango".length != "avocado".length); // true
console.log("mango".length < "avocado".length); // true
console.log("milk".length == "meat".length); // true
console.log("milk".length != "meat".length); // false
console.log("tomato".length == "potato".length); // true
console.log("python".length > "dragon".length); // false

/* Operadores Lógicos
Los siguientes símbolos son los operadores lógicos más comunes: &&(ampersand) , ||(pipe) and !(negation). El operador && se vuelve verdadero sólo si los dos operandos son verdaderos. El operador || se vuelve verdadero cualquiera de los operandos es verdadero. El operador ! niega true a false y false a true.
*/

// && ejemplo de operador ampersand
const check1 = 4 > 3 && 10 > 5; // true && true -> true
const check2 = 4 > 3 && 10 < 5; // true && false -> false
const check3 = 4 < 3 && 10 < 5; // false && false -> false

// || ejemplo de operador pipe
const check4 = 4 > 3 || 10 > 5; // true  || true -> true
const check5 = 4 > 3 || 10 < 5; // true  || false -> true
const check6 = 4 < 3 || 10 < 5; // false || false -> false

//! ejemplos de negación
let check7 = 4 > 3; // true
let check8 = !(4 > 3); //  false
let isSingle = true;
let isLightOff = !isLightOn; // false
let isMarried = !false; // true

/* Operadores de Incremento
En JavaScript usamos el operador de incremento para aumentar un valor almacenado en una variable. El incremento podría ser antes o después del incremento. Veamos cada uno de ellos:
*/

// Pre-incremento
let count1 = 0;
console.log(++count1); // 1
console.log(count1); // 1
// Post-incremento
let count2 = 0;
console.log(count2++); // 0
console.log(count); // 1
// Usamos la mayor parte del tiempo post-incremento. Pero debes recordar cómo usar el operador de incremento posterior.

/* Operadores de Decremento
En JavaScript usamos el operador de decremento para disminuir un valor almacenado en una variable. El decremento puede ser previo o posterior al decremento. Veamos cada uno de ellos:
*/

// Pre-decremento
let count3 = 0;
console.log(--count3); // -1
console.log(count3); // -1
//Post-decremento
let count4 = 0;
console.log(count4--); // 0
console.log(count4); // -1

/*Operadores Ternarios
El operador ternario permite escribir una condición. Otra forma de escribir condicionales es usando operadores ternarios. Mira los siguientes ejemplos:
*/

let isRaining1 = true;
isRaining1
  ? console.log("Necesitas un impermeable.")
  : console.log("No necesitas un impermeable.");
let isRaining2 = false;

isRaining2
  ? console.log("Necesitas un impermeable.")
  : console.log("No necesitas un impermeable.");
// Necesitas un impermeable.
// No necesitas un impermeable.
let numbe1 = 5;
number1 > 0
  ? console.log(`${number1} is a positive number`)
  : console.log(`${number1} is a negative number`);
number1 = -5;

number1 > 0
  ? console.log(`${number1} is a positive number`)
  : console.log(`${number1} is a negative number`);
// 5 es un número positivo
// -5 es un número negativo

// Métodos Window

/* Método Window alert()
Cómo ha visto al principio, el método alert() muestra un cuadro de alerta con un mensaje específico y un botón Aceptar. Es un método incorporado y toma un argumento.
*/


alert(message);
alert("Bienvenido a 30DaysOfJavaScript");
// No uses demasiada alert (alertas) porque molesta, úsala solo para probar.

/* Método Window prompt()
Los métodos window prompt (entrada) muestran un cuadro de solicitud con una entrada en su navegador para tomar valores de entrada y los datos de entrada se pueden almacenar en una variable. El método prompt() toma dos argumentos. El segundo argumento es opcional.
*/

prompt("texto requerido", "texto opcional");
let number = prompt("Ingrese un número", "El número va aquí");
console.log(number);

/*Método Window confirm()
El método confirm() muestra un cuadro de diálogo con un mensaje específico, junto con un botón Aceptar y Cancelar. Un cuadro de confirmación se usa a menudo para pedir permiso a un usuario para ejecutar algo. Window confirm() toma una cadena como argumento. Al hacer clic en Aceptar se obtiene un valor true, mientras que al hacer clic en el botón Cancelar se obtiene un valor false.
*/

const agree = confirm("¿Estás seguro de que quieres eliminar? ");
console.log(agree); // el resultado será true o false según el click en el cuadro de diálogo
//Estos no son todos los métodos de window, tendremos una sección separada para profundizar en los métodos de window.

/* Objeto Date
la hora y la fecha actuales se crean utilizando el objeto Date de JavaScript. El objeto que creamos usando el objeto Date proporciona muchos métodos para trabajar con fecha y hora. Los métodos que usamos para obtener información de fecha y hora de los valores de un objeto Date comienzan con una palabra get porque proporciona la información. getFullYear(), getMonth(), getDate(), getDay(), getHours(), getMinutes, getSeconds(), getMilliseconds(), getTime(), getDay()
*/

/* Crear un objeto de tiempo
Una vez que creamos el objeto de tiempo. El objeto de tiempo proporcionará información sobre el tiempo. Vamos a crear un objeto de tiempo
*/
const now2 = new Date();
console.log(now); // Sáb 04 de enero de 2020 00:56:41 GMT+0200 (hora estándar de Europa del Este
// Hemos creado un objeto de tiempo y podemos acceder a cualquier información de fecha y hora del objeto utilizando los métodos de obtención.

/* Obtener el año completo
Extraigamos u obtengamos el año completo de un objeto de tiempo.
*/
const now1 = new Date();
console.log(now.getFullYear()); // 2020

/* Obtener mes
Extraigamos u obtengamos el mes de un objeto de tiempo.
*/
const now3 = new Date();
console.log(now3.getMonth()); // 0, porque el mes es enero, meses(0-11)

/* Obtener fecha
Extraigamos u obtengamos la fecha del mes de un objeto de tiempo.
*/
const now4 = new Date();
console.log(now4.getDate()); // 4, porque es el 4to dia del mes, día (1-31)

/* Obtener día
Extraigamos u obtengamos el día de la semana de un objeto de tiempo.
*/
const now5 = new Date();
console.log(now5.getDay()); // 6, porque el día es sábado que es el día 7
// El domingo es 0, el lunes es 1 y el sábado es 6
// Obtener el día de la semana como un número (0-6)

/* Obtener horas
Extraigamos u obtengamos las horas de un objeto de tiempo.
*/
const now6 = new Date();
console.log(now.getHours()); // 0, porque el tiempo es 00:56:41

/* Obtener minutos
Extraigamos u obtengamos los minutos de un objeto de tiempo.
*/
const now7 = new Date();
console.log(now7.getMinutes()); // 56, porque el tiempo es 00:56:41

/*Obtener segundos
Extraigamos u obtengamos los segundos de un objeto de tiempo.
*/
const now8 = new Date();
console.log(now8.getSeconds()); // 41, porque el tiempo es 00:56:41

/*Obtener tiempo
Este método da tiempo en milisegundos a partir del 1 de enero de 1970. También se conoce como tiempo Unix. Podemos obtener el tiempo de Unix de dos maneras:
*/
//Usando getTime()
const now9 = new Date(); //
console.log(now9.getTime()); // 1578092201341, este es el número de segundos que han pasado desde el 1ero de Enero de 1970 al 4 de Enero del 2020 00:56:41

// Usando Date.now()
const allSeconds = Date.now(); //
console.log(allSeconds); // 1578092201341, este es el número de segundos que han pasado desde el 1ero de Enero de 1970 al 4 de Enero del 2020 00:56:41

const timeInSeconds = new Date().getTime();
console.log(allSeconds == timeInSeconds); // true

// Vamos a formatear estos valores a un formato de tiempo legible por humanos. Ejemplo:
const now = new Date();
const year = now.getFullYear(); // return años
const month = now.getMonth() + 1; // return meses(0 - 11)
const date = now.getDate(); // return días (1 - 31)
const hours = now.getHours(); // return horas (0 - 23)
const minutes = now.getMinutes(); // return minutos (0 -59)

console.log(`${date}/${month}/${year} ${hours}:${minutes}`); // 4/1/2020 0:56