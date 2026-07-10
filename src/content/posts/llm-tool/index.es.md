---
title: 'Herramientas desechables con LLM: cuándo construir y cuándo no'
date: 2026-07-09
draft: false
slug: 'llm-tool'
description: 'Tres herramientas construidas con LLM y boto3 sobre AWS y por qué solo una mereció la pena. Un criterio práctico para decidir qué construir.'
summary: 'Construí tres scripts con LLM y boto3 para Athena, Glue y Redshift. Solo uno sobrevivió. La diferencia no fue técnica: fue si alguien más lo necesitaba.'
category: carrera
tags: [tools, productivity, llm, aws, best-practices]
lang: 'es'
cover:
  image: './cover.png'
  alt: 'Herramientas desechables con LLM en AWS'
---

Probablemente estemos de acuerdo en que la interfaz web de AWS es pesada y lenta. Si has trabajado con ella reconocerás esa sensación de esperar a que cargue o echar en falta funciones de productividad básicas. Todo se acentúa si trabajas en máquinas de bajos recursos o escritorios remotos: en mi caso, llegué a desperdiciar fácilmente **un 30% de mi jornada** esperando a la interfaz.

Por otro lado, todos conocemos AWS CLI. Para las tareas que dominas, es tan rápido como abrir una terminal y lanzar el comando. Pero en cuanto quieres hacer algo con lo que no estás familiarizado, toca documentación y pelearte con los errores iniciales antes de ganar productividad. Y estamos en 2026: lo primero que hacemos antes de abrir esa documentación es pedírselo a la IA y que sea ella la que se pelee con los comandos.

Después de hacer esto varias veces, y cansarme de copiar y pegar, me acordé de una tercera vía: el SDK de AWS (`boto3`). ¿Por qué no encapsular mi caso de uso en un script y dejar que un agente de código lo use libremente? Así solo tendría que pedirle a la IA, en lenguaje natural, la acción que quería ejecutar, y de paso me quedaba un script que yo mismo podía usar si me daba mejor UX que la interfaz.

Esa fue la primera herramienta. Después construí dos más, y las tres tuvieron un destino distinto. De eso va este artículo: hoy construir cuesta casi nada, así que la pregunta ya no es **si puedes construir algo**, sino **si merece existir**.

## Caso 1: Nadie la necesitó

La interfaz de Athena me parece especialmente lenta y pesada, sobre todo con varias bases de datos y múltiples tablas. Estoy acostumbrado a usar DBeaver, y frente a un cliente así la UX de Athena baja drásticamente. En entornos corporativos tampoco sueles tener permisos para configurar servicios como Spectrum, así que esa vía quedaba descartada. Necesitaba mejorar mi flujo de trabajo usando solo la autenticación que ya tenía.

Así que le pedí a Opus, *mi compañero de confianza para estas cosas*, que desarrollara un script sencillo para ejecutar consultas en Athena, con los flags elementales (`workgroup`, perfil AWS, etc.). En **cinco minutos** tenía la herramienta lista, la subí a mi repo, y en pocos minutos más mi agente de código ya hacía consultas a Athena libremente. También podía escribir yo mismo las consultas y ver los resultados en terminal.

La herramienta funcionaba, pero se quedaba corta en cuanto la tabla crecía: solo servía para consultas puntuales de pocas columnas. No sustituía a la interfaz original, y **el dolor que evitaba era menor que el que introducía**.

Nadie de mi equipo llegó a usarla. Yo mismo la usé un par de veces más y luego dejé de tocarla. No falló por mala ejecución, en cinco minutos tenía algo funcional, sino porque resolvía **una molestia mía, puntual, que no era lo bastante frecuente ni lo bastante compartida** como para justificar mantenerla.

Y hay una segunda confirmación, con perspectiva: hoy en mi equipo usamos Kiro, que tiene disponible una tool para interactuar con Athena entre otros servicios de AWS. Mi herramienta hoy sería directamente redundante.

> **Lección 1:** no resuelvas un problema que ya tiene solución. Antes de construir, lo primero es mirar si ya existe.

## Caso 2: El equipo la hizo suya

En este caso el problema era el mismo: la interfaz lenta y tosca. En grandes proyectos de datos, sobre todo al inicio cuando la arquitectura aún se está montando, las depuraciones son constantes. Hubo días en los que modifiqué un job de Glue **15 o 20 veces**. ¿Qué implica ese proceso vía interfaz?

1. Copiar el código al portapapeles.
2. Abrir el navegador.
3. Recargar la sesión de AWS (que se cierra periódicamente, en mi caso cada 30-60 minutos).
4. Navegar a Glue.
5. Entrar al job.
6. Pegar.
7. Guardar.
8. Ejecutar.

