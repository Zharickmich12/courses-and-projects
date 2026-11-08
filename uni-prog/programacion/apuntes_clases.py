# CLASES, NOMBRES, ÁMBITOS Y ESPACIOS DE NOMBRES

# CLASES: IDEA GENERAL
# Las clases proveen una forma de empaquetar datos y funcionalidad juntos.
# Al crear una nueva clase se crea un nuevo tipo de objeto, que permite crear nuevas instancias de ese tipo.
# Cada instancia puede tener atributos adjuntos para mantener su estado.
# Las instancias también pueden tener métodos (definidos por su clase) para modificar su estado.
# El mecanismo de clases de Python es una mezcla de los mecanismos de C++ y Modula-3.
# La herencia permite múltiples clases base.
# Una clase derivada puede sobreescribir cualquier método de su(s) clase(s) base.
# Un método puede llamar al método de la clase base con el mismo nombre.
# Los objetos pueden tener una cantidad arbitraria de datos de cualquier tipo.
# Las clases son dinámicas: se crean en tiempo de ejecución y pueden modificarse luego de la creación.
# Los miembros de las clases (incluyendo datos) normalmente son públicos y todas las funciones miembro son virtuales (terminología de C++).
# No hay atajos para referirse a los miembros del objeto desde sus métodos: el método se declara con un primer argumento explícito que representa al objeto (como en Modula-3).
# Las clases mismas son objetos (como en Smalltalk), lo que da una semántica para importar y renombrar.
# Los tipos de datos integrados pueden usarse como clases base para que el usuario los extienda.
# La mayoría de los operadores integrados con sintaxis especial (aritméticos, de sub-índice, etc.) pueden volver a definirse por instancias de la clase.

# NOMBRES Y OBJETOS
# Los objetos tienen individualidad y múltiples nombres (en muchos ámbitos) pueden vincularse al mismo objeto: esto se llama aliasing.
# Con tipos básicos inmutables (números, cadenas, tuplas) el aliasing puede ignorarse sin problemas.
# Con objetos mutables (listas, diccionarios y la mayoría de otros tipos) el aliasing tiene un efecto posiblemente sorpresivo.
# Los renombres funcionan como punteros en algunos aspectos, por eso pasar un objeto es barato: solamente se pasa el puntero.
# Si una función modifica el objeto que se le pasó, quien la llamó verá el cambio; esto elimina la necesidad de dos formas distintas de pasar argumentos, como en Pascal.

def demo_aliasing():
    print("\n--- Aliasing ---")
    a = [1, 2, 3]
    b = a
    b.append(4)
    print("a =", a, "| b =", b, "| mismo objeto:", a is b)

    def modifica(lista):
        lista.append("cambio")

    modifica(a)
    print("el que llama ve el cambio:", a)

# ESPACIOS DE NOMBRES
# Un espacio de nombres es una relación de nombres a objetos.
# Muchos están implementados como diccionarios de Python, pero eso no se nota (excepto por el desempeño) y puede cambiar en el futuro.
# Ejemplos: los nombres incluidos (abs(), excepciones integradas), los nombres globales de un módulo y los nombres locales de la invocación a una función.
# No hay relación en absoluto entre los nombres de espacios de nombres distintos: dos módulos pueden definir una función maximizar sin confusión, y se usa el nombre del módulo como prefijo.
# Atributo es cualquier cosa después de un punto: en z.real, real es un atributo del objeto z.
# Las referencias a nombres en módulos son referencias a atributos: en modulo.funcion, modulo es un objeto módulo y funcion es un atributo de éste.
# Los atributos del módulo y los nombres globales del módulo comparten el mismo espacio de nombres.
# Los atributos pueden ser de solo lectura o de escritura; los de módulo son modificables: modname.the_answer = 42.
# Los atributos modificables se pueden eliminar con del: del modname.the_answer elimina el atributo the_answer del objeto nombrado por modname.

# MOMENTO DE CREACIÓN Y TIEMPO DE VIDA
# El espacio de nombres de los nombres incluidos se crea cuando se inicia el intérprete y nunca se borra.
# El espacio de nombres global de un módulo se crea cuando se lee la definición del módulo y normalmente dura hasta que el intérprete finaliza.
# Las instrucciones del nivel superior (script o interactivo) son parte del módulo __main__, que tiene su propio espacio de nombres global.
# Los nombres incluidos viven en un módulo llamado builtins.
# El espacio de nombres local de una función se crea cuando se llama y se elimina cuando la función retorna o lanza una excepción que no se maneje dentro de ella.
# Las llamadas recursivas tienen cada una su propio espacio de nombres local.

