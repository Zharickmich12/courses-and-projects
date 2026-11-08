# HERENCIA, VARIABLES PRIVADAS, ITERADORES Y GENERADORES

# HERENCIA
# Una característica del lenguaje no sería digna del nombre "clase" si no soportara herencia.
# La sintaxis para una definición de clase derivada es: class DerivedClassName(BaseClassName): seguido de <statement-1> ... <statement-N>.
# El nombre BaseClassName debe estar definido en un ámbito que contenga a la definición de la clase derivada.
# En el lugar del nombre de la clase base se permiten otras expresiones arbitrarias.
# Esto puede ser útil, por ejemplo, cuando la clase base está definida en otro módulo: class DerivedClassName(modname.BaseClassName):
# La ejecución de una definición de clase derivada procede de la misma forma que una clase base.
# Cuando el objeto clase se construye, se tiene en cuenta a la clase base.
# Esto se usa para resolver referencias a atributos: si un atributo solicitado no se encuentra en la clase, la búsqueda continúa por la clase base.
# Esta regla se aplica recursivamente si la clase base misma deriva de alguna otra clase.
# No hay nada en especial en la instanciación de clases derivadas: DerivedClassName() crea una nueva instancia de la clase.
# Las referencias a métodos se resuelven así: se busca el atributo de clase correspondiente, descendiendo por la cadena de clases base si es necesario, y la referencia al método es válida si se entrega un objeto función.
# Las clases derivadas pueden redefinir métodos de su clase base.
# Como los métodos no tienen privilegios especiales cuando llaman a otros métodos del mismo objeto, un método de la clase base que llame a otro método definido en la misma clase base puede terminar llamando a un método de la clase derivada que lo haya redefinido.
# Para los programadores de C++: en Python todos los métodos son en efecto virtuales.
# Un método redefinido en una clase derivada puede querer extender en vez de simplemente reemplazar al método de la clase base con el mismo nombre.
# Hay una manera simple de llamar al método de la clase base directamente: simplemente llamás a BaseClassName.methodname(self, arguments).
# En ocasiones esto es útil para los clientes también.
# Esto sólo funciona si la clase base es accesible como BaseClassName en el ámbito global.

# Python tiene dos funciones integradas que funcionan con herencia:
# isinstance() sirve para verificar el tipo de una instancia: isinstance(obj, int) será True sólo si obj.__class__ es int o alguna clase derivada de int.
# issubclass() sirve para verificar la herencia de clases: issubclass(bool, int) es True ya que bool es una subclase de int.
# issubclass(float, int) es False ya que float no es una subclase de int.

print(issubclass(bool, int))
print(issubclass(float, int))

# HERENCIA MÚLTIPLE
# Python también soporta una forma de herencia múltiple.
# Una definición de clase con múltiples clases base se ve así: class DerivedClassName(Base1, Base2, Base3): seguido de <statement-1> ... <statement-N>.
# Para la mayoría de los propósitos, en los casos más simples, se puede pensar en la búsqueda de los atributos heredados de una clase padre como una búsqueda en profundidad, de izquierda a derecha, sin repetir la misma clase cuando está dos veces en la jerarquía.
# Por lo tanto, si un atributo no se encuentra en DerivedClassName, se busca en Base1, luego (recursivamente) en las clases base de Base1, y solo si no se encuentra allí se lo busca en Base2, y así sucesivamente.
# En realidad es un poco más complejo que eso: el orden de resolución de métodos cambia dinámicamente para soportar las llamadas cooperativas a super().
# Este enfoque es conocido en otros lenguajes con herencia múltiple como "llámese al siguiente método" y es más poderoso que la llamada al superior que se encuentra en lenguajes con sólo herencia simple.
# El orden dinámico es necesario porque todos los casos de herencia múltiple presentan una o más relaciones en diamante (donde al menos una de las clases padre puede accederse por múltiples caminos desde la clase más baja).
# Por ejemplo, todas las clases heredan de object, así que cualquier caso de herencia múltiple provee más de un camino para llegar a object.
# Para evitar que las clases base sean accedidas más de una vez, el algoritmo dinámico linealiza el orden de búsqueda de forma que preserva el orden de izquierda a derecha especificado en cada clase, llama a cada padre una sola vez, y es monótono.
# Monótono significa que una clase puede ser subclasificada sin afectar el orden de precedencia de sus padres.
# En conjunto, estas propiedades hacen posible diseñar clases confiables y extensibles con herencia múltiple.
# Para más detalle, ver The Python 2.3 Method Resolution Order.