Parece rápido, pero fácilmente perdía **5 minutos** por despliegue.

Ya había creado algún script suelto para interactuar con Glue en tareas muy concretas. En ese momento se me encendió la bombilla: qué bien estaría una consola tipo shell para Glue. Volví a llamar a *mi compañero de confianza* y el resultado fue increíble, ni siquiera dediqué tiempo a pensar bien los requisitos, solo definí de forma vaga la UX que quería y que usara únicamente `boto3` como dependencia. En pocos minutos tenía una shell personal con historial de comandos donde podía ver jobs, ejecutarlos, ver logs, descargar y subir código. Lo que antes tardaba **5 minutos** ahora eran **20 segundos**, sin salir de VS Code.

Al principio solo la usaba yo. Cuando terminé de validarla se la enseñé a un compañero, hubo la fricción inicial típica (me puso cara rara). Unos días después me dijo *"estaría bien añadirle esta funcionalidad"*; la semana siguiente, *"mira lo que añadí a la herramienta"*. Eso es el mejor feedback posible.

Hoy la uso a diario. Si necesito revisar logs en profundidad se lo mando a Kiro, que tiene su propia herramienta para eso y lo hace diez veces más rápido que yo. Pero siempre tengo una consola de Glue abierta en mi entorno, para comprobaciones rápidas o relanzar algo a mano.

El ROI ha sido altísimo: minutos de desarrollo inicial más algunas horas puliéndola y añadiendo casos de uso, a cambio de una productividad **x10 o x20**, y la paz mental que la interfaz de AWS nunca dio.

Esta es la diferencia con Athena. Que yo diga que una herramienta es útil no prueba nada; que un compañero la extienda por su cuenta, sin que se lo pida, sí.

> **Lección 2:** la señal que de verdad separa una herramienta adoptada de una que solo parece buena idea es que alguien más invierte su tiempo en mejorarla.

## Caso 3: Aún no sé si merece existir

Cuando estás en medio de una gran migración de datos, uno de los pasos más importantes, quizás el que más, es asegurarte de que los nuevos datos están realmente bien y no ha habido corrupciones en el proceso. Ya sabrás lo que significa eso: queries infernales comparando tablas de decenas de columnas, dolores de cabeza constantes y una fricción inicial alta.

Estas queries hoy las desarrollamos con IA, pero siempre toca ejecutarlas, analizar resultados, ir haciendo pequeños ajustes. Y en el fondo es trabajo mecánico, de poco valor añadido. Una vez detectas las discrepancias, lo que de verdad aporta valor es decidir si lo nuevo es mejor, peor o neutral, y si los nuevos procesos merecen corregirse. Pero eso es la menor parte del tiempo.