# ÁMBITOS (ALCANCES)
# Un ámbito es una región textual de un programa donde un espacio de nombres es accesible directamente.
# "Accesible directamente" significa que una referencia sin calificar a un nombre intenta encontrarlo dentro de ese espacio de nombres.
# Los ámbitos se determinan de forma estática pero se utilizan de forma dinámica.
# Durante la ejecución hay 3 o 4 ámbitos anidados cuyos espacios de nombres son directamente accesibles, y se inspeccionan en este orden:
#   1. El más interno (se inspecciona primero): nombres locales.
#   2. Los ámbitos de funciones que encierran a otra, desde el más cercano: nombres no locales pero tampoco globales.
#   3. El penúltimo: nombres globales del módulo actual.
#   4. El más externo (último inspeccionado): nombres integrados.
# Si un nombre se declara global, todas las referencias y asignaciones van directamente al ámbito penúltimo, que contiene los nombres globales del módulo.
# Para volver a enlazar variables fuera del ámbito más interno se usa nonlocal; si no se declara, esas variables son de solo lectura.
# Intentar escribir en una variable de solo lectura simplemente crea una nueva variable local en el ámbito más interno y deja sin cambios la del ámbito externo.
# Normalmente el ámbito local referencia los nombres locales de la función actual; fuera de una función referencia el mismo espacio de nombres que el global, el del módulo.
# Las definiciones de clases crean un espacio de nombres más en el ámbito local.
# Los ámbitos se determinan textualmente: el ámbito global de una función definida en un módulo es el espacio de nombres de ese módulo, no importa desde dónde ni con qué alias se llame.
# La búsqueda de nombres se hace dinámicamente en tiempo de ejecución, pero la definición del lenguaje evoluciona hacia resolución estática en tiempo de compilación; las variables locales ya se determinan estáticamente.
# Si no hay declaración global o nonlocal en efecto, las asignaciones a nombres siempre van al ámbito interno.
# Las asignaciones no copian datos, solamente asocian nombres a objetos.
# Lo mismo al borrar: la declaración del x quita la asociación de x del espacio de nombres referenciado por el ámbito local.
# Todas las operaciones que introducen nombres nuevos usan el ámbito local: import y las definiciones de funciones asocian el módulo o el nombre de la función en el ámbito local.
# La declaración global indica que ciertas variables viven en el ámbito global y deben reasignarse allí.
# La declaración nonlocal indica que ciertas variables viven en un ámbito encerrado y deben reasignarse allí.

def scope_test():
    def do_local():
        spam = "local spam"

    def do_nonlocal():
        nonlocal spam
        spam = "nonlocal spam"

    def do_global():
        global spam
        spam = "global spam"

    spam = "test spam"
    do_local()
    print("After local assignment:", spam)
    do_nonlocal()
    print("After nonlocal assignment:", spam)
    do_global()
    print("After global assignment:", spam)


def demo_ambitos():
    print("\n--- Ámbitos y espacios de nombres ---")
    scope_test()
    print("In global scope:", spam)
    # La asignación local (comportamiento normal) no cambió la vinculación de spam de scope_test.
    # La asignación nonlocal cambió la vinculación de spam de scope_test.
    # La asignación global cambió la vinculación a nivel de módulo.
    # No había vinculación para spam global antes de la asignación global.

# SINTAXIS DE DEFINICIÓN DE CLASES
# La forma más sencilla es: class ClassName: seguido de <statement-1> ... <statement-N>.
# Igual que las definiciones de funciones (def), deben ejecutarse antes de tener efecto; se puede poner una dentro de una rama de un if o dentro de una función.
# En la práctica las declaraciones dentro de una clase son definiciones de funciones, pero se permiten otras que a veces resultan útiles.
# Las funciones dentro de una clase normalmente tienen una lista de argumentos peculiar, dictada por las convenciones de invocación de métodos.
# Al ingresar a una definición de clase se crea un nuevo espacio de nombres que se usa como ámbito local, así que todas las asignaciones a variables locales van allí.
# Las definiciones de funciones asocian allí el nombre de las funciones nuevas.
# Al finalizar normalmente la definición (al llegar al final) se crea un objeto clase que envuelve los contenidos de ese espacio de nombres.
# Se restablece el ámbito local original y el objeto clase se asocia allí al nombre del encabezado (ClassName en el ejemplo).