# VARIABLES PRIVADAS
# Las variables "privadas" de instancia, que no pueden accederse excepto desde dentro de un objeto, no existen en Python.
# Hay una convención que se sigue en la mayoría del código Python: un nombre prefijado con un guión bajo (por ejemplo, _spam) debería tratarse como una parte no pública de la API (sea una función, un método o un dato).
# Debería considerarse un detalle de implementación y está sujeto a cambios sin aviso.
# Hay un caso de uso válido para los identificadores privados de clase (a saber: colisión de nombres con nombres definidos en las subclases), por eso hay un soporte limitado para este mecanismo.
# Cualquier identificador con la forma __spam (al menos dos guiones bajos al principio, como mucho un guión bajo al final) es textualmente reemplazado por _nombredeclase__spam.
# nombredeclase es el nombre de clase actual al que se le sacan guiones bajos del comienzo (si los tuviera).
# Se modifica el nombre del identificador sin importar su posición sintáctica, siempre y cuando ocurra dentro de la definición de una clase.
# Ver también The private name mangling specifications para detalles y casos especiales.
# La modificación de nombres es útil para dejar que las subclases sobreescriban los métodos sin romper las llamadas a los métodos desde la misma clase.

class Mapping:
    def __init__(self, iterable):
        self.items_list = []
        self.__update(iterable)

    def update(self, iterable):
        for item in iterable:
            self.items_list.append(item)

    __update = update   # private copy of original update() method

class MappingSubclass(Mapping):

    def update(self, keys, values):
        # provides new signature for update()
        # but does not break __init__()
        for item in zip(keys, values):
            self.items_list.append(item)

# El ejemplo funcionaría incluso si MappingSubclass introdujera un identificador __update, ya que se reemplaza con _Mapping__update en la clase Mapping y _MappingSubclass__update en la clase MappingSubclass respectivamente.
# Las reglas de modificación de nombres están diseñadas principalmente para evitar accidentes.
# Es posible acceder o modificar una variable que es considerada como privada.
# Esto hasta puede resultar útil en circunstancias especiales, tales como en el depurador.
# El código pasado a exec o eval() no considera que el nombre de clase de la clase que invoca sea la clase actual.
# Esto es similar al efecto de la sentencia global, efecto que es de similar manera restringido a código que es compilado en conjunto.
# La misma restricción aplica a getattr(), setattr() y delattr(), así como cuando se referencia a __dict__ directamente.

# DETALLES Y CUESTIONES VARIAS
# A veces es útil tener un tipo de datos similar al "registro" de Pascal o la "estructura" de C, que sirva para juntar algunos pocos ítems con nombre.
# El enfoque idiomático es utilizar dataclasses con este propósito:

from dataclasses import dataclass

@dataclass
class Employee:
    name: str
    dept: str
    salary: int
john = Employee('john', 'computer lab', 1000)
print(john.dept)
print(john.salary)

# Un fragmento de código en Python que espera un tipo de dato abstracto en particular a menudo puede recibir una clase que emule los métodos de ese tipo de dato en su lugar.
# Por ejemplo, si tienes una función que formatea algunos datos de un objeto de archivo, puedes definir una clase con los métodos read() y readline() que obtienen los datos de un búfer de cadena en su lugar, y pasarla como argumento.
# Los objetos método de instancia también tienen atributos: m.__self__ es el objeto instancia con el método m(), y m.__func__ es el objeto función correspondiente al método.

# ITERADORES

# La mayoría de los objetos contenedores pueden ser recorridos usando una sentencia for:

for element in [1, 2, 3]:
    print(element)
for element in (1, 2, 3):
    print(element)
for key in {'one':1, 'two':2}:
    print(key)
for char in "123":
    print(char)
# for line in open("myfile.txt"):
#     print(line, end='')

# Este estilo de acceso es limpio, conciso y conveniente.
# El uso de iteradores está impregnado y unifica a Python.
# En bambalinas, la sentencia for llama a iter() en el objeto contenedor.
# La función retorna un objeto iterador que define el método __next__() que accede elementos en el contenedor de a uno por vez.
# Cuando no hay más elementos, __next__() lanza una excepción StopIteration que le avisa al bucle del for que hay que terminar.
# Se puede llamar al método __next__() usando la función integrada next(); este ejemplo muestra cómo funciona todo esto:

s = 'abc'
it = iter(s)
print(it)
print(next(it))
print(next(it))
print(next(it))
# next(it)
# Traceback (most recent call last):
#   File "<stdin>", line 1, in <module>
#     next(it)
# StopIteration

# Habiendo visto la mecánica del protocolo de iteración, es fácil agregar comportamiento de iterador a las clases.
# Se define un método __iter__() que retorne un objeto con un método __next__().
# Si la clase define __next__(), entonces alcanza con que __iter__() retorne self:

class Reverse:
    """Iterator for looping over a sequence backwards."""
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]
rev = Reverse('spam')
print(iter(rev))
for char in rev:
    print(char)

# GENERADORES
# Generators son una herramienta simple y poderosa para crear iteradores.
# Están escritos como funciones regulares pero usan la palabra clave yield siempre que quieran retornar datos.
# Cada vez que se llama a next(), el generador se reanuda donde lo dejó (recuerda todos los valores de datos y qué instrucción se ejecutó por última vez).
# Un ejemplo muestra que los generadores pueden ser trivialmente fáciles de crear:

def reverse(data):
    for index in range(len(data)-1, -1, -1):
        yield data[index]
for char in reverse('golf'):
    print(char)

# Todo lo que puede ser hecho con generadores también puede ser hecho con iteradores basados en clases.
# Lo que hace que los generadores sean tan compactos es que los métodos __iter__() y __next__() son creados automáticamente.
# Otra característica clave es que las variables locales y el estado de la ejecución son guardados automáticamente entre llamadas.
# Esto hace que la función sea más fácil de escribir y quede mucho más claro que hacerlo usando variables de instancia tales como self.indice y self.datos.
# Además de la creación automática de métodos y el guardar el estado del programa, cuando los generadores terminan automáticamente lanzan StopIteration.
# Combinadas, estas características facilitan la creación de iteradores, y hacen que no sea más esfuerzo que escribir una función regular.

# EXPRESIONES GENERADORAS
# Algunos generadores simples pueden ser escritos de manera concisa como expresiones usando una sintaxis similar a las comprensiones de listas pero con paréntesis en lugar de corchetes.
# Estas expresiones están hechas para situaciones donde el generador es utilizado de inmediato por la función que lo encierra.
# Las expresiones generadoras son más compactas pero menos versátiles que las definiciones completas de generadores.
# Tienden a ser más amigables con la memoria que sus comprensiones de listas equivalentes.
# Ejemplos:

print(sum(i*i for i in range(10)))                 # sum of squares

xvec = [10, 20, 30]
yvec = [7, 5, 3]
print(sum(x*y for x,y in zip(xvec, yvec)))         # dot product

# unique_words = set(word for line in page  for word in line.split())

# valedictorian = max((student.gpa, student.name) for student in graduates)

data = 'golf'
print(list(data[i] for i in range(len(data)-1, -1, -1)))

# NOTA
# Los objetos módulo tienen un atributo secreto de solo lectura llamado __dict__ que retorna el diccionario usado para implementar el espacio de nombres del módulo.
# El nombre __dict__ es un atributo pero no un nombre global.
# Obviamente, usar esto viola la abstracción de la implementación de espacios de nombres, y debería restringirse a cosas como depuradores post-mortem.