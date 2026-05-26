# SalaDeJuegos

### Desarrollado por: Martín Hernán Esquivel

### Proyecto en producción
- **Link del deploy** (https://parcial1-progra-iv.vercel.app/)

---

## Tecnologías utilizadas:
- **Frontend:** Angular.
- **Estilos:** Bootstrap.
- **APIs externas:** - GitHub API (Para la sección "Quien soy"). [OpenTDB API](https://opentdb.com/) (para "Preguntados")
- **Hosting / deploy:** Vercel.

---
## Funcionalidades principales:
* **autenticación:** Sistema de Login y Registro persistente integrado con Supabase Auth.
* **juegos:**
* **Ahorcado:** Adivinanza de palabras
* **Mayor o Menor:** Juego de cartas con manejo de baraja y estadística.
* **Preguntados:** Trivia tematica con consumo de api externa
* **Conquista galactica (Juego propio):** Juego por turnos con probabilidad
---
## Estado actual del proyecto
* **Sprint #1:** Creación del proyecto. Se crearon los componentes Login, Registro, Bienvenida/Home y Quién soy. Se incluye navegación entre componentes a través de un nav disponible en todo momento sin limites de accesibilidad. Se comenzó con la configuración de rutas y se empezó a estilizar la página en general. Se vinculó la API de GitHub para mostrar en el componente "Quién soy" distintos datos del usuario, tales como nombre, foto de perfil, descripción. Además, se explica la elección del juego propio y los controles básicos.
* **Sprint #2:** Implementación de Login/Registro y sistema de autenticación básica con Supabase.
* **Sprint #3:** Implementación de persistencia de datos con Supabase. Desarrollo de "Ahorcado" y "Mayor o Menor". Desarrollo de sala de chat en tiempo real.
* **Sprint #4:** Juegos "Preguntados" y "Conquista galactica" (juego propio), sistema de rankings (page de Resultados).