# OBJETOS CLASE
# Soportan dos operaciones: hacer referencia a atributos e instanciación.
# Referencia a atributos: sintaxis estándar objeto.nombre; son válidos todos los nombres que estaban en el espacio de nombres de la clase cuando se creó.
# Los atributos de clase también se pueden asignar, así que se puede cambiar MyClass.i por asignación.
# __doc__ también es un atributo válido y devuelve el docstring de la clase.
# La instanciación usa notación de funciones: el objeto clase es como una función sin parámetros que retorna una nueva instancia.
# La instanciación crea un objeto vacío; para crear objetos en un estado inicial particular se define el método especial __init__().
# Si la clase define __init__(), la instanciación lo invoca automáticamente para la instancia recién creada.
# __init__() puede tener argumentos; los que se pasan al operador de instanciación van a parar a __init__().

class MyClass:
    """A simple example class"""
    i = 12345

    def f(self):
        return 'hello world'


class Complex:
    def __init__(self, realpart, imagpart):
        self.r = realpart
        self.i = imagpart


def demo_objetos_clase():
    print("\n--- Objetos clase ---")
    print("MyClass.i =", MyClass.i)
    print("MyClass.f =", MyClass.f)
    MyClass.i = 99999
    print("MyClass.i (modificado) =", MyClass.i)
    MyClass.i = 12345
    print("__doc__ =", MyClass.__doc__)
    x = Complex(3.0, -4.5)
    print("x.r, x.i =", (x.r, x.i))

# OBJETOS INSTANCIA
# La única operación que entienden es la referencia de atributos.
# Hay dos tipos de nombres de atributos válidos: atributos de datos y métodos.
# Los atributos de datos equivalen a las "variables de instancia" de Smalltalk y a las "variables miembro" de C++.
# Los atributos de datos no necesitan declararse: se crean la primera vez que se les asigna algo, como las variables locales.
# Un método es una función que "pertenece a" un objeto.
# Los nombres válidos de métodos de una instancia dependen de su clase: todo atributo de clase que sea un objeto función define un método correspondiente en sus instancias.
# x.f es una referencia a un método válido porque MyClass.f es una función; x.i no lo es porque MyClass.i no lo es.
# x.f no es la misma cosa que MyClass.f: es un objeto método, no un objeto función.

def demo_instancias():
    print("\n--- Objetos instancia ---")
    x = MyClass()
    x.counter = 1
    while x.counter < 10:
        x.counter = x.counter * 2
    print(x.counter)
    del x.counter

# OBJETOS MÉTODO
# Generalmente un método se llama luego de ser vinculado: x.f().
# No es necesario llamarlo en ese momento: x.f es un objeto método y puede guardarse y llamarse más tarde.
# Lo especial de los métodos es que el objeto se pasa como primer argumento de la función.
# x.f() es exactamente equivalente a MyClass.f(x).
# Llamar a un método con una lista de n argumentos equivale a llamar a la función con una lista creada insertando el objeto del método antes del primer argumento.
# Cuando se referencia un atributo no-dato de una instancia, se busca en su clase.
# Si el nombre es un atributo de clase válido que es un objeto función, las referencias a la instancia y a la función se empaquetan en un objeto método.
# Al llamar al objeto método con una lista de argumentos, se construye una nueva lista a partir de la instancia y los argumentos, y se llama a la función con esa nueva lista.

def demo_metodos():
    print("\n--- Objetos método ---")
    x = MyClass()
    print(x.f())
    xf = x.f
    print(xf())
    print("x.f() == MyClass.f(x):", x.f() == MyClass.f(x))

# VARIABLES DE CLASE Y DE INSTANCIA
# Las variables de instancia son para datos únicos de cada instancia.
# Las variables de clase son para atributos y métodos compartidos por todas las instancias de la clase.
# Los datos compartidos pueden tener efectos inesperados con objetos mutables como listas y diccionarios.
# Una lista como tricks no debería ser variable de clase porque una sola lista sería compartida por todas las instancias.
# El diseño correcto es usar una variable de instancia, creada en __init__, que genera una lista vacía nueva para cada instancia.