Hace unos meses ya había explorado la idea de dar a un LLM acceso a una base de datos mediante un MCP ([lo dejo aquí](https://github.com/edunavata/GPU-MCP) por si interesa), de forma rudimentaria y experimental, aún no estábamos de lleno en la era agéntica. Viendo lo que los agentes de código ya podían hacer, retomé la idea, pero mucho más simple: un enfoque de Skill en lugar de MCP. Creé un script que, usando `boto3`, permitía hacer consultas a Redshift con ciertos guardarraíles (*whitelist*, solo operaciones `SELECT`, credenciales opacas al LLM). Y creé un agente de Kiro al que le expliqué el flujo de validación, con el objetivo de generar un reporte que facilitara la vida al desarrollador encargado de validar.

¿El resultado? En **pocos minutos**, un reporte limpio, obtenido mediante un procedimiento replicable, con todas las queries usadas numeradas y registradas. Ese mismo reporte manualmente lleva **horas**. La herramienta despertó mucho hype en mi equipo, especialmente en usuarios no técnicos, incluso mi jefe validó el valor del reporte en cuanto lo vio. Parece magia pedirle al LLM que revise las tablas nuevas contra las de referencia y obtener un reporte en minutos, con datos reales.

Pero hay algo que remarcar: esta herramienta es joven, ni yo mismo la he usado aún en profundidad. Y ahí está la tensión honesta: **entusiasmo no es lo mismo que uso**. Todavía nadie le ha añadido una función, señalado un fallo, o se ha quejado de que no está en el repo, las mismas señales que sí tuvo Glue y que a Athena nunca llegaron. Tiene potencial, el jefe la validó, el equipo la aplaudió. Pero la pregunta que de verdad importa (¿merece la pena seguir invirtiendo en ella?) todavía no tiene respuesta.

> **Lección 3 (pendiente):** esa respuesta no la voy a decidir yo mirándola, la va a decidir el equipo, usándola o no, en las próximas semanas.

## Conclusiones

Retomemos la cuestión inicial: hoy construir es barato, así que la pregunta relevante no es si puedo construir algo, sino si merece la pena hacerlo. ¿Qué lecciones saco de mi experiencia con estas tres herramientas?

### El dolor debe ser real y frecuente

Si no vas a usar la herramienta durante semanas, o al menos intensamente durante unos días, quizás debas simplemente pedírselo a la IA directamente, o crear la solución más sencilla y desechable posible, gastando el mínimo tiempo. O, por qué no, hacerlo a mano, muchas veces, en el tiempo que pasamos decidiendo si merece la pena, ya lo habríamos hecho manualmente.

**El problema que resuelva debe dolerte a ti y al resto de tu equipo.** Si es una queja recurrente que sale mientras tomáis café, o el target de bromas constantes, ese es un buen candidato a convertirse en herramienta.

### ¿Alguien lo usaría sin que yo se lo pida?

**Esta es la prueba de fuego.** Si el dolor es suficientemente alto, tus compañeros no solo la usarán sin que se lo pidas, vendrán a buscarla en cuanto sepan que existe. En mi caso, hasta la ampliaron por su cuenta.

Con Athena hice justo lo contrario de lo que ahora recomendaría: la construí para un dolor que sentía yo solo, sin comprobar si alguien más lo compartía, y por eso nadie la reclamó. Con Glue no pregunté a nadie antes de construirla, el dolor era mío y lo bastante fuerte como para justificarla igualmente, pero la señal de que valía la pena mantenerla vino después, cuando la usaron sin que se la ofreciera. Ahí está la diferencia: **preguntar antes te ahorra construir para un dolor que era solo tuyo; la adopción posterior es la que confirma si de verdad merecía la pena**.

### ¿El ahorro se nota?

A menudo, queriendo simplificar nuestro flujo de trabajo, lo acabamos complicando en exceso, gastando una gran cantidad de tiempo y energía en ese proceso de optimización redundante. Como comenté antes, en muchas ocasiones, tras intentar hacer algo más sencillo me vi a mí mismo pensando: "si lo hubiera hecho manualmente ya estaría hecho".

Personalmente me gusta estimar:

- ¿Cuánto malgasto en esta tarea?
- ¿Cuántas veces lo hago a la semana?
- ¿Durante cuánto tiempo voy a tener que hacerlo?
- ¿Cuántas más personas tendrán que hacerlo?

La idea de fondo es calcular cuántas horas se malgastan y, por tanto, cuánto dinero cuesta ese problema.

Si te encuentras con un punto de dolor personal, pero solo tendrás que lidiar con él durante un periodo de tiempo reducido, quizás no merezca la pena gastar tu tiempo, energía mental y tokens automatizándolo.

### Y si construyes, aplica el 80/20

Una vez decides que merece la pena, no lo conviertas en un producto. Glue nació sin que dedicara tiempo a pensar los requisitos: definí de forma vaga la UX y poco más. **Ese 20% de esfuerzo capturó el 80% del valor**, y lo que faltaba lo añadió el equipo cuando de verdad lo necesitó. Construir lo mínimo también te protege: si resulta que la herramienta era un error, como Athena, has perdido **minutos**, no días. A veces lo correcto es construir algo sabiendo que vivirá una semana, usarlo y tirarlo. Eso no es un fracaso; es exactamente para lo que sirve que construir cueste casi nada.

---

Antes de tener acceso a un LLM que programa por mí, el coste de construir una herramienta ya filtraba solo la mayoría de las malas ideas: si algo no merecía dos días de mi tiempo, ni siquiera lo intentaba. **Ese filtro ha desaparecido.** Hoy puedo construir en minutos algo que antes me habría costado una tarde, y eso es una ventaja enorme, pero también significa que ya nada me impide construir cosas que no debería.

Athena, Glue y Redshift cuestan lo mismo en tiempo de desarrollo: **minutos**. La diferencia no está en cómo las construí, sino en **si merecían existir**, y esa pregunta ahora tengo que hacérmela yo, porque el LLM no la va a hacer por mí.

Antes medía una herramienta por lo que costaba construirla. Hoy la mido por algo más simple: **si desapareciera mañana, ¿alguien la echaría de menos?**

| Herramienta | ¿Alguien la echaría de menos? |
| --- | --- |
| Athena | Nadie |
| Glue | Todo el equipo |
| Redshift | Todavía no lo sé |

Y por eso, con Redshift, todavía no sé si merecía existir.

> Construir ya dejó de ser el problema. Decidir qué merece existir es el trabajo que queda.