class Dog:
    kind = 'canine'

    def __init__(self, name):
        self.name = name


class DogMalo:
    tricks = []

    def __init__(self, name):
        self.name = name

    def add_trick(self, trick):
        self.tricks.append(trick)


class DogBien:
    def __init__(self, name):
        self.name = name
        self.tricks = []

    def add_trick(self, trick):
        self.tricks.append(trick)


def demo_variables_clase_instancia():
    print("\n--- Variables de clase y de instancia ---")
    d, e = Dog('Fido'), Dog('Buddy')
    print(d.kind, e.kind)
    print(d.name, e.name)

    d, e = DogMalo('Fido'), DogMalo('Buddy')
    d.add_trick('roll over')
    e.add_trick('play dead')
    print("Mal diseño :", d.tricks)

    d, e = DogBien('Fido'), DogBien('Buddy')
    d.add_trick('roll over')
    e.add_trick('play dead')
    print("Buen diseño:", d.tricks, e.tricks)

# OBSERVACIONES
# Si el mismo nombre de atributo aparece en la instancia y en la clase, la búsqueda del atributo prioriza la instancia.
# Los atributos de datos pueden ser referenciados tanto por los métodos como por los usuarios ("clientes") ordinarios del objeto.
# Las clases no se usan para implementar tipos de datos abstractos puros: en Python nada hace cumplir el ocultar datos, todo se basa en convención.
# La implementación de Python, escrita en C, sí puede ocultar por completo detalles de implementación y el control de acceso a un objeto; esto se puede usar en extensiones escritas en C.
# Los clientes deben usar los atributos de datos con cuidado: pueden romper invariantes que mantienen los métodos si pisan los atributos de datos.
# Los clientes pueden añadir sus propios atributos de datos a una instancia sin afectar la validez de sus métodos, siempre que se eviten conflictos de nombres; una convención de nombres ahorra muchos dolores de cabeza.
# No hay atajo para referirse a atributos de datos (u otros métodos) desde dentro de un método; esto aumenta la legibilidad porque no se confunden variables locales con variables de instancia.
# El primer argumento de un método suele llamarse self; es solo una convención y el nombre no significa nada en especial para Python.
# Si no se sigue la convención el código puede ser menos legible para otros programadores, y un navegador de clases podría depender de ella.
# Cualquier objeto función que es atributo de clase define un método para las instancias de esa clase.
# La definición de la función no tiene que estar textualmente dentro de la clase: asignar un objeto función a una variable local en la clase también sirve.
# Esa práctica normalmente sólo sirve para confundir a quien lee el programa.
# Los métodos pueden llamar a otros métodos de la instancia usando el argumento self.
# Los métodos pueden hacer referencia a nombres globales igual que las funciones comunes; el ámbito global asociado a un método es el módulo que contiene su definición.
# Una clase nunca se usa como ámbito global.
# Usos legítimos del ámbito global: las funciones y módulos importados pueden usarse por los métodos, al igual que las funciones y clases definidas en él.
# Habitualmente la clase que contiene el método está definida en el ámbito global.
# Todo valor es un objeto y por lo tanto tiene una clase (también llamada su tipo), que se almacena como objeto.__class__.

def f1(self, x, y):
    return min(x, x + y)


class C:
    f = f1

    def g(self):
        return 'hello world'

    h = g


class Bag:
    def __init__(self):
        self.data = []

    def add(self, x):
        self.data.append(x)

    def addtwice(self, x):
        self.add(x)
        self.add(x)


class Warehouse:
    purpose = 'storage'
    region = 'west'


def demo_observaciones():
    print("\n--- Observaciones ---")
    w1 = Warehouse()
    print(w1.purpose, w1.region)
    w2 = Warehouse()
    w2.region = 'east'
    print(w2.purpose, w2.region)

    c = C()
    print("c.f(1, 2) =", c.f(1, 2), "| c.g() =", c.g(), "| c.h() =", c.h())

    b = Bag()
    b.addtwice('x')
    print("Bag.data =", b.data)

    print("(3).__class__ =", (3).__class__)
    print("c.__class__ =", c.__class__)


if __name__ == "__main__":
    demo_aliasing()
    demo_ambitos()
    demo_objetos_clase()
    demo_instancias()
    demo_metodos()
    demo_variables_clase_instancia()
    demo_observaciones()
